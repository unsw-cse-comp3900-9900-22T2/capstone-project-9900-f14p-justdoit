from flask import jsonify, Blueprint, request, g
from sqlalchemy import exists
from app.login.utils import *
from app.models import *



# insert movies
# def insertMovies():


def get_movie_detial():
    data = request.get_json(force=True)
    mid = data["mid"]
    # print(mid)
    # find in database
    movie = MoviesModel.query.filter(MoviesModel.mid == mid, MoviesModel.active == 1).first()
    # if there is not movie
    if not movie:
        return jsonify({'code': 400, 'msg': 'Sorry you can not view the movie details'})
    result = {}

    result["moviename"] = movie.moviename
    result["description"] = movie.description

    # split string (去空格)
    genre_list = movie.genre.split(",")
    result["genre"] = genre_list
    result["cast"] = movie.cast
    result["crew"] = movie.crew
    result["director"] = movie.director
    result["language"] = movie.language
    result["avg_rate"] = movie.avg_rate
    result["release_date"] = movie.release_date

    num_wish = wishWatchModel.query.filter(wishWatchModel.mid == mid, wishWatchModel.type == 0,wishWatchModel.active == 1).count()
    result["wishlist_num"] = num_wish

    # num_watch = wishWatchModel.query.filter(wishWatchModel.mid == mid,wishWatchModel.type == 1,wishWatchModel.active == 1).count()
    # result["watchlist_num"] = num_watch


    return jsonify({'code': 200, 'result': result})


def get_wishlist():
    data = request.get_json(force=True)
    # print(data)
    sort_by = data["sort_by"]
    # print(sort_by.totext)
    uid = data["uid"]
    # check uid
    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'User does not exist'})
    wishlist = wishWatchModel.query.filter(wishWatchModel.uid == uid, wishWatchModel.type == 0, wishWatchModel.active == 1).all()
    if not wishlist:
        return jsonify({'code': 200, 'msg': 'Wishlist is empty'})
    # if sort_by == "ctime":
    #     wishlist = wishlist.order_by(wishWatchModel.ctime)
    try:
        result = {}
        result["count"] = len(wishlist)
        list = []
        for m in wishlist:
            # print(m.mid)
            movie = MoviesModel.query.filter(MoviesModel.mid == m.mid, MoviesModel.active == 1).first()
            # movie_info: mid, moviename, genre, director, avg_rate, release_date
            movie_info = {}
            # print(movie.mid)
            movie_info["mid"] = movie.mid
            # print(movie.moviename)
            movie_info["moviename"] = movie.moviename
            # print(movie.genre)
            movie_info["genre"] = movie.genre.split(" ")
            # print(movie.director)
            movie_info["director"] = movie.director
            # print(movie.avg_rate)
            if movie.avg_rate:
                movie_info["avg_rate"] = movie.avg_rate
            else:
                movie_info["avg_rate"] = -1
            # print(movie.release_date)
            movie_info["year"] = movie.release_date.year
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
    movie_in_wl = wishWatchModel.query.filter(wishWatchModel.uid == uid, wishWatchModel.mid == mid, wishWatchModel.active == 1).first()
    if movie_in_wl:
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


def delete_from_wishlist():
    data = request.get_json(force=True)
    # print(data)
    uid = data["uid"]
    mid = data["mid"]
    # check uid and mid
    user = UserModel.query.filter(UserModel.uid == uid).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'User does not exist'})
    movie = MoviesModel.query.filter(MoviesModel.mid == mid).first()
    if not movie:
        return jsonify({'code': 400, 'msg': 'Movie does not exist'})
    # uid和mid是否已经存在过wish或者watched里面, 只看active是1的
    movie_in_wl = wishWatchModel.query.filter(wishWatchModel.type == 0, wishWatchModel.uid == uid, wishWatchModel.mid == mid,
                                             wishWatchModel.active == 1).first()
    if not movie_in_wl:
        return jsonify({'code': 400, 'msg': 'Deletion failed, movie is not in wish list.'})
    try:
        movie_in_wl.active = 0
        movie_in_wl.utime = getTime()[0]
        db.session.commit()
        return jsonify({'code': 200, 'msg': 'Deletion succeed.'})
    except Exception as e:
        return jsonify({'code': 400, 'msg': 'Deletion failed.', 'error_msg': str(e)})

#
#
# def clear_wishlist():


