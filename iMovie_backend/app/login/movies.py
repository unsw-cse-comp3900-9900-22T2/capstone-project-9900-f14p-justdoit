from flask import jsonify, Blueprint, request, g
from sqlalchemy import exists,func
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
            return jsonify({'code': 400, 'msg': 'Registration failure', 'error_msg': str(e)})
    # calculate avg rate
    avg_rate = db.session.query(func.avg(RatingModel.rate)).filter(RatingModel.uid == uid, RatingModel.mid == mid, RatingModel.active == 1)

    # update movies
    movie.avg_rate = avg_rate
    movie.utime = getTime()[0]
    db.session.commit()
    return jsonify({'code': 200, 'msg': 'Successful registration'})
    # all_rate = 0
    # num = 0
    # cal__rate = RatingModel.query.filter(RatingModel.mid == mid, RatingModel.active == 1).all()
    # for item in cal__rate:
    #     all_rate = all_rate + item.rate
    #     num = num + 1





