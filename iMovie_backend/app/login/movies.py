from flask import jsonify, Blueprint, request, g
from sqlalchemy import exists
from app.login.utils import *
from app.models import *



# insert movies
# def insertMovies():


# get movie detial
def get_movie_detial():
    data = request.get_json(force=True)
    mid = data["mid"]
    # print(mid)
    # find in database
    movie = MoviesModel.query.filter(MoviesModel.mid == mid).first()
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


