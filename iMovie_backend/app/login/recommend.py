from flask import jsonify, Blueprint, request, g
from sqlalchemy import exists, func
from app.login.utils import *
from app.login.movies import *
from app.models import *
from sqlalchemy import or_, and_, not_
from textblob import TextBlob
import itertools
import math
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
    result = {}
    target_movie = MoviesModel.query.filter(MoviesModel.active == 1, MoviesModel.mid == mid).first()
    if not target_movie:
        return jsonify({'code': 400})
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

                mdict = res_movie_detail(uid, user, sim_movies)
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

def user_rating_dict():
    user_dict = {}



    user_ratings = RatingModel.query.filter(RatingModel.active == 1).all()
    for i in user_ratings:

        # print(i.uid, i.mid, i.rate)
        if user_dict.get(i.uid) == None:

            user_dict.setdefault(i.uid, {})


        if user_dict[i.uid].get(i.mid) == None:
            user_dict[i.uid].setdefault(i.mid, i.rate)
        else:
            user_dict[i.uid][i.mid] = i.rate

    # print(user_dict)
    return user_dict

def user_similar(input_dict):
    w = dict()
    for u in input_dict.keys():
        w[u] = dict()
        for v in input_dict.keys():
            if u == v :
                continue
            u_dict = set([k for k in input_dict[u].keys() if input_dict[u][k] != 0])
            v_dict = set([k for k in input_dict[v].keys() if input_dict[v][k] != 0])
            w[u][v] = len(u_dict & v_dict)
            w[u][v] /= math.sqrt(len(u_dict) * len(v_dict) * 1.0)
    return w

def except_list(uid):
    exceptList = []

    dislike_movie = movielikeModel.query.filter(movielikeModel.uid == uid, movielikeModel.active == 1,
                                                movielikeModel.type == 1).all()
    for i in dislike_movie:
        if i.mid not in exceptList:
            exceptList.append(i.mid)

    lowRate = RatingModel.query.filter(RatingModel.uid == uid, RatingModel.active == 1,
                                       RatingModel.rate <= 3.5).all()
    for l in lowRate:
        exceptList.append(l.mid)

    check_review = movieReviewModel.query.filter(movieReviewModel.uid == uid,
                                                 movieReviewModel.active == 1).all()
    for r in check_review:
        if emotion_raview(r.review) == 0:
            exceptList.append(r.mid)

    watch_wish_list = wishWatchModel.query.filter(wishWatchModel.uid == uid, wishWatchModel.active == 1).all()
    for i in watch_wish_list:
        if i.mid not in exceptList:
            exceptList.append(i.mid)
    return exceptList

def get_user_like(uid):
    reList = []
    like_movie = movielikeModel.query.filter(movielikeModel.uid == uid, movielikeModel.active == 1,
                                                movielikeModel.type == 0).all()
    for i in like_movie:
        if i.mid not in reList:
            reList.append(i.mid)

    HighRate = RatingModel.query.filter(RatingModel.uid == uid, RatingModel.active == 1,
                                       RatingModel.rate >= 4).all()
    for l in HighRate:
        reList.append(l.mid)

    check_review = movieReviewModel.query.filter(movieReviewModel.uid == uid,
                                                 movieReviewModel.active == 1).all()
    for r in check_review:
        if emotion_raview(r.review) == 1:
            reList.append(r.mid)
    watch_wish_movie = wishWatchModel.query.filter(wishWatchModel.uid == uid, wishWatchModel.active == 1).all()
    for i in watch_wish_movie:
        if i.mid not in reList:
            reList.append(i.mid)

    return reList

def count_genre(list_):
    dict_ = {}
    for i in list_:
        movie = MoviesModel.query.filter(MoviesModel.mid == i, MoviesModel.active == 1).first()
        gernList = movie.genre.split(' ')
        for i in gernList:
            if dict_.get(i) == None:
                dict_.setdefault(i, 1)
            else:
                dict_[i] = dict_[i] + 1
    print(dict_)
    a1 = sorted(dict_.items(), key=lambda x: x[1], reverse=True)
    # most_genre_list = []
    if len(a1) > 1:
        return a1[0][0]
    else:
        return 0

def movie_recommend_user():
    uid = request.json.get('uid')

    page_index = request.json.get('page_index')
    page_size = request.json.get('page_size')
    result = {}
    mlist = []
    if uid:
        user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
        if user:
            # print("1")
            user_dict = user_rating_dict()
            similar = user_similar(user_dict)
            # print(similar)
            remList = []
            if similar.get(uid) != None:
                # print(len(similar[uid]), "000000000000")
                if len(similar[uid]) == 0:
                    return jsonify({'code': 400})
                most_similar_user = max(similar[uid], key=similar[uid].get)
                # print(most_similar_user)


                like_movie = movielikeModel.query.filter(movielikeModel.uid == most_similar_user, movielikeModel.active == 1, movielikeModel.type == 0).all()
                for i in like_movie:
                    if i.mid not in remList:
                        remList.append(i.mid)

                watch_wish_movie = wishWatchModel.query.filter(wishWatchModel.uid == most_similar_user, wishWatchModel.active == 1).all()
                for i in watch_wish_movie:
                    if i.mid not in remList:
                        remList.append(i.mid)

                watch_wish_movie = wishWatchModel.query.filter(wishWatchModel.uid == most_similar_user, wishWatchModel.active == 1).all()
                for i in watch_wish_movie:
                    if i.mid not in remList:
                        remList.append(i.mid)

                HighRate = RatingModel.query.filter(RatingModel.uid == most_similar_user, RatingModel.active == 1, RatingModel.rate >= 4).all()
                for i in HighRate:
                    if i.mid not in remList:

                        remList.append(i.mid)

                check_review = movieReviewModel.query.filter(movieReviewModel.uid == user.uid,
                                                             movieReviewModel.active == 1).all()
                for r in check_review:
                    if emotion_raview(r.review) == 1:
                        if r.mid not in remList:
                            remList.append(r.mid)
            else:
                list_ = get_user_like(uid)
                most_genre = count_genre(list_)
                # print(most_genre,"**88***8*")
                if most_genre != 0:
                    # genre_rule = and_(*[MoviesModel.genre.ilike("%" + input + "%") for input in most_genre])
                    # movies_genre = MoviesModel.query.filter(MoviesModel.active == 1, genre_rule).all()
                    # for movie in movies_genre:  # movies: [movies0, movies[1]....]
                    #     if movie.mid not in remList:
                    #         remList.append(movie.mid)
                    genre_rule = and_(MoviesModel.genre.ilike("%" + most_genre + "%"))
                    movies_genre = MoviesModel.query.filter(MoviesModel.active == 1, genre_rule).all()
                    for movie in movies_genre:  # movies: [movies0, movies[1]....]
                        if movie.mid not in remList:
                            remList.append(movie.mid)



            exceptList = except_list(uid)

            for i in remList:
                if i not in exceptList:
                    sim_movies = MoviesModel.query.filter(MoviesModel.active == 1, MoviesModel.mid == i).first()

                    mdict = res_movie_detail(uid, user, sim_movies)
                    mlist.append(mdict)
            # print(remList)

        start = page_index * page_size
        end = start + page_size
        result["count"] = len(mlist)

        if end < result["count"]:
            result["mlist"] = mlist[start:end]
        else:
            result["mlist"] = mlist[start:]

        return jsonify({'code': 200, 'result': result})
    else:
        return jsonify({'code': 200})
