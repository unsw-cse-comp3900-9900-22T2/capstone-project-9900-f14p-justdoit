from flask import jsonify, Blueprint, request, g
from sqlalchemy import exists

from app.login.utils import *

from app.models import *

import time
# movie = Blueprint('users', __name__)
# CORS(movie, resources=r'/*', supports_credentials=True)

# login
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    if not username or not password:
        return jsonify({'code': 400, 'msg': 'Please enter the account and password'})
    user = UserModel.query.filter(UserModel.username == username).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'User does not exist'})

    # 使用hash256加密密码
    en_pass = EnPassWord(password)
    if en_pass != user.password:
        return jsonify({'code': 400, 'msg': 'Password error'})
    token = GenToken(user)
    return jsonify({'code': 200, 'msg': 'Login successful', 'token': token})



def register():
    data = request.get_json(force=True)
    print(data)
    username = data["username"]
    password = data["password"]
    email = data["email"]
    print(username, password, email)
    if not username or not password or not email:
        return jsonify({'code': 400, 'msg': 'Please enter the account, password and email'})
    # username is too long
    if len(username) > 50:
        return jsonify({'code': 400, 'msg': 'Your username is too long.'})
    # valid email
    if not validateEmail(email):
        return jsonify({'code': 400, 'msg': 'Please enter a right email'})
    # check username exists
    check_name = db.session.query(
        exists().where(UserModel.username == username)
    ).scalar()
    if check_name:
        return jsonify({'code': 400, 'msg': 'User name already exists'})
    # check email exists
    check_email = db.session.query(
        exists().where(UserModel.email == email)
    ).scalar()
    if check_email:
        return jsonify({'code': 400, 'msg': 'Email already exists'})
    try:
        en_pass = EnPassWord(password)

        time_form = getTime()[0]
        uid = getUniqueid()

        user = UserModel(username=username, password=en_pass, email=email, uid=uid, ctime=time_form, utime=time_form)
        db.session.add(user)
        db.session.commit()
        return jsonify({'code': 200, 'msg': 'Successful registration'})
    except Exception as e:
        return jsonify({'code': 400, 'msg': 'Registration failure', 'error_msg': str(e)})



@login_require
def check_login():
    return jsonify({'code': 200, 'msg': 'Already login', 'user': g.user})


def get_user_detial():
    data = request.get_json(force=True)
    uid = data["uid"]
    print(uid)
    # find in database
    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    # if there is not movie
    if not user:
        return jsonify({'code': 400, 'msg': 'User not be defend'})
    result = {}
    result["username"] = user.username
    result["email"] = user.email
    result["description"] = user.description
    # should add follow number

    return jsonify({'code': 200, 'result': result})






def insert():
    mid = request.json.get('mid')
    # mid = "qawdadasd123718432312"
    moviename = "ambermovie"
    coverimage = "www.baidu.com"
    description = "good movies"
    genre = "A,B,C"
    cast = "asdasda"
    crew = "asdasasd"
    director = "asdas"
    country = 'asdasd'
    language = 'asdasdasd'
    avg_rate = 3.5
    ctime = time.localtime(time.time())
    utime = time.localtime(time.time())

    Movies = MoviesModel(mid=mid, moviename=moviename, coverimage=coverimage, description=description, genre=genre,
                         cast=cast, crew=crew, director=director, country=country,
                         language=language, avg_rate=avg_rate, ctime=ctime, utime=utime)

    db.session.add(Movies)
    db.session.commit()
    return jsonify({'code': 200})
