from flask import Flask
from . import views, movies


def init_route(app: Flask):
    app.add_url_rule('/login', view_func=views.login, methods=['POST'])
    app.add_url_rule('/register', view_func=views.register, methods=['POST'])
    app.add_url_rule('/app/views/get_user_detial', view_func=views.get_user_detial, methods=['POST'])
    # app.add_url_rule('/insert', view_func=views.insert, methods=['POST'])
    app.add_url_rule('/app/views/check_login', view_func=views.check_login)
    app.add_url_rule('/app/movies/get_movie_detial', view_func=movies.get_movie_detial, methods=['POST'])
