from flask import jsonify, Blueprint, request, g
from sqlalchemy import exists, func
from app.login.utils import *
from app.login.movies import *
from app.models import *
from sqlalchemy import or_, and_, not_

def similer(genre,director,cast):
    # count = 0
    genreList = strToList(genre)
    directorList = strToList(director)
    castList = strToList(cast)

    res_list = []
    # result = {}
    # add genre_rule, country_rule
    # if null, return all results
    # else return the genre contains keyword

    # movies include both keyword at same time
    genre_rule = and_(*[MoviesModel.genre.ilike("%" +input+"%") for input in genreList])
    director_rule = and_(*[MoviesModel.director.ilike("%" + input + "%") for input in directorList])
    cast_rule = and_(*[MoviesModel.director.ilike("%" + input + "%") for input in castList])
    # movies include either keyword

    movies_genre = MoviesModel.query.filter(MoviesModel.active == 1, genre_rule).all()
    for movie in movies_genre:  # movies: [movies0, movies[1]....]
        res_list.append(movie.mid)
        # count += 1
    movies_dire = MoviesModel.query.filter(MoviesModel.active == 1, director_rule).all()
    for movie in movies_dire:  # movies: [movies0, movies[1]....]
        res_list.append(movie.mid)
    movies_cast = MoviesModel.query.filter(MoviesModel.active == 1, cast_rule).all()
    for movie in movies_cast:  # movies: [movies0, movies[1]....]
        res_list.append(movie.mid)

    return res_list




def movie_similer_recommend():
    uid = request.json.get('uid')
    mid = request.json.get('mid')
    page_index = request.json.get('page_index')
    page_size = request.json.get('page_size')
    user = None
    # count = 0
    target_movie = MoviesModel.query.filter(MoviesModel.active == 1, MoviesModel.mid == mid).first()
    result = {}
    mlist = []
    if uid:
        user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
        director = target_movie.director.replace(';', ' ')
        cast = target_movie.cast.replace(';', ' ')
        similer_result = similer(target_movie.genre, director, cast)
        result["count"] = len(similer_result)
        exceptList = []
        dislike = movielikeModel.query.filter(movielikeModel.uid == user.uid, movielikeModel.active == 1,
                                              movielikeModel.type == 1).all()
        for d in dislike:
            exceptList.append(d.mid)

        lowRate = RatingModel.query.filter(RatingModel.uid == user.uid, RatingModel.active == 1,
                                              RatingModel.rate <= 3.5).all()
        for d in lowRate:
            exceptList.append(d.mid)

        for i in similer_result:
            if i not in exceptList:
                sim_movies = MoviesModel.query.filter(MoviesModel.active == 1, MoviesModel.mid == i).first()

                mdict = res_movie_detail(None, None, sim_movies)
                mlist.append(mdict)
    else:
        director = target_movie.director.replace(';', ' ')
        cast = target_movie.cast.replace(';', ' ')
        similer_result = similer(target_movie.genre, director, cast)
        result["count"] = len(similer_result)
        for i in similer_result:
            sim_movies = MoviesModel.query.filter(MoviesModel.active == 1, MoviesModel.mid == i).first()
            mdict = res_movie_detail(None, None, sim_movies)
            mlist.append(mdict)

    start = page_index * page_size
    end = start + page_size
    if end < result["count"]:


        result["mlist"] = mlist[start:end]
    else:
        result["mlist"] = mlist[start:]
    return jsonify({'code': 200, 'result': result})

