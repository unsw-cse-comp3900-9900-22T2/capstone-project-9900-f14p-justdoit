from flask import Flask
from . import views, movies


def init_route(app: Flask):
    app.add_url_rule('/app/views/login', view_func=views.login, methods=['POST'])
    app.add_url_rule('/app/views/register', view_func=views.register, methods=['POST'])
    app.add_url_rule('/app/views/check_login', view_func=views.check_login)
