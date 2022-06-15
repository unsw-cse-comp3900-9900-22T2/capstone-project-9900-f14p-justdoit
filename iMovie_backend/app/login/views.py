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

        user = UserModel(username=username, password=en_pass,email=email,uid=uid,ctime= time_form,utime= time_form)
        db.session.add(user)
        db.session.commit()
        return jsonify({'code': 200, 'msg': '注册成功'})
    except Exception as e:
        return jsonify({'code': 400, 'msg': '注册异常', 'error_msg': str(e)})


@login_require
def check_login():
    return jsonify({'code': 200, 'msg': '已登陆', 'user': g.user})


