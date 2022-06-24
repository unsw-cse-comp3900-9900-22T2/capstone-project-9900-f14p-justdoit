import uuid

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
    def sent():     #不知道怎么在view funct 中传入参数 app 和 captcha， 才放在这
        mail = Mail(app)
        # mail ： https://temp-mail.org/en/
        msg = Message('Only Movie 3', recipients=['nageget605@exoacre.com'], body='Verification code  ： %s' % captcha)
        try:
            mail.send(msg)
        except:
            return jsonify({'code': 400, 'msg': 'sent email False'})
        return jsonify({'code': 200, 'msg': 'sent email succesfully, the verification code is %s' % captcha})

    #reset password
    def reset():
        data = request.get_json(force=True)
        code = data["verification"]
        if code != captcha:
            return jsonify({'code': 400, 'msg': 'wrong verifyCode, can not change password'})
        #update password
        uid = data["uid"]
        password = data['password']         #new password
        c_password = data['c_password']     #confirm password

        user = UserModel.query.filter(UserModel.uid == uid, UserModel.active == 1).first()
        # user not exist
        if not user:
            return jsonify({'code': 400, 'msg': 'User is not defined'})
        if password != c_password:
            return jsonify({'code': 400, 'msg': 'password does not match'})
        user.password = password
        db.session.commit()
        return jsonify({'code': 200, 'msg': 'modify password successfully'})

    app.add_url_rule("/verifyCode", view_func=sent, methods=['GET','POST'])
    app.add_url_rule("/reset", view_func=reset, methods=['GET','POST'])

    #
    #     return jsonify({'code': 200, "result": 'verify successfully'})