from flask import Flask
from . import views, movies


def init_route(app: Flask):
    #for users
    app.add_url_rule('/login', view_func=views.login, methods=['POST'])
    app.add_url_rule('/register', view_func=views.register, methods=['POST'])
    app.add_url_rule('/app/views/check_login', view_func=views.check_login)
    app.add_url_rule('/app/views/get_user_detail', view_func=views.get_user_detail, methods=['POST'])
    app.add_url_rule('/app/views/update_user_detail', view_func=views.update_user_detail, methods=['POST'])
    app.add_url_rule('/app/views/send_email', view_func=views.send_email, methods=['POST'])
    app.add_url_rule('/app/views/change_password', view_func=views.change_password, methods=['POST'])




    # for movies
    app.add_url_rule('/app/movies/get_movie_detial', view_func=movies.get_movie_detial, methods=['POST'])
    app.add_url_rule('/app/movies/rating_movie', view_func=movies.rating_movie, methods=['POST'])

    # app.add_url_rule('/insert', view_func=views.insert, methods=['POST'])


