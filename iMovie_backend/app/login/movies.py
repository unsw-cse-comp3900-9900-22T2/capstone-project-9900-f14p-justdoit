from flask import jsonify, Blueprint, request, g
from sqlalchemy import exists,func
from app.login.utils import *
from app.models import *


def res_movie_detail(uid, user, movie):
    result = {}
    mid = movie.mid
    result["mid"] = mid
    result["moviename"] = movie.moviename
    result["description"] = movie.description
    result["coverimage"] = movie.coverimage
    # split string (去空格)
    genre_list = movie.genre.split(" ")
    result["genre"] = genre_list
    result["cast"] = movie.cast
    result["crew"] = movie.crew
    result["director"] = movie.director
    result["duration"] = movie.duration
    result["country"] = movie.country
    result["language"] = movie.language
    if movie.avg_rate:
        result["avg_rate"] = movie.avg_rate
    else:
        result["avg_rate"] = -1
    result["release_date"] = movie.release_date
    if movie.year:
        result["year"] = movie.year
    else:
        result["year"] = 0
    num_wish = wishWatchModel.query.filter(wishWatchModel.mid == mid, wishWatchModel.type == 0,
                                           wishWatchModel.active == 1).count()
    result["wishlist_num"] = num_wish

    num_watch = wishWatchModel.query.filter(wishWatchModel.mid == mid, wishWatchModel.type == 1,
                                            wishWatchModel.active == 1).count()
    result["watchlist_num"] = num_watch

    num_like = movielikeModel.query.filter(movielikeModel.mid == mid, movielikeModel.type == 0,
                                           movielikeModel.active == 1).count()

    result["num_like"] = num_like
    if uid and user:
        # check wish or not
        user_wish = wishWatchModel.query.filter(wishWatchModel.mid == mid, wishWatchModel.uid == uid,
                                                wishWatchModel.type == 0,
                                                wishWatchModel.active == 1).first()
        # print(user_wish)
        if user_wish:
            is_user_wish = 1
            result["wish_ctime"] = user_wish.ctime
        else:
            is_user_wish = 0
            result["wish_ctime"] = None
        result["is_user_wish"] = is_user_wish


        # check watch or not
        user_watch = wishWatchModel.query.filter(wishWatchModel.mid == mid, wishWatchModel.uid == uid,
                                                 wishWatchModel.type == 1,
                                                 wishWatchModel.active == 1).first()
        if user_watch:
            is_user_watch = 1
            result["watch_ctime"] = user_watch.ctime
        else:
            is_user_watch = 0
            result["watch_ctime"] = None
        result["is_user_watch"] = is_user_watch

        # check like or not
        user_like = movielikeModel.query.filter(movielikeModel.mid == mid, movielikeModel.uid == uid,
                                                movielikeModel.type == 0,
                                                movielikeModel.active == 1).first()
        if user_like:
            is_user_like = 1
            result["like_ctime"] = user_like.ctime
        else:
            is_user_like = 0
            result["like_ctime"] = None
        result["is_user_like"] = is_user_like

        # check dislike or not
        user_dislike = movielikeModel.query.filter(movielikeModel.mid == mid, movielikeModel.uid == uid,
                                                   movielikeModel.type == 1,
                                                   movielikeModel.active == 1).first()
        if user_dislike:
            is_user_dislike = 1
            result["dislike_ctime"] = user_dislike.ctime
        else:
            is_user_dislike = 0
            result["dislike_ctime"] = None
        result["is_user_dislike"] = is_user_dislike

        # check rate or not
        check_rate = RatingModel.query.filter(RatingModel.uid == uid, RatingModel.mid == mid,
                                              RatingModel.active == 1).first()
        if check_rate:
            is_user_rate = check_rate.rate
            result["rating_ctime"] = check_rate.ctime
        else:
            is_user_rate = -1
            result["rating_ctime"] = None
        result["is_user_rate"] = is_user_rate

    return result





def get_movie_detail():
    data = request.get_json(force=True)
    mid = data["mid"]
    uid = data["uid"]
    user = None
    if uid:
        user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    # print(mid)
    # find in database
    movie = MoviesModel.query.filter(MoviesModel.mid == mid, MoviesModel.active == 1).first()
    # if there is not movie
    if not movie:
        return jsonify({'code': 400, 'msg': 'Sorry you can not view the movie details'})
    result = res_movie_detail(uid, user, movie)

    return jsonify({'code': 200, 'result': result})



def get_movies():
    uid = request.json.get('uid')
    user = None
    if uid:
        user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()

    num = 0
    movie = MoviesModel.query.filter(MoviesModel.active == 1).all()
    result = {}
    mlist = []
    for i in movie:
        if num >= 16:
            break;
        mdict = res_movie_detail(uid, user, i)
        num = num + 1
        mlist.append(mdict)
    result["count"] = num
    result["mlist"] = mlist
    return jsonify({'code': 200, 'result': result})




def rating_movie():
    mid = request.json.get('mid')
    uid = request.json.get('uid')
    rate = request.json.get('rate')

    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'User is not defined'})
    movie = MoviesModel.query.filter(MoviesModel.mid == mid, MoviesModel.active == 1).first()
    if not movie:
        return jsonify({'code': 400, 'msg': 'Sorry you can not view the movie details'})

    rate_tentimes = float(rate) * 10
    if rate_tentimes % 5 != 0:
        return jsonify({'code': 400, 'msg': 'Wrong rating'})

    if rate<0 or rate>5:
        return jsonify({'code': 400, 'msg': 'Wrong rating'})
    check_rate = RatingModel.query.filter(RatingModel.uid == uid, RatingModel.mid == mid, RatingModel.active == 1).first()
    if check_rate:
        check_rate.rate = rate
        check_rate.utime = getTime()[0]
        db.session.commit()
    else:
        #add
        try:
            raid = getUniqueid()
            time_form = getTime()[0]
            rate_insert = RatingModel(raid=raid, uid=uid, mid=mid, rate=rate, ctime=time_form,
                             utime=time_form)
            db.session.add(rate_insert)
            db.session.commit()
        except Exception as e:
            return jsonify({'code': 400, 'msg': 'Rating failure', 'error_msg': str(e)})


    # if a movie be rated then this movie will be add in watched list ,and remove from wishlist
    wish_list = wishWatchModel.query.filter(wishWatchModel.uid == uid, wishWatchModel.mid == mid, wishWatchModel.type == 0, wishWatchModel.active == 1).first()
    if wish_list:
        wish_list.type = 1
        wish_list.utime = getTime()[0]
        db.session.commit()
    else:
        watchlist = wishWatchModel.query.filter(wishWatchModel.uid == uid, wishWatchModel.mid == mid, wishWatchModel.type == 1, wishWatchModel.active == 1).first()
        if not watchlist:
            wid = getUniqueid()
            timeform = getTime()[0]
            wish_watch_list = wishWatchModel(wid=wid, type=1, uid=uid, mid=mid, ctime=timeform, utime=timeform)
            db.session.add(wish_watch_list)
            db.session.commit()


    # calculate avg rate
    all_rate = 0
    num = 0
    avg_rate_new = 0
    cal_rate = RatingModel.query.filter(RatingModel.mid == mid, RatingModel.active == 1).all()
    for item in cal_rate:
        all_rate = all_rate + item.rate
        num = num + 1
    if num != 0:
        avg_rate_new = float(all_rate/num)
    try:
        movie.avg_rate = avg_rate_new
        movie.utime = getTime()[0]
        db.session.commit()
        result = {}
        result["avg_rate"] = avg_rate_new
        return jsonify({'code': 200, 'msg': 'Successful rating', "result": result})
    except Exception as e:
        return jsonify({'code': 400, 'msg': 'Rating failure', 'error_msg': str(e)})




# 0: add time, 1: highest  rating,2: lowest rating , 3:released data，null: not sort
def get_wishlist():
    data = request.get_json(force=True)
    # print(data)
    page_index = data["page_index"]
    page_size = data["page_size"]
    sort_by = data["sort_by"]
    uid = data["uid"]
    # check uid
    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'User does not exist'})
    wishlist = wishWatchModel.query.filter(wishWatchModel.uid == uid, wishWatchModel.type == 0, wishWatchModel.active == 1).all()
    if not wishlist:
        return jsonify({'code': 200, 'msg': 'Wishlist is empty'})
    print(wishlist)
    try:
        result = {}
        result["count"] = len(wishlist)
        list = []
        for m in wishlist:
            movie = MoviesModel.query.filter(MoviesModel.mid == m.mid, MoviesModel.active == 1).first()
            movie_info = res_movie_detail(uid, user, movie)
            list.append(movie_info)
        # print(sort_by)
        if sort_by is not None:
            if sort_by == 0:
                # when add
                res_list = list
            elif sort_by == 1:
                # highest rate
                res_list = sorted(list, key=lambda m: m['avg_rate'], reverse=True)
            elif sort_by == 2:
                # highest rate
                res_list = sorted(list, key=lambda m: m['avg_rate'])
            elif sort_by == 3:
                res_list = sorted(list, key=lambda m: m['year'], reverse=True)
            else:
                return jsonify({'code': 400, 'msg': 'Invalid command.'})
        else:
            # print("默认")
            res_list = sorted(list, key=lambda m:m['wish_ctime'], reverse=True)
        start = page_index * page_size
        end = start + page_size
        if end < result["count"]:
            result["list"] = res_list[start:end]
        else:
            result["list"] = res_list[start:]

        return jsonify({'code': 200, 'result': result})
    except Exception as e:
        return jsonify({'code': 400, 'msg': 'Get wishlist failed.', 'error_msg': str(e)})


def wishlist_add_or_delete():
    data = request.get_json(force=True)
    # print(data)
    add_or_del = data["add_or_del"]
    uid = data["uid"]
    mid = data["mid"]
    # check uid and mid
    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'User does not exist'})
    movie = MoviesModel.query.filter(MoviesModel.mid == mid, MoviesModel.active == 1).first()
    if not movie:
        return jsonify({'code': 400, 'msg': 'Movie does not exist'})
    # uid和mid是否已经存在过wish里面, 只看active是1的
    if add_or_del == "add":
        wish_movie = wishWatchModel.query.filter(wishWatchModel.uid == uid, wishWatchModel.mid == mid,
                                                 wishWatchModel.type == 0, wishWatchModel.active == 1).first()
        if wish_movie:
            return jsonify({'code': 200, 'msg': 'Movie is already in wish list.'})
        try:
            wid = getUniqueid()
            timeform = getTime()[0]
            wishlist = wishWatchModel(wid=wid, type=0, uid=uid, mid=mid, ctime=timeform, utime=timeform)
            db.session.add(wishlist)
            db.session.commit()
            return jsonify({'code': 200, 'msg': 'Addition succeed.'})
        except Exception as e:
            return jsonify({'code': 400, 'msg': 'Addition failed.', 'error_msg': str(e)})
    elif add_or_del == "delete":
        wish_movie = wishWatchModel.query.filter(wishWatchModel.uid == uid, wishWatchModel.mid == mid,
                                                 wishWatchModel.type == 0, wishWatchModel.active == 1).first()
        if not wish_movie:
            return jsonify({'code': 400, 'msg': 'Movie is not in wish list.'})
        try:
            wish_movie.active = 0
            wish_movie.utime = getTime()[0]
            db.session.commit()
            return jsonify({'code': 200, 'msg': 'Deletion succeed.'})
        except Exception as e:
            return jsonify({'code': 400, 'msg': 'Deletion failed.', 'error_msg': str(e)})
    else:
        return jsonify({'code': 400, 'msg': 'Invalid command.'})


def clear_wishlist():
    data = request.get_json(force=True)
    # print(data)
    uid = data["uid"]
    # check uid
    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'User does not exist'})
    wishlist = wishWatchModel.query.filter(wishWatchModel.uid == uid, wishWatchModel.type == 0,
                                           wishWatchModel.active == 1).all()
    if not wishlist:
        return jsonify({'code': 200, 'msg': 'Wishlist is empty'})
    try:
        for wish_m in wishlist:
            wish_m.active = 0
            wish_m.utime = getTime()[0]
            db.session.commit()
        return jsonify({'code': 200, 'msg': 'Wishlist clear succeed'})
    except Exception as e:
        return jsonify({'code': 400, 'msg': 'Get wishlist failed.', 'error_msg': str(e)})


# browse by
# includes:
#           2. movies sorted from most popular to least basic on average rating
#           3. 排序根据首字母
def browse_by():
    data = request.get_json(force=True)
    uid = data["uid"]
    user = None
    count = 0
    page_index = data["page_index"]
    page_size = data["page_size"]
    rating = data["rating"]
    if uid:
        user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    movies = MoviesModel.query.filter(MoviesModel.active == 1).all()
    try:
        result = {}
        movie_list = []
        for movie in movies:            # movies: [movies0, movies[1]....]
                if movie.avg_rate > -1:
                    movie_info = res_movie_detail(uid, user, movie)
                    movie_list.append(movie_info)
                    count += 1
        result["count"] = count
        keyword = 'avg_rate'
        if rating == 0:
            # from high to low depends on avg_rate
            res_avg_rate_list = sorted(movie_list, key=lambda m: m[keyword], reverse=True)
            # from low to high depends on avg_rate
        elif rating == 1:
            res_avg_rate_list = sorted(movie_list, key=lambda m: m[keyword])
            #default:  order by alphabetical
        else:
            res_avg_rate_list = sorted(movie_list, key=lambda m: m['moviename'])

        res_list = orderBy_alphabetical(res_avg_rate_list, keyword)
        print_avg_rate(res_list)


        start = page_index * page_size
        end = start + page_size
        if end < result["count"]:
            result["list"] = res_list[start:end]
        else:
            result["list"] = res_list[start:]
        return jsonify({'code': 200, 'result': result})

    except Exception as e:
        return jsonify({'code': 400, 'msg': 'Browseby failed.'})
