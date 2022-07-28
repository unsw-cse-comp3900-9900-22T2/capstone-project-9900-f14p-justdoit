from flask import jsonify, Blueprint, request, g
from sqlalchemy import exists, func
from app.login.utils import *
# from app.login.recommend import *
from app.models import *
from sqlalchemy import or_, and_, not_

def res_movie_detail(uid, user, movie):
    result = {}
    mid = movie.mid
    result["mid"] = mid
    result["moviename"] = movie.moviename
    result["description"] = movie.description
    result["coverimage"] = movie.coverimage
    # split string (去空格)
    genre = movie.genre
    genre.lower()
    genre_list = genre.split(" ")
    genre_cap = []
    for i in genre_list:
        genre_cap.append(i.capitalize())
        # print(i.capitalize())
    result["genre"] = genre_cap
    cast_list = movie.cast.split(";")
    result["cast"] = cast_list
    # result["crew"] = movie.crew
    result["director"] = movie.director
    result["duration"] = movie.duration
    result["country"] = movie.country
    result["language"] = movie.language
    if movie.avg_rate:
        result["avg_rate"] = round(movie.avg_rate, 1)
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
            result["wish_utime"] = user_wish.utime
        else:
            is_user_wish = 0
            result["wish_utime"] = None
        result["is_user_wish"] = is_user_wish

        # check watch or not
        user_watch = wishWatchModel.query.filter(wishWatchModel.mid == mid, wishWatchModel.uid == uid,
                                                 wishWatchModel.type == 1,
                                                 wishWatchModel.active == 1).first()
        if user_watch:
            is_user_watch = 1
            result["watch_utime"] = user_watch.utime
        else:
            is_user_watch = 0
            result["watch_utime"] = None
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
            if check_rate.rate > 0:
                is_user_rate = check_rate.rate
                result["rating_ctime"] = check_rate.ctime
            else:
                is_user_rate = -1
                result["rating_ctime"] = None
        else:
            is_user_rate = -1
            result["rating_ctime"] = None
        result["is_user_rate"] = is_user_rate

    return result

# simplify the res_movie_detail
# display the mid, cast, director,genre, & moviename
def res_movie_detail_spf(uid, user, movie):
    result = {}
    mid = movie.mid
    result["mid"] = mid
    result["moviename"] = movie.moviename
    # split string (去空格)
    genre = movie.genre
    genre.lower()
    genre_list = genre.split(" ")
    genre_cap = []
    for i in genre_list:
        genre_cap.append(i.capitalize())
        # print(i.capitalize())
    result["genre"] = genre_cap
    cast_list = movie.cast.split(";")
    result["cast"] = cast_list
    # result["crew"] = movie.crew
    result["director"] = movie.director
    if movie.year:
        result["year"] = movie.year
    else:
        result["year"] = 0
    return result

def get_movie_detail():
    data = request.get_json(force=True)
    mid = data["mid"]
    uid = data["uid"]
    user = None
    if uid:
        user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    # find in database
    movie = MoviesModel.query.filter(MoviesModel.mid == mid, MoviesModel.active == 1).first()
    # if there is not movie
    if not movie:
        return jsonify({'code': 400, 'msg': 'Sorry you can not view the movie details'})
    result = res_movie_detail(uid, user, movie)

    return jsonify({'code': 200, 'result': result})
# def count_history():
#     history_dict = {}
#     history = viewhistoryModel.query.all()
#     for i in history:
#
#         # print(i.uid, i.mid, i.rate)
#         if history_dict.get(i.mid) == None:
#
#             history_dict.setdefault(i.mid, i.frequency)
#         else:
#             history_dict[i.mid] = history_dict[i.mid] + i.frequency
#
#     a1 = sorted(history_dict.items(), key=lambda x: x[1], reverse=True)
#     for f in a1:
#
#     return history_dict


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
            break
        mdict = res_movie_detail(uid, user, i)
        if "Music" not in mdict["genre"]:
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

    if rate < 0 or rate > 5:
        return jsonify({'code': 400, 'msg': 'Wrong rating'})
    check_rate = RatingModel.query.filter(RatingModel.uid == uid, RatingModel.mid == mid,
                                          RatingModel.active == 1).first()
    if check_rate:
        if rate == 0:
            check_rate.active = 0
            check_rate.utime = getTime()[0]
            db.session.commit()
        else:
            check_rate.rate = rate
            check_rate.utime = getTime()[0]
            db.session.commit()
    else:
        # add
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
    wish_list = wishWatchModel.query.filter(wishWatchModel.uid == uid, wishWatchModel.mid == mid,
                                            wishWatchModel.type == 0, wishWatchModel.active == 1).first()
    if wish_list:
        wish_list.type = 1
        wish_list.utime = getTime()[0]
        db.session.commit()
    else:
        watchlist = wishWatchModel.query.filter(wishWatchModel.uid == uid, wishWatchModel.mid == mid,
                                                wishWatchModel.type == 1, wishWatchModel.active == 1).first()
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
        avg_rate_new = float(all_rate / num)
    try:
        movie.avg_rate = avg_rate_new
        movie.utime = getTime()[0]
        db.session.commit()
        result = {"avg_rate": round(avg_rate_new, 1)}
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
    wishlist = wishWatchModel.query.filter(wishWatchModel.uid == uid, wishWatchModel.type == 0,
                                           wishWatchModel.active == 1).all()
    if not wishlist:
        return jsonify({'code': 200, 'msg': 'Wishlist is empty'})
    # print(wishlist)
    try:
        result = {"count": len(wishlist)}
        list = []
        for m in wishlist:
            movie = MoviesModel.query.filter(MoviesModel.mid == m.mid, MoviesModel.active == 1).first()
            if movie:
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
            res_list = sorted(list, key=lambda m: m['wish_utime'], reverse=True)

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

    if add_or_del == "add":
        wish_movie = wishWatchModel.query.filter(wishWatchModel.uid == uid, wishWatchModel.mid == mid,
                                                 wishWatchModel.type == 0, wishWatchModel.active == 1).first()
        if wish_movie:
            return jsonify({'code': 200, 'msg': 'Movie is already in wishlist.'})
        watch_movie = wishWatchModel.query.filter(wishWatchModel.uid == uid, wishWatchModel.mid == mid,
                                                  wishWatchModel.type == 1, wishWatchModel.active == 1).first()
        if watch_movie:
            watch_movie.type = 0
            watch_movie.utime = getTime()[0]
            db.session.commit()
            return jsonify({'code': 200, 'msg': 'Add movie from watchlist to wishlist.'})
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


def wish_to_watch():
    data = request.get_json(force=True)
    # print(data)
    uid = data["uid"]
    # check uid
    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'User does not exist.'})
    wishlist = wishWatchModel.query.filter(wishWatchModel.uid == uid, wishWatchModel.type == 0,
                                           wishWatchModel.active == 1).all()
    if not wishlist:
        return jsonify({'code': 200, 'msg': 'Wishlist is empty.'})
    try:
        for wish_m in wishlist:
            wish_m.type = 1
            wish_m.utime = getTime()[0]
            db.session.commit()
        return jsonify({'code': 200, 'msg': 'Turn all movies on wishlist to watchlist successfully.'})
    except Exception as e:
        return jsonify({'code': 400, 'msg': 'Get wishlist failed.', 'error_msg': str(e)})


# browse by
# 0 ： high to low，1： low to high
def browse_by():
    data = request.get_json(force=True)
    uid = data["uid"]
    user = None
    count = 0
    page_index = data["page_index"]
    page_size = data["page_size"]
    rating = data["rating"]
    year = data["year"]
    genre = data["genre"]
    country  = data["country"]
    yearList = year_strToList(year)
    genreList = strToList(genre)
    countryList = strToList(country)
    countryList2 = ["USA", "UK", "Australia", "France", "Germany", "Italy", "India", "China", "Korea", "Japan", "Thailand"]
    if uid:
        user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    try:
        res_list = []
        result = {}
        # add genre_rule, country_rule
        # if null, return all results
        # else return the genre contains keyword

        # movies include both keyword at same time
        genre_rule = and_(*[MoviesModel.genre.ilike("%" +input+"%") for input in genreList])
        # movies include either keyword

        # if "others", display those not popular countries
        if len(countryList) == 1 and countryList[0] == "Others":
            country_rule = not_(MoviesModel.country.in_(countryList2))
        else:
            country_rule = or_(*[MoviesModel.country.ilike("%" +input+"%") for input in countryList])

        if rating is None and year is None:
            movies = MoviesModel.query.filter(MoviesModel.active == 1,genre_rule, country_rule).order_by("moviename").all()
            for movie in movies:            # movies: [movies0, movies[1]....]
                movie_info = res_movie_detail(uid, user, movie)
                res_list.append(movie_info)
                count += 1
            result["count"] = count
        elif rating is None:
            if yearList[0] == -1:
                movies = MoviesModel.query.filter(MoviesModel.active == 1, MoviesModel.year <= 1997,genre_rule, country_rule).order_by(
                    "moviename").all()
            else:
                movies = MoviesModel.query.filter(MoviesModel.active == 1, MoviesModel.year.in_(yearList),genre_rule, country_rule).order_by(
                    "moviename").all()
            for movie in movies:  # movies: [movies0, movies[1]....]
                movie_info = res_movie_detail(uid, user, movie)
                res_list.append(movie_info)
                count += 1
            result["count"] = count
        else:
            if len(yearList) == 0:
                unrated_movies = MoviesModel.query.filter(MoviesModel.active == 1,
                                                          MoviesModel.avg_rate is None,genre_rule, country_rule).order_by("moviename").all()
            else:
                if yearList[0] == -1:  # before 1997
                    unrated_movies = MoviesModel.query.filter(MoviesModel.active == 1, MoviesModel.avg_rate is None,
                                                              MoviesModel.year <= 1997, genre_rule, country_rule).order_by("moviename").all()
                else:
                    unrated_movies = MoviesModel.query.filter(MoviesModel.active == 1, MoviesModel.avg_rate is None,
                                                              MoviesModel.year.in_(yearList), genre_rule, country_rule).order_by(
                        "moviename").all()
            if rating == 0:
                # from high to low depends on avg_rate
                if len(yearList) == 0:
                    rated_movies = MoviesModel.query.filter(MoviesModel.active == 1,
                                                            MoviesModel.avg_rate is not None, genre_rule, country_rule).order_by(
                        MoviesModel.avg_rate.desc(), "moviename").all()
                else:
                    if yearList[0] == -1:  # before 1997
                        rated_movies = MoviesModel.query.filter(MoviesModel.active == 1,
                                                                MoviesModel.avg_rate is not None,
                                                                MoviesModel.year <= 1997, genre_rule, country_rule).order_by(
                            MoviesModel.avg_rate.desc(), "moviename").all()
                    else:
                        rated_movies = MoviesModel.query.filter(MoviesModel.active == 1,
                                                                MoviesModel.avg_rate is not None,
                                                                MoviesModel.year.in_(yearList),
                                                                genre_rule, country_rule).order_by(
                            MoviesModel.avg_rate.desc(), "moviename").all()
                # from low to high depends on avg_rate
            if rating == 1:
                if len(yearList) == 0:
                    rated_movies = MoviesModel.query.filter(MoviesModel.active == 1, MoviesModel.avg_rate is not None,
                                                            MoviesModel.year.in_(yearList),
                                                            genre_rule, country_rule).order_by("avg_rate","moviename").all()

                else:
                    if yearList[0] == -1:  # before 1997
                        rated_movies = MoviesModel.query.filter(MoviesModel.active == 1,
                                                                MoviesModel.avg_rate is not None,
                                                                MoviesModel.year <= 1997,genre_rule, country_rule).order_by("avg_rate",
                                                                                                   "moviename").all()
                    else:
                        rated_movies = MoviesModel.query.filter(MoviesModel.active == 1,genre_rule, country_rule,
                                                                MoviesModel.avg_rate is not None,
                                                                MoviesModel.year.in_(yearList)).order_by("avg_rate",
                                                                                                         "moviename").all()
            for movie in rated_movies:  # movies: [movies0, movies[1]....]
                movie_info = res_movie_detail(uid, user, movie)
                res_list.append(movie_info)
                count += 1
            for movie in unrated_movies:  # movies: [movies0, movies[1]....]
                movie_info = res_movie_detail(uid, user, movie)
                res_list.append(movie_info)
                count += 1
            result["count"] = count
        start = page_index * page_size
        end = start + page_size
        if end < result["count"]:
            result["list"] = res_list[start:end]
        else:
            result["list"] = res_list[start:]
        return jsonify({'code': 200, 'result': result})

    except Exception as e:
        return jsonify({'code': 400, 'msg': 'Browseby failed.'})


# search by
def search_by():
    data = request.get_json(force=True)
    uid = data["uid"]
    if uid:
        user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    else:
        user = None
    keyword = data["keyword"]
    count = 0
    try:
        movie_list = []
        result = {}
        #search movies
        movies = MoviesModel.query.filter(or_(
            MoviesModel.moviename.ilike("%"+str(keyword)+'%'),
            MoviesModel.director.ilike("%" + str(keyword) + '%'),
            MoviesModel.cast.ilike("%" + str(keyword) + '%')
            ),
            MoviesModel.active == 1
        ).order_by("moviename").all()
        for movie in movies:  # movies: [movies0, movies[1]....]
            movie_info = res_movie_detail_spf(uid, user, movie)
            movie_list.append(movie_info)
            count += 1
        result["count"] = count
        result["movies"] = movie_list
        return jsonify({'code': 200, 'result': result})

    except Exception as e:
        return jsonify({'code': 400, 'msg': 'search failed.'})


# search result
def search_result():
    data = request.get_json(force=True)
    uid = data["uid"]
    page_index = data["page_index"]
    page_size = data["page_size"]
    if uid:
        user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    else:
        user = None
    keyword = data["keyword"]
    count = 0
    try:
        movie_list = []
        result = {}
        # search movies
        movies = MoviesModel.query.filter(or_(
            MoviesModel.moviename.ilike("%"+str(keyword)+"%"),
            MoviesModel.director.ilike("%"+str(keyword)+"%"),
            MoviesModel.cast.ilike("%"+str(keyword)+"%")
        ),
            MoviesModel.active == 1
        ).order_by("moviename").all()

        for movie in movies:  # movies: [movies0, movies[1]....]
            movie_info = res_movie_detail(uid, user, movie)
            movie_list.append(movie_info)
            count += 1
        result["count"] = count

        # display movie nums per page
        start = page_index * page_size
        end = start + page_size
        if end < result["count"]:
            result["movies"] = movie_list[start:end]
        else:
            result["movies"] = movie_list[start:]
        return jsonify({'code': 200, 'result': result})

    except Exception as e:
        return jsonify({'code': 400, 'msg': 'search result return failed.'})

def get_watchlist():
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
    watchlist = wishWatchModel.query.filter(wishWatchModel.uid == uid, wishWatchModel.type == 1,
                                            wishWatchModel.active == 1).all()
    if not watchlist:
        return jsonify({'code': 200, 'msg': 'Watchlist is empty'})

    try:
        result = {"count": len(watchlist)}
        list = []
        for m in watchlist:
            movie = MoviesModel.query.filter(MoviesModel.mid == m.mid, MoviesModel.active == 1).first()
            if movie:
                movie_info = res_movie_detail(uid, user, movie)
                list.append(movie_info)

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
            res_list = sorted(list, key=lambda m: m['watch_utime'], reverse=True)

        start = page_index * page_size
        end = start + page_size
        if end < result["count"]:
            result["list"] = res_list[start:end]
        else:
            result["list"] = res_list[start:]

        return jsonify({'code': 200, 'result': result})
    except Exception as e:
        return jsonify({'code': 400, 'msg': 'Get watchlist failed.', 'error_msg': str(e)})


def watchlist_add_or_delete():
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

    if add_or_del == "add":
        watch_movie = wishWatchModel.query.filter(wishWatchModel.uid == uid, wishWatchModel.mid == mid,
                                                  wishWatchModel.type == 1, wishWatchModel.active == 1).first()
        if watch_movie:
            return jsonify({'code': 200, 'msg': 'Movie is already in watchlist.'})
        wish_movie = wishWatchModel.query.filter(wishWatchModel.uid == uid, wishWatchModel.mid == mid,
                                                 wishWatchModel.type == 0, wishWatchModel.active == 1).first()
        if wish_movie:
            wish_movie.type = 1
            wish_movie.utime = getTime()[0]
            db.session.commit()
            return jsonify({'code': 200, 'msg': 'Add movie from wishlist to watchlist.'})
        try:
            wid = getUniqueid()
            timeform = getTime()[0]
            watchlist = wishWatchModel(wid=wid, type=1, uid=uid, mid=mid, ctime=timeform, utime=timeform)
            db.session.add(watchlist)
            db.session.commit()
            return jsonify({'code': 200, 'msg': 'Addition succeed.'})
        except Exception as e:
            return jsonify({'code': 400, 'msg': 'Addition failed.', 'error_msg': str(e)})
    elif add_or_del == "delete":
        watch_movie = wishWatchModel.query.filter(wishWatchModel.uid == uid, wishWatchModel.mid == mid,
                                                  wishWatchModel.type == 1, wishWatchModel.active == 1).first()
        if not watch_movie:
            return jsonify({'code': 400, 'msg': 'Movie is not in watchlist.'})
        try:
            watch_movie.active = 0
            watch_movie.utime = getTime()[0]
            db.session.commit()
            return jsonify({'code': 200, 'msg': 'Deletion succeed.'})
        except Exception as e:
            return jsonify({'code': 400, 'msg': 'Deletion failed.', 'error_msg': str(e)})
    else:
        return jsonify({'code': 400, 'msg': 'Invalid command.'})


def get_like():
    data = request.get_json(force=True)
    # print(data)
    page_index = data["page_index"]
    page_size = data["page_size"]
    uid = data["uid"]
    # check uid
    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'User does not exist'})

    likelist = movielikeModel.query.filter(movielikeModel.uid == uid, movielikeModel.type == 0, movielikeModel.active == 1).all()
    if not likelist:
        return jsonify({'code': 200, 'msg': 'Likelist is empty'})

    try:
        result = {"count": len(likelist)}
        list = []
        for m in likelist:
            movie = MoviesModel.query.filter(MoviesModel.mid == m.mid, MoviesModel.active == 1).first()
            if movie:
                movie_info = res_movie_detail(uid, user, movie)
                list.append(movie_info)

        res_list = sorted(list, key=lambda m: m['like_ctime'], reverse=True)

        start = page_index * page_size
        end = start + page_size
        if end < result["count"]:
            result["list"] = res_list[start:end]
        else:
            result["list"] = res_list[start:]

        return jsonify({'code': 200, 'result': result})
    except Exception as e:
        return jsonify({'code': 400, 'msg': 'Get likelist failed.', 'error_msg': str(e)})


def like_add_or_delete():
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

    if add_or_del == "add":
        like_movie = movielikeModel.query.filter(movielikeModel.uid == uid, movielikeModel.mid == mid,
                                                 movielikeModel.type == 0, movielikeModel.active == 1).first()
        if like_movie:
            return jsonify({'code': 200, 'msg': 'Movie is already liked.'})
        dislike_movie = movielikeModel.query.filter(movielikeModel.uid == uid, movielikeModel.mid == mid,
                                                    movielikeModel.type == 1, movielikeModel.active == 1).first()
        if dislike_movie:
            dislike_movie.type = 0
            dislike_movie.utime = getTime()[0]
            db.session.commit()
            return jsonify({'code': 200, 'msg': 'Trans movie from dislike to like.'})
        try:
            mlid = getUniqueid()
            timeform = getTime()[0]
            like = movielikeModel(mlid=mlid, type=0, uid=uid, mid=mid, ctime=timeform, utime=timeform)
            db.session.add(like)
            db.session.commit()
            return jsonify({'code': 200, 'msg': 'Addition succeed.'})
        except Exception as e:
            return jsonify({'code': 400, 'msg': 'Addition failed.', 'error_msg': str(e)})
    elif add_or_del == "delete":
        like_movie = movielikeModel.query.filter(movielikeModel.uid == uid, movielikeModel.mid == mid,
                                                 movielikeModel.type == 0, movielikeModel.active == 1).first()
        if not like_movie:
            return jsonify({'code': 400, 'msg': 'Movie is not liked.'})
        try:
            like_movie.active = 0
            like_movie.utime = getTime()[0]
            db.session.commit()
            return jsonify({'code': 200, 'msg': 'Deletion succeed.'})
        except Exception as e:
            return jsonify({'code': 400, 'msg': 'Deletion failed.', 'error_msg': str(e)})
    else:
        return jsonify({'code': 400, 'msg': 'Invalid command.'})


def get_dislike():
    data = request.get_json(force=True)
    # print(data)
    page_index = data["page_index"]
    page_size = data["page_size"]
    uid = data["uid"]
    # check uid
    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'User does not exist'})
    dislikelist = movielikeModel.query.filter(movielikeModel.uid == uid, movielikeModel.type == 1,
                                           movielikeModel.active == 1).all()
    if not dislikelist:
        return jsonify({'code': 200, 'msg': 'Dislikelist is empty'})

    try:
        result = {"count": len(dislikelist)}
        list = []
        for m in dislikelist:
            movie = MoviesModel.query.filter(MoviesModel.mid == m.mid, MoviesModel.active == 1).first()
            if movie:
                movie_info = res_movie_detail(uid, user, movie)
                list.append(movie_info)

        res_list = sorted(list, key=lambda m: m['dislike_ctime'], reverse=True)

        start = page_index * page_size
        end = start + page_size
        if end < result["count"]:
            result["list"] = res_list[start:end]
        else:
            result["list"] = res_list[start:]

        return jsonify({'code': 200, 'result': result})
    except Exception as e:
        return jsonify({'code': 400, 'msg': 'Get dislikelist failed.', 'error_msg': str(e)})


def dislike_add_or_delete():
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

    if add_or_del == "add":
        dislike_movie = movielikeModel.query.filter(movielikeModel.uid == uid, movielikeModel.mid == mid,
                                                    movielikeModel.type == 1, movielikeModel.active == 1).first()
        if dislike_movie:
            return jsonify({'code': 200, 'msg': 'Movie is already disliked.'})
        like_movie = movielikeModel.query.filter(movielikeModel.uid == uid, movielikeModel.mid == mid,
                                                 movielikeModel.type == 0, movielikeModel.active == 1).first()
        if like_movie:
            like_movie.type = 1
            like_movie.utime = getTime()[0]
            db.session.commit()
            return jsonify({'code': 200, 'msg': 'Trans movie from like to dislike.'})
        try:
            mlid = getUniqueid()
            timeform = getTime()[0]
            dislike = movielikeModel(mlid=mlid, type=1, uid=uid, mid=mid, ctime=timeform, utime=timeform)
            db.session.add(dislike)
            db.session.commit()
            return jsonify({'code': 200, 'msg': 'Addition succeed.'})
        except Exception as e:
            return jsonify({'code': 400, 'msg': 'Addition failed.', 'error_msg': str(e)})
    elif add_or_del == "delete":
        dislike_movie = movielikeModel.query.filter(movielikeModel.uid == uid, movielikeModel.mid == mid,
                                                    movielikeModel.type == 1, movielikeModel.active == 1).first()
        if not dislike_movie:
            return jsonify({'code': 400, 'msg': 'Movie is not disliked.'})
        try:
            dislike_movie.active = 0
            dislike_movie.utime = getTime()[0]
            db.session.commit()
            return jsonify({'code': 200, 'msg': 'Deletion succeed.'})
        except Exception as e:
            return jsonify({'code': 400, 'msg': 'Deletion failed.', 'error_msg': str(e)})
    else:
        return jsonify({'code': 400, 'msg': 'Invalid command.'})


def get_view_history():
    data = request.get_json(force=True)
    # print(data)
    uid = data["uid"]
    # check uid
    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'User does not exist'})

    view_history = viewhistoryModel.query.filter(viewhistoryModel.uid == uid, viewhistoryModel.active == 1).order_by(viewhistoryModel.utime.desc()).all()
    if not view_history:
        return jsonify({'code': 200, 'msg': 'View history is empty'})

    try:
        result = {"count": len(view_history)}
        list = []
        for m in view_history:
            movie = MoviesModel.query.filter(MoviesModel.mid == m.mid, MoviesModel.active == 1).first()
            if movie:
                movie_info = res_movie_detail(uid, user, movie)
                list.append(movie_info)

        if 20 < result["count"]:
            result["list"] = list[0:20]
        else:
            result["list"] = list

        return jsonify({'code': 200, 'result': result})
    except Exception as e:
        return jsonify({'code': 400, 'msg': 'Get view history failed.', 'error_msg': str(e)})


def view_history_add_or_delete():
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

    if add_or_del == "add":
        viewed_movie = viewhistoryModel.query.filter(viewhistoryModel.uid == uid, viewhistoryModel.mid == mid,
                                                     viewhistoryModel.active == 1).first()
        if viewed_movie:
            temp_f = viewed_movie.frequency
            viewed_movie.frequency = temp_f + 1
            viewed_movie.utime = getTime()[0]
            db.session.commit()
            return jsonify({'code': 200, 'msg': 'Viewed time and frequency update.'})
        try:
            vid = getUniqueid()
            timeform = getTime()[0]
            viewed = viewhistoryModel(vid=vid, uid=uid, mid=mid, ctime=timeform, utime=timeform)
            db.session.add(viewed)
            db.session.commit()
            return jsonify({'code': 200, 'msg': 'Addition succeed.'})
        except Exception as e:
            return jsonify({'code': 400, 'msg': 'Addition failed.', 'error_msg': str(e)})
    elif add_or_del == "delete":
        viewed_movie = viewhistoryModel.query.filter(viewhistoryModel.uid == uid, viewhistoryModel.mid == mid,
                                                     viewhistoryModel.active == 1).first()
        if not viewed_movie:
            return jsonify({'code': 400, 'msg': 'Movie is not viewed.'})
        try:
            viewed_movie.active = 0
            viewed_movie.utime = getTime()[0]
            db.session.commit()
            return jsonify({'code': 200, 'msg': 'Deletion succeed.'})
        except Exception as e:
            return jsonify({'code': 400, 'msg': 'Deletion failed.', 'error_msg': str(e)})
    else:
        return jsonify({'code': 400, 'msg': 'Invalid command.'})


def clear_view_history():
    data = request.get_json(force=True)
    # print(data)
    uid = data["uid"]
    # check uid
    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'User does not exist'})

    view_history = viewhistoryModel.query.filter(viewhistoryModel.uid == uid, viewhistoryModel.active == 1).all()
    if not view_history:
        return jsonify({'code': 200, 'msg': 'View history is empty'})

    try:
        for v_m in view_history:
            v_m.active = 0
            v_m.utime = getTime()[0]
            db.session.commit()
        return jsonify({'code': 200, 'msg': 'View history clear succeed'})
    except Exception as e:
        return jsonify({'code': 400, 'msg': 'Clear View history failed.', 'error_msg': str(e)})

#  create review into movieReview, reviewReview, reviewLike
def create_review():
    data = request.get_json(force=True)
    uid = data["uid"]
    mid = data["mid"]
    review = data["review"]
    # check uid
    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'User does not exist'})

    movie = MoviesModel.query.filter(MoviesModel.mid == mid, MoviesModel.active == 1).first()

    if not movie:
        return jsonify({'code': 400, 'msg': 'Movie does not exist'})

    if review == None or len(review) == 0 or review.isspace():
        return jsonify({'code': 400, 'msg': 'text is empty'})


    movieReview = movieReviewModel.query.filter(movieReviewModel.mid == mid, movieReviewModel.uid == uid, movieReviewModel.active == 1).first()
    time_form = getTime()[0]

    # have no review before, update the review
    try:
        mrid = getUniqueid()
        # rlid = getUniqueid()
        time_form = getTime()[0]
        movieReview = movieReviewModel(mrid = mrid, uid = uid, mid = mid, review = review, ctime = time_form, utime = time_form)
        db.session.add(movieReview)
        db.session.commit()
        return jsonify({'code': 200, 'msg': 'create review successfully.'})
    except Exception as e:
        return jsonify({'code': 400, 'msg': 'Invalid command.'})


# user review
def reply_review():
    data = request.get_json(force=True)
    uid = data["uid"]
    mrid = data["mrid"]
    review = data["review"]


    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'User does not exist'})


    movieReview = movieReviewModel.query.filter(movieReviewModel.mrid == mrid, movieReviewModel.active == 1).first()

    if not movieReview:
        return jsonify({'code': 400, 'msg': 'MovieReview does not exist'})

    try:
        urid = getUniqueid()
        time_form = getTime()[0]
        userReview = userReviewModel(uid = uid, urid = urid,  mrid = mrid, review = review, ctime = time_form, utime = time_form)
        db.session.add(userReview)
        db.session.commit()
        return jsonify({'code': 200, 'msg': 'reply review successfully.'})


    except Exception as e:
        return jsonify({'code': 400, 'msg': 'reply failed.'})

# like other' review
def like_review():
    data = request.get_json(force=True)
    add_or_del = data["add_or_del"]
    uid = data["uid"]
    mrid = data["mrid"]
    # check uid and mid
    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'User does not exist'})
    movieReview = MoviesModel.query.filter(movieReviewModel.mrid == mrid, movieReviewModel.active == 1).first()
    if not movieReview:
        return jsonify({'code': 400, 'msg': 'movieReview does not exist'})

    reviewLike = reviewlikeModel.query.filter(reviewlikeModel.uid == uid, reviewlikeModel.mrid == mrid, reviewlikeModel.active == 1).first()
    if add_or_del == "add":
        if not reviewLike:
            try:
                rlid = getUniqueid()
                time_form = getTime()[0]
                reviewlike = reviewlikeModel(rlid = rlid, uid = uid, mrid = mrid, ctime = time_form, utime = time_form)
                db.session.add(reviewlike)
                db.session.commit()
                return jsonify({'code': 200, 'msg': 'like review succeed.'})
            except Exception as e:
                return jsonify({'code': 400, 'msg': 'like review  failed.', 'error_msg': str(e)})
        else:
            return jsonify({'code': 400, 'msg': 'like failed.'})
    else:
        if reviewLike:
            try:
                reviewLike.active = 0
                reviewLike.utime = getTime()[0]
                db.session.commit()
                return jsonify({'code': 200, 'msg': 'cancel like review succeed.'})
            except Exception as e:
                return jsonify({'code': 400, 'msg': 'cancel like review  failed.', 'error_msg': str(e)})
        else:
            return jsonify({'code': 400, 'msg': 'cancel like failed.'})







# fucntion of display movie review details, includes the userReview for it
def res_movieReview_detail(movieReview, mainUser):
    result = {}
    uid = movieReview.uid
    mrid = movieReview.mrid
    mid = movieReview.mid
    result["mrid"] = mrid
    result["uid"] = uid
    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    username = user.username
    result["username"] = username
    result["review"] = movieReview.review
    result["like_count"] = reviewlikeModel.query.filter(reviewlikeModel.mrid == mrid,
                                                        reviewlikeModel.active == 1).count()
    check_rate = RatingModel.query.filter(RatingModel.uid == uid, RatingModel.mid == mid,
                                          RatingModel.active == 1).first()

    if check_rate:
        result["rate"] = check_rate.rate
    else:
        result["rate"] = -1

    if mainUser:
        movieReview_like = reviewlikeModel.query.filter(reviewlikeModel.mrid == mrid,reviewlikeModel.uid == mainUser.uid,reviewlikeModel.active == 1).first()
        # print(mrid)
        # print(uid)
        if movieReview_like:
            result["is_user_likeReview"] = 1
        else:
            result["is_user_likeReview"] = 0

    result["utime"] = movieReview.utime
    userReview = userReviewModel.query.filter(userReviewModel.mrid == mrid, userReviewModel.active == 1).order_by(userReviewModel.utime.desc()).all()
    count = userReviewModel.query.filter(userReviewModel.mrid == mrid, userReviewModel.active == 1).count()
    userReview_lst = list()
    if userReview:
        for ur in userReview:
            ur_dic = dict()
            ur_dic["urid"] = ur.urid
            ur_dic["uid"] = ur.uid
            ur_dic["username"] = (UserModel.query.filter(UserModel.uid == ur.uid, UserModel.active == 1).first()).username
            ur_dic["review"] = ur.review
            ur_dic["utime"] = ur.utime
            userReview_lst.append(ur_dic)
    result["userReview"] = userReview_lst
    result["userReview_count"] = count
    return result





# display movie Review
def display_movieReview():
    data = request.get_json(force=True)
    uid = data["uid"]
    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    mid = data["mid"]
    movieReview = db.session.query(movieReviewModel.mrid,movieReviewModel.uid,movieReviewModel.mid, movieReviewModel.review,movieReviewModel.utime, func.count(reviewlikeModel.mrid))\
        .outerjoin(reviewlikeModel, movieReviewModel.mrid == reviewlikeModel.mrid)\
        .group_by(movieReviewModel.mrid)\
        .filter(movieReviewModel.mid == mid,movieReviewModel.active == 1)\
        .order_by(func.count(reviewlikeModel.mrid).desc()).all()
    print(movieReview)
    if not movieReview:
        return jsonify({'code': 400, 'msg': 'movieReview does not exist'})
    try:
        movieReview_list = []
        result = {}
        count = 0
        for m in movieReview:  # movies: [movies0, movies[1]....]
            is_block = blocklistModel.query.filter(and_(blocklistModel.uid == uid, blocklistModel.buid == m.uid, blocklistModel.active == 1)).all()
            if is_block:
                print("this has been blockedr")
                continue

            movieReview_info = res_movieReview_detail(m,user)
            movieReview_list.append(movieReview_info)
            count += 1
        result["movieReview_count"] = count
        result["movieReview"] = movieReview_list
        return jsonify({'code': 200, 'result': result})
    except Exception as e:
        return jsonify({'code': 400, 'msg': 'display movieReview failure', 'error_msg': str(e)})

# func for display all movie Reviews user post before
def res_movieReview_detail_spf(movieReview):
    result = {}
    uid = movieReview.uid
    mrid = movieReview.mrid
    mid = movieReview.mid
    result["mrid"] = mrid
    movie = MoviesModel.query.filter(MoviesModel.mid == movieReview.mid, MoviesModel.active == 1).first()
    if not movie:
        return jsonify({'code': 400, 'msg': 'movie does not exist'})

    result["moviename"] = movie.moviename
    result["mid"] = movieReview.mid
    result["coverimage"] = movie.coverimage
    result["review"] = movieReview.review
    result["utime"] = movieReview.utime
    result["like_count"] = reviewlikeModel.query.filter(reviewlikeModel.mrid == mrid,
                                                        reviewlikeModel.active == 1).count()
    check_rate = RatingModel.query.filter(RatingModel.uid == uid, RatingModel.mid == mid,
                                          RatingModel.active == 1).first()

    if check_rate:
        result["rate"] = check_rate.rate
    else:
        result["rate"] = -1


    return result
# # display all movie Reviews user post before
def display_usersMovieReview():
    data = request.get_json(force=True)
    uid = data["uid"]
    page_index = data["page_index"]
    page_size = data["page_size"]
    movieReviews = movieReviewModel.query.filter(movieReviewModel.uid == uid, movieReviewModel.active == 1)\
        .order_by(movieReviewModel.utime.desc())\
        .all()

    try:
        movieReviews_list = []
        result = {}

        for m in movieReviews:  # movies: [movies0, movies[1]....]
            movieReview_info = res_movieReview_detail_spf(m)
            movieReviews_list.append(movieReview_info)
        result["movieReview_count"] = len(movieReviews_list)
        # result["movieReviews"] = movieReviews_list

        start = page_index * page_size
        end = start + page_size
        if end < result["movieReview_count"]:
            result["movieReviews"] = movieReviews_list[start:end]
        else:
            result["movieReviews"] = movieReviews_list[start:]

        return jsonify({'code': 200, 'result': result})
    except Exception as e:
        return jsonify({'code': 400, 'msg': 'display usersMovieReview failure', 'error_msg': str(e)})

# delete the movieReview
def delete_movieReview():
    data = request.get_json(force=True)
    mrid = data["mrid"]
    uid = data["uid"]
    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'user does not exist'})

    movieReview = movieReviewModel.query.filter(movieReviewModel.mrid == mrid, movieReviewModel.uid == uid, movieReviewModel.active == 1).first()
    if not movieReview:
        return jsonify({'code': 400, 'msg': 'movieReview does not exist or u do not have access'})
    try:
        movieReview.active = 0
        movieReview.utime = getTime()[0]
        userReview = userReviewModel.query.filter(userReviewModel.mrid == mrid,userReviewModel.active == 1).all()

        for u in userReview:
            u.active = 0
            u.utime = getTime()[0]
        db.session.commit()
        return jsonify({'code': 200, 'msg': 'Deletion movieReview succeed.'})

    except Exception as e:
        return jsonify({'code': 400, 'msg': 'delete movieReview failure', 'error_msg': str(e)})

# delete the userReview
def delete_userReview():
    data = request.get_json(force=True)
    uid = data["uid"]
    urid = data["urid"]
    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'user does not exist'})
    userReview = userReviewModel.query.filter(userReviewModel.urid == urid,userReviewModel.uid == uid, userReviewModel.active == 1).first()
    if not userReview:
        return jsonify({'code': 400, 'msg': 'userReview does not exist'})
    try:
        userReview.active = 0

        userReview.utime = getTime()[0]
        db.session.commit()
        return jsonify({'code': 200, 'msg': 'Deletion userReview succeed.'})

    except Exception as e:
        return jsonify({'code': 400, 'msg': 'delete userReview failure', 'error_msg': str(e)})



def follow_or_not():
    data = request.get_json(force=True)
    o_uid = data["o_uid"]   # owner user
    f_uid = data["f_uid"]   # follower user
    follow_status = data["follow_status"]       # 0: cancel follow     1 : follow
    o_usr = UserModel.query.filter(UserModel.uid == o_uid, UserModel.active == 1).first()
    if not o_usr:
        return jsonify({'code': 400, 'msg': 'owner user does not exist'})
    f_usr = UserModel.query.filter(UserModel.uid == f_uid, UserModel.active == 1).first()
    if not f_usr:
        return jsonify({'code': 400, 'msg': 'follower user does not exist'})

    follow_info = followModel.query.filter(and_(followModel.uid == o_uid, followModel.fuid == f_uid)).first()
    try:
        if not follow_info:
            if follow_status == 0:
                return jsonify({'code': 400, 'msg': 'You did not follow the user'})
            else:
                fid = getUniqueid()
                time_form = getTime()[0]
                follow_insert = followModel(fid = fid, uid = o_uid, fuid = f_uid, active = 1, ctime = time_form, utime = time_form)
                db.session.add(follow_insert)
                db.session.commit()
                return jsonify({'code': 200, 'msg': 'follow successfully'})

        else:
            if follow_info.active == follow_status:
                return jsonify({'code': 400, 'msg': 'already on this status'})
            else:
                follow_info.active = follow_status
                db.session.commit()
                return jsonify({'code': 200, 'msg': 'follow or cancel successfully'})

    except Exception as e:
        return jsonify({'code': 400, 'msg': 'follow or not others failed', 'error_msg': str(e)})

def get_followers():
    data = request.get_json(force=True)
    uid = data["uid"]   # owner user
    target = data["target"]     # 0 : following  1: followers
    usr = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not usr:
        return jsonify({'code': 400, 'msg': 'user does not exist'})
    if target == 1:
        follow_info = followModel.query.filter(and_(followModel.uid == uid, followModel.active == 1)).all()
        try:
            result = dict()
            follow_lst = list()
            for f in follow_info:
                follow_dict = dict()
                fuid = f.fuid
                follow_dict["user_id"] = fuid
                u = UserModel.query.filter(UserModel.uid == fuid, UserModel.active == 1).first()
                if not u:
                    return jsonify({'code': 400, 'msg': 'followers does not exist'})
                name = u.username
                follow_dict["user_name"] = name
                follow_lst.append(follow_dict)
            result["follow_lst"] = follow_lst
            result["count"] = followModel.query.filter(and_(followModel.uid == uid, followModel.active == 1)).count()
            return jsonify({'code': 200, 'result': result})

        except Exception as e:
            return jsonify({'code': 400, 'msg': 'get followers failed', 'error_msg': str(e)})
    if target == 0:
        follow_info = followModel.query.filter(and_(followModel.fuid == uid, followModel.active == 1)).all()
        try:
            result = dict()
            follow_lst = list()
            for f in follow_info:
                follow_dict = dict()
                fuid = f.uid
                follow_dict["user_id"] = fuid
                u = UserModel.query.filter(UserModel.uid == fuid, UserModel.active == 1).first()
                if not u:
                    return jsonify({'code': 400, 'msg': 'following user does not exist'})
                name = u.username
                follow_dict["user_name"] = name
                follow_lst.append(follow_dict)
            result["follow_lst"] = follow_lst
            result["count"] = followModel.query.filter(and_(followModel.fuid == uid, followModel.active == 1)).count()
            return jsonify({'code': 200, 'result': result})

        except Exception as e:
            return jsonify({'code': 400, 'msg': 'get followings failed', 'error_msg': str(e)})

# determine follow or not
def check_follow():
    data = request.get_json(force=True)
    o_uid = data["o_uid"]   # owner user
    f_uid = data["f_uid"]   # follower user
    o_usr = UserModel.query.filter(UserModel.uid == o_uid, UserModel.active == 1).first()
    if not o_usr:
        return jsonify({'code': 400, 'msg': 'owner user does not exist'})
    f_usr = UserModel.query.filter(UserModel.uid == f_uid, UserModel.active == 1).first()
    if not f_usr:
        return jsonify({'code': 400, 'msg': 'follower user does not exist'})
    follow_info = followModel.query.filter(and_(followModel.uid == o_uid, followModel.fuid == f_uid,)).first()
    print(follow_info.active)
    if not follow_info:
        return jsonify({'code': 200, 'result': 0})
    else:
        if follow_info.active == 1:
            return jsonify({'code': 200, 'result': 1})
        else:
            return jsonify({'code': 200, 'result': 0})




def block_user():
    data = request.get_json(force=True)
    o_uid = data["o_uid"]   # owner user
    b_uid = data["b_uid"]   # blocker user
    block_status = data["block_status"]       # 0: cancel block     1 : block
    o_usr = UserModel.query.filter(UserModel.uid == o_uid, UserModel.active == 1).first()
    if not o_usr:
        return jsonify({'code': 400, 'msg': 'owner user does not exist'})
    b_usr = UserModel.query.filter(UserModel.uid == b_uid, UserModel.active == 1).first()
    if not b_usr:
        return jsonify({'code': 400, 'msg': 'blocker user does not exist'})

    block_info = blocklistModel.query.filter(and_(blocklistModel.uid == o_uid, blocklistModel.buid == b_uid)).first()
    try:
        if not block_info:
            if block_status == 0:
                return jsonify({'code': 400, 'msg': 'You did not block the user'})
            else:
                bid = getUniqueid()
                time_form = getTime()[0]
                block_insert = blocklistModel(bid = bid, uid = o_uid, buid = b_uid, active = 1, ctime = time_form, utime = time_form)
                db.session.add(block_insert)
                db.session.commit()
                return jsonify({'code': 200, 'msg': 'block successfully'})

        else:
            if block_info.active == block_status:
                return jsonify({'code': 400, 'msg': 'already on this status'})
            else:
                block_info.active = block_status
                db.session.commit()
                return jsonify({'code': 200, 'msg': 'block or cancel successfully'})

    except Exception as e:
        return jsonify({'code': 400, 'msg': 'block or not others failed', 'error_msg': str(e)})




def get_blockers():
    data = request.get_json(force=True)
    uid = data["uid"]   # owner user
    usr = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not usr:
        return jsonify({'code': 400, 'msg': 'user does not exist'})


    block_info = blocklistModel.query.filter(and_(blocklistModel.uid == uid, blocklistModel.active == 1)).all()
    try:
        result = dict()
        block_lst = list()
        for f in block_info:
            block_dict = dict()
            buid = f.buid
            block_dict["user_id"] = buid
            u = UserModel.query.filter(UserModel.uid == buid, UserModel.active == 1).first()
            if not u:
                return jsonify({'code': 400, 'msg': 'blocking user does not exist'})
            name = u.username
            block_dict["user_name"] = name
            block_lst.append(block_dict)
        result["block_lst"] = block_lst
        result["count"] = blocklistModel.query.filter(and_(blocklistModel.uid == uid, blocklistModel.active == 1)).count()
        return jsonify({'code': 200, 'result': result})

    except Exception as e:
        return jsonify({'code': 400, 'msg': 'get blockers failed', 'error_msg': str(e)})

# admin access only
def insert_movie():
    data = request.get_json(force=True)
    uid = data["uid"]   # admin user
    usr = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not usr:
        return jsonify({'code': 400, 'msg': 'user does not exist'})
    if usr.role != 1:
        return jsonify({'code': 400, 'msg': 'user has no access'})
    moviename = data["moviename"].strip()
    coverimage = data["coverimage"].strip()
    description = data["description"].strip()
    genre = data["genre"].strip()
    cast = data["cast"].strip()
    director = data["director"].strip()
    country = data["country"].strip()
    language = data["language"].strip()
    release_date = data["release_date"].strip()
    duration = data["duration"]
    mid = getUniqueid()
    time_form = getTime()[0]
    year = int(release_date[0:4])
    movie = MoviesModel(mid = mid,moviename = moviename, coverimage = coverimage,description = description,
                        genre = genre, cast = cast, director = director, country = country, language = language,
                        release_date = release_date,duration = duration, year = year, active = 1, ctime = time_form, utime = time_form)
    db.session.add(movie)
    db.session.commit()
    return jsonify({'code': 200, 'msg': "insert successfully "})
