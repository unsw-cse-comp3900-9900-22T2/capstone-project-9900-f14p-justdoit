from flask import Flask
from flask_mail import Mail, Message

from sqlalchemy import exists

from iMovie_backend.app.login.utils import *

from flask_mail import Mail
import time

from iMovie_backend.app.login.utils import *
from app.models import *


def init_app(app: Flask):

    verifycode = create_verifycode(4) #生成随机4位验证码
    #放在config文件没config成功，先写在这
    #
    app.config['MAIL_SERVER'] = 'smtp.qq.com'
    app.config['MAIL_PORT'] = 465
    app.config['MAIL_USERNAME'] = '1191367164@qq.com'
    app.config['MAIL_PASSWORD'] = 'dzhkerjqqedkjbcf'        #smtp修改后的code
    app.config['MAIL_USE_TLS'] = False
    app.config['MAIL_USE_SSL'] = True
    app.config['MAIL_DEFAULT_SENDER'] = '1191367164@qq.com'
    #sent email
    def send_email():     #不知道怎么在view funct 中传入参数 app 和 captcha， 才放在这
        receiver = request.json.get('email')
        sender = Mail(app)
        # mail ： https://temp-mail.org/en/
        msg = Message('Only Movie', recipients=[receiver], body='Verification code  ： %s' % verifycode)
        user = UserModel.query.filter(UserModel.email == receiver, UserModel.active == 1).first()
        try:
            user.verifycode = verifycode
            user.utime = getTime()[0]
            db.session.commit()
            sender.send(msg)
            return jsonify({'code': 200, 'msg': 'sent email succesfully, the verification code is %s' % verifycode})

        except Exception as e:
            return jsonify({'code': 400, 'msg': 'Verification code send failure, please try again'})
    app.add_url_rule("/app/views/send_email", view_func=send_email, methods=['GET','POST'])

    #
    #     return jsonify({'code': 200, "result": 'verify successfully'})