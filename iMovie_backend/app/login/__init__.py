from flask import Flask
from . import views, movies


def init_route(app: Flask):
    app.add_url_rule('/login', view_func=views.login, methods=['POST'])
    app.add_url_rule('/register', view_func=views.register, methods=['POST'])
    app.add_url_rule('/app/views/check_login', view_func=views.check_login)

    app.add_url_rule('/app/movies/add_to_wishlist', view_func=movies.add_to_wishlist, methods=['POST'])
    app.add_url_rule('/app/movies/delete_from_wishlist', view_func=movies.delete_from_wishlist, methods=['POST'])