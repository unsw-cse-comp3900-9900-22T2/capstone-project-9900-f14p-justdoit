# 使用hash256 对密码进行加密
import datetime
import functools
import hashlib

import jwt
from flask import request, jsonify, g
from jwt import ExpiredSignatureError, PyJWTError

from config import SECRET_KEY

import re
import random
import time



def EnPassWord(password: str) -> str:
    return hashlib.sha256(password.encode('utf-8')).hexdigest()


# 生成Token
def GenToken(user) -> str:
    dic = {
        'exp': datetime.datetime.now() + datetime.timedelta(hours=2),  # 设置过期时间
        'iat': datetime.datetime.now(),  # 开始时间
        'data': {  # 内容，一般存放该用户id和开始时间
            'id': user.id,
            'username': user.username,
        },
    }
    # 生成token
    token = jwt.encode(dic, SECRET_KEY, algorithm='HS256')
    return token


# 登陆装饰器，用来设置那些需要登陆才能使用
def login_require(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        # 获取header中的token
        token = request.headers.get('Token')
        # 判断token是否为空
        if not token:
            return jsonify({'code': 401, 'msg': '请传入Token'})
        try:
            # 解析token
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        except ExpiredSignatureError as e:
            return jsonify({'code': 401, 'msg': 'token已失效'})
        except PyJWTError as e:
            return jsonify({'code': 401, 'msg': 'token异常'})
        # 将token中的user存入全局变量中
        g.user = data['data']
        return func(*args, **kwargs)

    return wrapper

# chect validate Email, 1:validate, 0:invalidate
def validateEmail(email):
    if len(email) > 7 and len(email) < 60:
        # if re.match("^.+\\@(\\[?)[a-zA-Z0-9\\-\\.]+\\.([a-zA-Z]{2,3}|[0-9]{1,3})(\\]?)$", email) != None:
            # print("good")
        # if "@" in email:
        if re.match("^([\\w\\.-]+)@([a-zA-Z0-9-]+)(\\.[a-zA-Z\\.]+)$", email) != None:
            return 1
    return 0

# generate random String
def randomString(num):
    a = random.sample('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', num)
    return ''.join(a)
# get datetime and timestamp
def getTime():
    time_stamp = time.localtime(time.time()) # 132131232434
    time_form = time.strftime('%Y-%m-%d %H:%M:%S', time_stamp)  # 2022-6-27 12:13:00

    time_stamp = int(time.mktime(time_stamp))
    return [time_form, time_stamp]
# generate unique id
def getUniqueid():
    time_stamp = getTime()[1]
    uniqueId = str(randomString(10)) + str(time_stamp)
    return uniqueId
# create verifycode
def create_verifycode(num):
    a = random.sample('0123456789', num)
    return ''.join(a)

#print movies basic on xx keyword
def print_avg_rate(res_list):
    for i in res_list:
        print("%s:  %s  %s" % (i['moviename'], i['avg_rate'], i['year']))

# order movies alphabetical after order by xxx categories
# ex: after order by avg_rate, we need to order them by alphabetical
def orderBy_alphabetical(movie_list, keyword):
    # order by alphabetical order
    cmp_val = None
    res_list = list()  # use to divides diff avg_rate movies
    temp = list()
    for m in movie_list:
        if m[keyword] != cmp_val:
            temp = sorted(temp, key=lambda m: m["moviename"])
            res_list.extend(temp)
            temp = list()
            cmp_val = m[keyword]
        temp.append(m)
    return res_list

#"1921, 2022,2003" => [1921, 2022, 2003] str to list
def year_strToList(year):
    if year == None or len(year) == 0 :
        return list()

    if year == "-1":
        year_lst = list()
        year_lst.append(-1)
        return year_lst

    year_lst = list()
    tmp = ""
    for i in year:
        if str.isspace(i):
            continue
        if i == ',':
            year_lst.append(int(tmp))
            tmp = ""
        else:
            if str.isnumeric(i):
                tmp += i
    year_lst.append(int(tmp))
    return year_lst
