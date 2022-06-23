import uuid

import memcache as memcache
from flask import Flask
from flask_mail import Mail, Message

from sqlalchemy import exists

from app.login.utils import *

from app.models import *
from flask_mail import Mail
import time
def init_app(app: Flask):
    # mail = Mail()
    # mail.init_app(app)
    captcha = str(uuid.uuid1())[:6]     #生成随机6位验证码
    app.config['MAIL_SERVER'] = 'smtp.qq.com'
    app.config['MAIL_PORT'] = 465
    app.config['MAIL_USERNAME'] = '1191367164@qq.com'
    app.config['MAIL_PASSWORD'] = 'dzhkerjqqedkjbcf'
    app.config['MAIL_USE_TLS'] = False
    app.config['MAIL_USE_SSL'] = True
    app.config['MAIL_DEFAULT_SENDER'] = '1191367164@qq.com'
    #sent email
    def sent():     #不知道怎么在view funct 中传入参数 app 和 captcha， 才放在这
        mail = Mail(app)
        # mail ： https://temp-mail.org/en/
        msg = Message('Only Movie 3', recipients=['nageget605@exoacre.com'], body='Verification code  ： %s' % captcha)
        try:
            mail.send(msg)
        except:
            return jsonify({'code': 200, 'msg': 'sent email False'})
        return jsonify({'code': 200, 'msg': 'sent email succesfully'})


    app.add_url_rule("/verifyCode", view_func=sent, methods=['GET','POST'])

    # def checkVerifyCode():
    #     data = request.get_json(force=True)
    #     val = data["code"]
    #     print(val)
    #     if val != captcha:
    #         return jsonify({'code': 400, 'msg': 'wrong verifyCode'})
    #
    #     return jsonify({'code': 200, "result": 'verify successfully'})