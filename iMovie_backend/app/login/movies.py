from flask import jsonify, Blueprint, request, g
from sqlalchemy import exists,func
from app.login.utils import *
from app.models import *


def get_movie_detial():
    data = request.get_json(force=True)
    mid = data["mid"]
    uid = data["uid"]
    if uid:
        user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    # print(mid)
    # find in database
    movie = MoviesModel.query.filter(MoviesModel.mid == mid, MoviesModel.active == 1).first()
    # if there is not movie
    if not movie:
        return jsonify({'code': 400, 'msg': 'Sorry you can not view the movie details'})
    result = {}
    result["mid"] = movie.mid
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
    result["avg_rate"] = movie.avg_rate
    result["release_date"] = movie.release_date

    num_wish = wishWatchModel.query.filter(wishWatchModel.mid == mid, wishWatchModel.type == 0,wishWatchModel.active == 1).count()
    result["wishlist_num"] = num_wish

    num_watch = wishWatchModel.query.filter(wishWatchModel.mid == mid,wishWatchModel.type == 1,wishWatchModel.active == 1).count()
    result["watchlist_num"] = num_watch

    num_like = movielikeModel.query.filter(movielikeModel.mid == mid, movielikeModel.type == 0,
                                           movielikeModel.active == 1).count()

    result["num_like"] = num_like
    if uid and user:
        user_wish = wishWatchModel.query.filter(wishWatchModel.mid == mid, wishWatchModel.uid == uid,
                                                wishWatchModel.type == 0,
                                                wishWatchModel.active == 1).count()
        if user_wish > 0:
            is_user_wish = 1
        else:
            is_user_wish = 0
        result["is_user_wish"] = is_user_wish
        user_watch = wishWatchModel.query.filter(wishWatchModel.mid == mid, wishWatchModel.uid == uid,
                                                 wishWatchModel.type == 1,
                                                 wishWatchModel.active == 1).count()
        if user_watch > 0:
            is_user_watch = 1
        else:
            is_user_watch = 0
        result["is_user_watch"] = is_user_watch
        user_like = movielikeModel.query.filter(movielikeModel.mid == mid, movielikeModel.uid == uid,
                                                movielikeModel.type == 0,
                                                movielikeModel.active == 1).count()
        if user_like > 0:
            is_user_like = 1
        else:
            is_user_like = 0
        result["is_user_like"] = is_user_like
        user_dislike = movielikeModel.query.filter(movielikeModel.mid == mid, movielikeModel.uid == uid,
                                                   movielikeModel.type == 1,
                                                   movielikeModel.active == 1).count()
        if user_dislike > 0:
            is_user_dislike = 1
        else:
            is_user_dislike = 0
        result["is_user_dislike"] = is_user_dislike

    return jsonify({'code': 200, 'result': result})



def get_movies():
    uid = request.json.get('uid')
    if uid:
        user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()

    num = 0
    movie = MoviesModel.query.filter(MoviesModel.active == 1).all()
    result = {}
    mlist = []
    for i in movie:
        if num >= 16:
            break;
        mdict = {}
        mdict["mid"] = i.mid
        mdict["moviename"] = i.moviename
        mdict["description"] = i.description
        mdict["coverimage"] = i.coverimage


        # split string (去空格)
        genre_list = i.genre.split(" ")
        mdict["genre"] = genre_list
        mdict["cast"] = i.cast
        mdict["director"] = i.director
        mdict["language"] = i.language
        mdict["avg_rate"] = i.avg_rate
        mdict["release_date"] = i.release_date

        num_wish = wishWatchModel.query.filter(wishWatchModel.mid == i.mid, wishWatchModel.type == 0,
                                               wishWatchModel.active == 1).count()
        mdict["wishlist_num"] = num_wish
        num_watch = wishWatchModel.query.filter(wishWatchModel.mid == i.mid,wishWatchModel.type == 1,wishWatchModel.active == 1).count()
        mdict["watchlist_num"] = num_watch

        num_like = movielikeModel.query.filter(movielikeModel.mid == i.mid, movielikeModel.type == 0,
                                                movielikeModel.active == 1).count()
        mdict["num_like"] = num_like
        if uid and user:
            user_wish = wishWatchModel.query.filter(wishWatchModel.mid == i.mid,wishWatchModel.uid == uid, wishWatchModel.type == 0,
                                                   wishWatchModel.active == 1).count()
            if user_wish > 0:
                is_user_wish = 1
            else:
                is_user_wish = 0
            mdict["is_user_wish"] = is_user_wish
            user_watch = wishWatchModel.query.filter(wishWatchModel.mid == i.mid, wishWatchModel.uid == uid,
                                                    wishWatchModel.type == 1 ,
                                                    wishWatchModel.active == 1).count()
            if user_watch > 0:
                is_user_watch = 1
            else:
                is_user_watch = 0
            mdict["is_user_watch"] = is_user_watch
            user_like = movielikeModel.query.filter(movielikeModel.mid == i.mid, movielikeModel.uid == uid,
                                                     movielikeModel.type == 0,
                                                     movielikeModel.active == 1).count()
            if user_like > 0:
                is_user_like = 1
            else:
                is_user_like = 0
            mdict["is_user_like"] = is_user_like
            user_dislike = movielikeModel.query.filter(movielikeModel.mid == i.mid, movielikeModel.uid == uid,
                                                    movielikeModel.type == 1,
                                                    movielikeModel.active == 1).count()
            if user_dislike > 0:
                is_user_dislike = 1
            else:
                is_user_dislike = 0
            mdict["is_user_dislike"] = is_user_dislike

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
            user = RatingModel(raid=raid, uid=uid, mid=mid, rate=rate, ctime=time_form,
                             utime=time_form)
            db.session.add(user)
            db.session.commit()


        except Exception as e:
            return jsonify({'code': 400, 'msg': 'Rating failure', 'error_msg': str(e)})
    # calculate avg rate
    all_rate = 0
    num = 0
    avg_rate = 0
    cal__rate = RatingModel.query.filter(RatingModel.mid == mid, RatingModel.active == 1).all()
    for item in cal__rate:
        all_rate = all_rate + item.rate
        num = num + 1
    if num != 0:
        avg_rate = float(all_rate/num)
    try:
        movie.avg_rate = avg_rate
        movie.utime = getTime()[0]
        db.session.commit()
        return jsonify({'code': 200, 'msg': 'Successful rating'})
    except Exception as e:
        return jsonify({'code': 400, 'msg': 'Rating failure', 'error_msg': str(e)})





def get_wishlist():
    data = request.get_json(force=True)
    print(data)
    uid = data["uid"]
    # check uid
    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'User does not exist'})
    wishlist = wishWatchModel.query.filter(wishWatchModel.uid == uid, wishWatchModel.type == 0, wishWatchModel.active == 1).all()
    if not wishlist:
        return jsonify({'code': 200, 'msg': 'Wishlist is empty'})
    try:
        result = {}
        result["count"] = len(wishlist)
        list = []
        for m in wishlist:
            movie = MoviesModel.query.filter(MoviesModel.mid == m.id, MoviesModel.active == 1).first()
            # movie_info: mid, moviename, genre, director, avg_rate, release_date
            movie_info = {}
            movie_info["mid"] = movie.mid
            movie_info["moviename"] = movie.moviename
            movie_info["genre"] = movie.genre
            movie_info["director"] = movie.director
            if movie.avg_rate:
                movie_info["avg_rate"] = movie.avg_rate
            else:
                movie_info["avg_rate"] = -1
            movie_info["release_date"] = movie.release_date
            list.append(movie_info)
        result["list"] = list
        return jsonify({'code': 200, 'result': result})
    except Exception as e:
        return jsonify({'code': 400, 'msg': 'Get wishlist failed.', 'error_msg': str(e)})


def add_to_wishlist():
    data = request.get_json(force=True)
    # print(data)
    uid = data["uid"]
    mid = data["mid"]
    # check uid and mid
    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'User does not exist'})
    movie = MoviesModel.query.filter(MoviesModel.mid == mid, MoviesModel.active == 1).first()
    if not movie:
        return jsonify({'code': 400, 'msg': 'Movie does not exist'})
    # uid和mid是否已经存在过wish或者watched里面, 只看active是1的
    user_movie = wishWatchModel.query.filter(wishWatchModel.uid == uid, wishWatchModel.mid == mid, wishWatchModel.active == 1).first()
    if user_movie:
        return jsonify({'code': 200, 'msg': 'Movie is already in wishlist or watched list.'})
    try:
        wid = getUniqueid()
        timeform = getTime()[0]
        wishlist = wishWatchModel(wid=wid, type=0, uid=uid, mid=mid, ctime=timeform, utime=timeform)
        db.session.add(wishlist)
        db.session.commit()
        return jsonify({'code': 200, 'msg': 'Addition succeed.'})
    except Exception as e:
        return jsonify({'code': 400, 'msg': 'Addition failed.', 'error_msg': str(e)})


# def delete_from_wishlist():
#     data = request.get_json(force=True)
#     print(data)
#     uid = data["uid"]
#     mid = data["mid"]
#     # check uid and mid
#     user = UserModel.query.filter(UserModel.uid == uid).first()
#     if not user:
#         return jsonify({'code': 400, 'msg': 'User does not exist'})
#     movie = MoviesModel.query.filter(MoviesModel.mid == mid).first()
#     # if not movie:
#     #     return jsonify({'code': 400, 'msg': 'Movie does not exist'})
#     # uid和mid是否已经存在过wish或者watched里面, 只看active是1的
#     user_movie = wishWatchModel.query.filter(wishWatchModel.type == 0, wishWatchModel.uid == uid, wishWatchModel.mid == mid,
#                                              wishWatchModel.active == 1).first()
#     if not user_movie:
#         return jsonify({'code': 400, 'msg': 'Movie is not in wish list.'})
#     try:
#         timeform = getTime()[0]
#         wishlist = wishWatchModel(active=0, utime=timeform)
#         db.session.add(wishlist)
#         db.session.commit()
#         return jsonify({'code': 200, 'msg': 'Deletion succeed.'})
#     except Exception as e:
#         return jsonify({'code': 400, 'msg': 'Deletion failed.', 'error_msg': str(e)})

#
#
# def clear_wishlist():




