from flask import Flask
from flask_mail import Message
from app.login.utils import *
from flask_mail import Mail
from app.models import *


def init_app(app: Flask):

    #放在config文件没config成功，先写在这
    #0
    app.config['MAIL_SERVER'] = 'smtp.qq.com'
    app.config['MAIL_PORT'] = 465
    app.config['MAIL_USERNAME'] = '1191367164@qq.com'
    app.config['MAIL_PASSWORD'] = 'dzhkerjqqedkjbcf'        #smtp修改后的code
    app.config['MAIL_USE_TLS'] = False
    app.config['MAIL_USE_SSL'] = True
    app.config['MAIL_DEFAULT_SENDER'] = '1191367164@qq.com'
    #sent email
    def send_email():     #不知道怎么在view funct 中传入参数 app 和 captcha， 才放在这
        verifycode = create_verifycode(4)  # 生成随机4位验证码
        receiver = request.json.get('email')
        sender = Mail(app)
        # mail ： https://temp-mail.org/en/
        user = UserModel.query.filter(UserModel.email == receiver, UserModel.active == 1).first()
        if user:
            msg = Message('Only Movie', recipients=[receiver])
            msg.body = 'Dear ' +  user.username + ",\n"\
                    "Please use this verification code to reset your password. So we want to make sure it’s really you.\n"\
                    "The Verification code  ："+str(verifycode) + "\n"\
                    "Thanks for helping ups keep your account secure.\n"\
                    "The OnlyMovie Team.\n"

            try:
                user.verifycode = verifycode
                user.utime = getTime()[0]
                db.session.commit()
                sender.send(msg)
                return jsonify({'code': 200, 'msg': 'sent email succesfully'})

            except Exception as e:
                return jsonify({'code': 400, 'msg': 'Verification code send failure, please try again'})
        else:

            msg = Message('Only Movie', recipients=[receiver])
            msg.body = 'Dear User,\n'\
                        "Please use this verification code to register your account. So we want to make sure it’s really you.\n" \
                                                 "The Verification code  ：" + str(verifycode) + "\n" \
                                                    "Thanks for helping ups keep your account secure.\n" \
                                                                "The OnlyMovie Team.\n"

            try:
                email = verifycodeModel.query.filter(verifycodeModel.email == receiver).first()
                if email:
                    email.verifycode = verifycode
                    email.utime = getTime()[0]
                    db.session.commit()
                else:
                    time_form = getTime()[0]
                    email_new = verifycodeModel(email = receiver,verifycode=verifycode, ctime=time_form,
                                     utime=time_form)
                    db.session.add(email_new)
                    db.session.commit()

                sender.send(msg)
                return jsonify({'code': 200, 'msg': 'sent email succesfully'})

            except Exception as e:
                return jsonify({'code': 400, 'msg': 'Verification code send failure, please try again'})

    def compare_time(timeA, timeB):
        # print(timeA, timeB)
        timeAList = timeA.split("-")
        timeBList = timeB.split("-")
        d1 = datetime.date(int(timeAList[0]), int(timeAList[1]), int(timeAList[2]))
        d2 = datetime.date(int(timeBList[0]), int(timeBList[1]), int(timeBList[2]))
        return (d1 - d2).days

    def sent_recent_movie():
        sender = Mail(app)
        recent_movies = MoviesModel.query.filter(MoviesModel.release_date != None, MoviesModel.active == 1).all()
        now = getTime()[0]
        if len(recent_movies) > 0:
            for i in recent_movies:
                data = now.split(" ")[0]
                timeB = i.release_date.split(" ")[0]
                day_ = compare_time(data, timeB)
                if day_ <= 3:

                    wishList = wishWatchModel.query.filter(wishWatchModel.mid == i.mid, wishWatchModel.type == 0,
                                                           wishWatchModel.active == 1).all()
                    if len(wishList) > 0:
                        for j in wishList:
                            user = UserModel.query.filter(UserModel.uid == j.uid, UserModel.active == 1).first()
                            if user:
                                username = user.username
                                moviename = i.moviename
                                check_email_send = recentmovieModel.query.filter(recentmovieModel.uid == j.uid,
                                                                                 recentmovieModel.mid == j.mid).all()
                                # print(len(check_email_send))
                                if not check_email_send:

                                    msg = Message('Only Movie', recipients=[user.email])
                                    msg.body = 'Dear ' + str(username) + ',\n' \
                                                                         "Movie \"" + str(
                                        moviename) + "\" is coming out, please remember to watch it in the cinema! " \
                                                     "Thank you for your attention.\n" \
                                                     "The OnlyMovie Team.\n"
                                    try:
                                        time_form = getTime()[0]
                                        count = 1
                                        recent_new = recentmovieModel(uid=j.uid, mid=j.mid, count=count,
                                                                      ctime=time_form,
                                                                      utime=time_form)
                                        db.session.add(recent_new)
                                        db.session.commit()
                                        sender.send(msg)

                                    except Exception as e:
                                        continue
        return jsonify({'code': 200, 'msg': 'sent email succesfully'})

    app.add_url_rule("/app/views/send_email", view_func=send_email, methods=['GET','POST'])
    app.add_url_rule("/app/views/sent_recent_movie", view_func=sent_recent_movie, methods=['GET', 'POST'])

    #
    #     return jsonify({'code': 200, "result": 'verify successfully'})
