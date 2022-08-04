# from flask import jsonify, Blueprint, request, g
from sqlalchemy import exists

from app.login.utils import *

from app.models import *
from sqlalchemy import or_, and_, not_
import time

# movie = Blueprint('users', __name__)
# CORS(movie, resources=r'/*', supports_credentials=True)

# login
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    if not username or not password:
        return jsonify({'code': 400, 'msg': 'Please enter the account and password'})

    user = UserModel.query.filter(UserModel.username == username, UserModel.active == 1, UserModel.role != 2).first()
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
    result["role"] = user.role
    result["username"] = user.username

    return jsonify({'code': 200, 'msg': 'Login successful', 'result': result})




def register():
    data = request.get_json(force=True)
    print(data)
    username = data["username"]
    password = data["password"]
    email = data["email"]
    verifycode = data["verifycode"]
    # verifycode = data["verifycode"]
    username = username.strip()
    email = email.strip()
    verifycode = verifycode.strip()
    # print(username, password, email)
    if not username or not password or not email or not verifycode:
        return jsonify({'code': 400, 'msg': 'Please enter the account, password and email'})

    # username is too long
    if len(username) > 50:
        return jsonify({'code': 400, 'msg': 'Your username is too long.'})
    if len(username) < 6:
        return jsonify({'code': 400, 'msg': 'Your username is too short.'})
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
    check_vercode = verifycodeModel.query.filter(verifycodeModel.email == email, verifycodeModel.verifycode == verifycode).first()
    if not check_vercode:
        return jsonify({'code': 400, 'msg': 'Your verify code is wrong please try again'})


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

def register_visitor():
    username = randomString(8)
    email = randomString(8) + "visitor@mail.com"
    password = "visitor123456"
    result = {}

    time_form = getTime()[0]
    uid = getUniqueid()

    user = UserModel(username=username,email = email,password=password, role=2, uid=uid, ctime=time_form, utime=time_form)
    db.session.add(user)
    db.session.commit()
    result["uid"] = uid
    result["role"] = 2
    result["username"] = username
    return jsonify({'code': 200, 'msg': 'Successful registration', 'result': result})




@login_require
def check_login():
    return jsonify({'code': 200, 'msg': 'Already login', 'user': g.user})


def check_username():
    username = request.json.get('username')
    uid = request.json.get('uid')
    username = username.strip()

    if not username:
        return jsonify({'code': 400, 'msg': 'Please enter your username'})
    # username is too long
    if len(username) > 50:
        return jsonify({'code': 400, 'msg': 'Your username is too long.'})
    if len(username) < 6:
        return jsonify({'code': 400, 'msg': 'Your username is too short.'})
    if not uid:
        check_name = db.session.query(exists().where(UserModel.username == username)).scalar()
    else:
        check_name = db.session.query(exists().where(UserModel.username == username, UserModel.uid != uid)).scalar()
    if check_name:
        return jsonify({'code': 400, 'msg': 'User name already exists'})
    if not validateUsername(username):
        return jsonify({'code': 400, 'msg': 'Username can only consist of numbers, letters, _ or -'})
    return jsonify({'code': 200})


def check_email():
    email = request.json.get('email')
    email = email.strip()
    if not email:
        return jsonify({'code': 400, 'msg': 'Please enter your email'})
    check_email = db.session.query(exists().where(UserModel.email == email)).scalar()
    if check_email:
        return jsonify({'code': 400, 'msg': 'Email already exists'})
    if not validateEmail(email):
        return jsonify({'code': 400, 'msg': 'Please enter a right email'})
    return jsonify({'code': 200})



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
    result["following_count"] = followModel.query.filter(and_(followModel.uid == uid, followModel.active == 1)).count()
    result["followers_count"] = followModel.query.filter(and_(followModel.fuid == uid, followModel.active == 1)).count()
    return jsonify({'code': 200, "result": result})


# def send_email():
#     email = request.json.get('email')
#     user = UserModel.query.filter(UserModel.email == email, UserModel.active == 1).first()
#     if not user:
#         return jsonify({'code': 400, 'msg': 'This email is not defined'})
#     verifycode = create_verifycode(4)
    # send email

    # save verifycode to sql
    # try:
    #     user.verifycode = verifycode
    #     user.utime = getTime()[0]
    #     db.session.commit()
    #     msg = "Verification code sent successfully, your Verification code is %(verifycode)s" %{"verifycode":verifycode}
    #     return jsonify({'code': 200, 'msg': msg})
    # except Exception as e:
    #     return jsonify({'code': 400, 'msg': 'Verification code send failure, please try again', 'error_msg': str(e)})




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
        return jsonify({'code': 400, 'msg': 'New password is same as old password'})
    try:
        en_password = EnPassWord(new_password)
        user.password = en_password
        user.utime = getTime()[0]
        db.session.commit()
        return jsonify({'code': 200, 'msg': "Password modified successfully"})
    except Exception as e:
        return jsonify({'code': 400, 'msg': 'Password modified successfully failure', 'error_msg': str(e)})



def modify_user_detail():
    data = request.get_json(force=True)
    uid = data["uid"]
    username = data["username"]
    description = data["description"]
    #
    #数据库找判断
    user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
    # 判断

    if not user:
        return jsonify({'code': 400, 'msg': 'User is not defined'})
    username = username.strip()
    description = description.strip()
    if not username:
        return jsonify({'code': 400, 'msg': 'Please enter the account and password'})

    if user.username != username:
        check_username = db.session.query(exists().where(UserModel.username == username,UserModel.active == 1)).scalar()
        if check_username:
            return jsonify({'code' : 400, 'msg': 'User name already exists'})
        # username is too long
        if len(username) > 50:
            return jsonify({'code': 400, 'msg': 'Your username is too long.'})
        if len(username) < 6:
            return jsonify({'code': 400, 'msg': 'Your username is too short.'})
        if not validateUsername(username):
            return jsonify({'code': 400, 'msg': 'Your username is not follow the rule.'})
    # # 给 backend
    try:
        time_form = getTime()[0]
        user.username = username
        if description:
            user.description = description
        user.utime = time_form
        db.session.commit()
        return jsonify({'code': 200, "result": "Successfully update profile"})

    except Exception as e:
        return jsonify({'code':400, 'msg': 'update profile failure', 'error_msg':str(e)})




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
    # print(follow_info.active)
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


# determine block or not
def check_block():
    data = request.get_json(force=True)
    o_uid = data["uid"]   # owner user
    buid = data["buid"]   # follower user
    o_usr = UserModel.query.filter(UserModel.uid == o_uid, UserModel.active == 1).first()
    if not o_usr:
        return jsonify({'code': 400, 'msg': 'owner user does not exist'})
    busr = UserModel.query.filter(UserModel.uid == buid, UserModel.active == 1).first()
    if not busr:
        return jsonify({'code': 400, 'msg': 'follower user does not exist'})
    follow_info = blocklistModel.query.filter(and_(blocklistModel.uid == o_uid, blocklistModel.buid == buid)).first()
    # print(follow_info.active)
    if not follow_info:
        return jsonify({'code': 200, 'result': 0})
    else:
        if follow_info.active == 1:
            return jsonify({'code': 200, 'result': 1})
        else:
            return jsonify({'code': 200, 'result': 0})
