import uuid

import memcache as memcache
from flask import Flask
from flask_mail import Mail, Message

from sqlalchemy import exists

from app.login.utils import *

from app.models import *
from flask_mail import Mail

def sent():
    mail = Mail(app)
    # mail ： https://temp-mail.org/en/
    msg = Message('Only Movie 3', recipients=['nageget605@exoacre.com'], body='Verification code  ： %s' % captcha)
    try:
        mail.send(msg)
    except:
        return jsonify({'code': 200, 'msg': 'sent email False'})
    return jsonify({'code': 200, 'msg': 'sent email succesfully'})