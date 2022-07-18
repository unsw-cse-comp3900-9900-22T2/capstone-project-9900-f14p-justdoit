from flask import jsonify, Blueprint, request, g
from sqlalchemy import exists, func
from app.login.utils import *
from app.login.movies import *
from app.models import *
from sqlalchemy import or_, and_, not_
from textblob import TextBlob
import itertools
# import nltk

def similer(genre,director,cast):
    # count = 0
    genreList = genre.split(' ')
    directorList = director.split(' ')
    castList = cast.split(' ')

    res_list = []
    # result = {}
    # com_genre_list = []
    if len(genreList)>=2:
        iter_genre = itertools.combinations(genreList, 2)
        com_genre_list = list(iter_genre)
        # print(com_genre_list)

        for i in com_genre_list:
            # print(i)
            input_str = list(i)
            # print(input_str)
            genre_rule = and_(*[MoviesModel.genre.ilike("%" +input+"%") for input in input_str])
            movies_genre = MoviesModel.query.filter(MoviesModel.active == 1, genre_rule).all()
            for movie in movies_genre:  # movies: [movies0, movies[1]....]
                if movie.mid not in res_list:
                    res_list.append(movie.mid)

            # genre_rule_2 = and_(MoviesModel.genre.ilike("%" + input_str_2 + "%"))
            # movies_genre_2 = MoviesModel.query.filter(MoviesModel.active == 1, genre_rule_2).all()
            # for movie in movies_genre_2:  # movies: [movies0, movies[1]....]
            #     if movie.mid not in res_list:
            #         res_list.append(movie.mid)

    else:
        for i in genreList:

            genre_rule = and_(MoviesModel.genre.ilike("%" + i + "%"))
            movies_genre = MoviesModel.query.filter(MoviesModel.active == 1, genre_rule).all()
            for movie in movies_genre:  # movies: [movies0, movies[1]....]
                if movie.mid not in res_list:
                    res_list.append(movie.mid)

    for i in directorList:
        director_rule = and_(MoviesModel.director.ilike("%" + i + "%"))
        movies_genre = MoviesModel.query.filter(MoviesModel.active == 1, director_rule).all()
        for movie in movies_genre:  # movies: [movies0, movies[1]....]
            if movie.mid not in res_list:
                res_list.append(movie.mid)
    for i in castList:
        cast_rule = and_(MoviesModel.cast.ilike("%" + i + "%"))
        movies_genre = MoviesModel.query.filter(MoviesModel.active == 1, cast_rule).all()
        for movie in movies_genre:  # movies: [movies0, movies[1]....]
            if movie.mid not in res_list:
                res_list.append(movie.mid)
    # movies_dire = MoviesModel.query.filter(MoviesModel.active == 1, director_rule).all()
    # for movie in movies_dire:  # movies: [movies0, movies[1]....]
    #     res_list.append(movie.mid)
    # movies_cast = MoviesModel.query.filter(MoviesModel.active == 1, cast_rule).all()
    # for movie in movies_cast:  # movies: [movies0, movies[1]....]
    #     res_list.append(movie.mid)
    # print(res_list)
    return res_list

def emotion_raview(review_text):
    blob = TextBlob(review_text)
    # num = len(blob.sentences)
    # print(num)
    # for i in range(num):
    #     print(blob.sentences[i].sentiment)
    # print(blob.sentiment)
    if blob.sentiment.polarity < 0:
        return 0
    else:
        return 1


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
        # print(target_movie.genre)
        similer_result = similer(target_movie.genre, director, cast)
        result["count"] = len(similer_result)
        exceptList = [mid]
        dislike = movielikeModel.query.filter(movielikeModel.uid == user.uid, movielikeModel.active == 1,
                                              movielikeModel.type == 1).all()
        for d in dislike:
            exceptList.append(d.mid)

        lowRate = RatingModel.query.filter(RatingModel.uid == user.uid, RatingModel.active == 1,
                                              RatingModel.rate <= 3.5).all()
        for l in lowRate:
            exceptList.append(l.mid)

        check_review = movieReviewModel.query.filter(movieReviewModel.uid == user.uid, movieReviewModel.active == 1).all()
        for r in check_review:
            if emotion_raview(r.review) == 0:
                exceptList.append(r.mid)


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
    result["count"] = len(mlist)
    if end < result["count"]:


        result["mlist"] = mlist[start:end]
    else:
        result["mlist"] = mlist[start:]
    return jsonify({'code': 200, 'result': result})

