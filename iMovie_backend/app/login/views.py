# from flask import jsonify, Blueprint, request, g
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

    user = UserModel.query.filter(UserModel.username == username, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'User does not exist'})

    # 使用hash256加密密码
    en_pass = EnPassWord(password)
    if en_pass != user.password:
        return jsonify({'code': 400, 'msg': 'Password error'})
    # uid :
    result = {}
    result["token"] = GenToken(user)
    result["uid"] = user.uid
    result["email"] = user.email
    result["username"] = user.username

    return jsonify({'code': 200, 'msg': 'Login successful', 'result': result})




def register():
    data = request.get_json(force=True)
    print(data)
    username = data["username"]
    password = data["password"]
    email = data["email"]

    # print(username, password, email)
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


def get_user_detail():
    #前端给的
    data = request.get_json(force=True)
    uid = data["uid"]
    # 数据库找判断
    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    # 判断
    if not user:
        return jsonify({'code': 400, 'msg': 'User is not defined'})
    # 给 backend
    result = {}
    result["username"] = user.username
    result["email"] = user.email
    result["description"] = user.description

    return jsonify({'code': 200, "result": result})


def send_email():
    email = request.json.get('email')
    user = UserModel.query.filter(UserModel.email == email, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'This email is not defined'})
    verifycode = create_verifycode(4)
    # send email

    # save verifycode to sql
    try:
        user.verifycode = verifycode
        user.utime = getTime()[0]
        db.session.commit()
        msg = "Verification code sent successfully, your Verification code is %(verifycode)s" %{"verifycode":verifycode}
        return jsonify({'code': 200, 'msg': msg})
    except Exception as e:
        return jsonify({'code': 400, 'msg': 'Verification code send failure, please try again', 'error_msg': str(e)})




def change_password():
    email = request.json.get('email')
    verifycode = request.json.get('verifycode')
    password = request.json.get('password')
    user = UserModel.query.filter(UserModel.email == email, UserModel.active == 1).first()
    if not user:
        return jsonify({'code': 400, 'msg': 'This email is not defined'})
    # check verifycode
    verifycode = int(verifycode)
    if user.verifycode != verifycode:
        return jsonify({'code': 400, 'msg': 'Verification code is wrong'})
    try:
        new_pass = EnPassWord(password)
        user.password = new_pass
        user.utime = getTime()[0]
        db.session.commit()
        return jsonify({'code': 200, 'msg': "Password modified successfully"})
    except Exception as e:
        return jsonify({'code': 400, 'msg': 'Password modified successfully failure', 'error_msg': str(e)})



def change_password_in_detial():
    uid = request.json.get('uid')
    old_password = request.json.get('old_password')
    new_password = request.json.get('new_password')
    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()

    if not user:
        return jsonify({'code': 400, 'msg': 'This email is not defined'})
    oen_password = EnPassWord(old_password)
    if user.password != oen_password:
        return jsonify({'code': 400, 'msg': 'Old password is wrong'})

    if old_password == new_password:
        return jsonify({'code': 400, 'msg': 'New password is same to old password'})
    try:
        en_password = EnPassWord(new_password)
        user.password = en_password
        user.utime = getTime()[0]
        db.session.commit()
        return jsonify({'code': 200, 'msg': "Password modified successfully"})
    except Exception as e:
        return jsonify({'code': 400, 'msg': 'Password modified successfully failure', 'error_msg': str(e)})


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


def modify_user_detail():
    data = request.get_json(force=True)
    uid = data["uid"]
    username = data["username"]
    email = data["email"]
    description = data["description"]
    #
    #数据库找判断
    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    # 判断

    if not user:
        return jsonify({'code': 400, 'msg': 'User is not defined'})
    if user.username != username:
        check_username = db.session.query(exists().where(UserModel.username == username,UserModel.active == 1)).scalar()
        if check_username:
            return jsonify({'code' : 400, 'msg': 'User name already exists'})
    if user.email != email:
        check_email = db.session.query(exists().where(UserModel.email == email, UserModel.active == 1)).scalar()
        if check_email:
            return jsonify({'code' : 400, 'msg': 'Email is already exists'})
    # # 给 backend
    try:
        time_form = getTime()[0]
        user.username = username
        user.email = email
        user.description = description
        user.utime = time_form
        db.session.commit()
        return jsonify({'code': 200, "result": "Successfully update profile"})

    except Exception as e:
        return jsonify({'code':400, 'msg': 'update profile failure', 'error_msg':str(e)})
