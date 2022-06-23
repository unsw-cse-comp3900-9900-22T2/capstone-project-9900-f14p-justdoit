from flask import Flask
from . import views, movies


def init_route(app: Flask):
    app.add_url_rule('/login', view_func=views.login, methods=['POST'])
    app.add_url_rule('/register', view_func=views.register, methods=['POST'])
    app.add_url_rule('/app/views/check_login', view_func=views.check_login)
    app.add_url_rule('/app/views/get_user_detail', view_func=views.get_user_detail, methods=['POST'])
    app.add_url_rule('/app/movies/get_movie_detail', view_func=movies.get_movie_detial, methods=['POST'])
    app.add_url_rule('/app/views/modify_user_detail', view_func=views.modify_user_detail, methods=['POST'])

    # app.add_url_rule('/insert', view_func=views.insert, methods=['POST'])

    app.add_url_rule('/app/movies/get_wishlist', view_func=movies.get_wishlist, methods=['POST'])
    app.add_url_rule('/app/movies/add_to_wishlist', view_func=movies.add_to_wishlist, methods=['POST'])
    app.add_url_rule('/app/movies/delete_from_wishlist', view_func=movies.delete_from_wishlist, methods=['POST'])
    # app.add_url_rule('/app/movies/clear_wishlist', view_func=movies.clear_wishlist, methods=['POST'])
    # app.add_url_rule('/app/movies/trans_movie_from_wishlist_to_watchedlist', view_func=movies.trans_movie_from_wishlist_to_watchedlist, methods=['POST'])
    app.add_url_rule('/app/movies/insert_movie_for_test', view_func=movies.insert_movie_for_test, methods=['POST'])

