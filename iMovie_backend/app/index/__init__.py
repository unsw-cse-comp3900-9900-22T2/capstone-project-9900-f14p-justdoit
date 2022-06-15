from flask import Flask
from . import views


def init_route(app: Flask):
    app.add_url_rule('/', view_func=views.hello_world)
