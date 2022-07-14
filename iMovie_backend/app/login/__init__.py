from flask import Flask
from . import views, movies


def init_route(app: Flask):
    #for users
    app.add_url_rule('/login', view_func=views.login, methods=['POST'])
    app.add_url_rule('/register', view_func=views.register, methods=['POST'])
    app.add_url_rule('/app/views/check_login', view_func=views.check_login)
    app.add_url_rule('/app/views/get_user_detail', view_func=views.get_user_detail, methods=['POST'])
    # app.add_url_rule('/app/views/send_email', view_func=views.send_email, methods=['POST'])
    app.add_url_rule('/app/views/change_password', view_func=views.change_password, methods=['POST'])
    app.add_url_rule('/app/views/change_password_in_detial', view_func=views.change_password_in_detial, methods=['POST'])
    app.add_url_rule('/app/views/modify_user_detail', view_func=views.modify_user_detail, methods=['POST'])
    app.add_url_rule('/app/views/check_username', view_func=views.check_username, methods=['POST'])
    app.add_url_rule('/app/views/check_email', view_func=views.check_email, methods=['POST'])

    # for movies
    app.add_url_rule('/app/movies/get_movie_detail', view_func=movies.get_movie_detail, methods=['POST'])
    app.add_url_rule('/app/movies/rating_movie', view_func=movies.rating_movie, methods=['POST'])
    app.add_url_rule('/app/movies/get_movies', view_func=movies.get_movies, methods=['POST'])

    # wishlist
    app.add_url_rule('/app/movies/get_wishlist', view_func=movies.get_wishlist, methods=['POST'])
    app.add_url_rule('/app/movies/wishlist_add_or_delete', view_func=movies.wishlist_add_or_delete, methods=['POST'])
    app.add_url_rule('/app/movies/clear_wishlist', view_func=movies.clear_wishlist, methods=['POST'])
    app.add_url_rule('/app/movies/wish_to_watch', view_func=movies.wish_to_watch, methods=['POST'])

    # browse by
    app.add_url_rule('/app/movies/browse_by', view_func=movies.browse_by, methods=['POST'])

    # watchlist
    app.add_url_rule('/app/movies/get_watchlist', view_func=movies.get_watchlist, methods=['POST'])
    app.add_url_rule('/app/movies/watchlist_add_or_delete', view_func=movies.watchlist_add_or_delete, methods=['POST'])

    # like & dislike
    app.add_url_rule('/app/movies/get_like', view_func=movies.get_like, methods=['POST'])
    app.add_url_rule('/app/movies/like_add_or_delete', view_func=movies.like_add_or_delete, methods=['POST'])
    app.add_url_rule('/app/movies/get_dislike', view_func=movies.get_dislike, methods=['POST'])
    app.add_url_rule('/app/movies/dislike_add_or_delete', view_func=movies.dislike_add_or_delete, methods=['POST'])

    # view_history
    app.add_url_rule('/app/movies/get_view_history', view_func=movies.get_view_history, methods=['POST'])
    app.add_url_rule('/app/movies/view_history_add_or_delete', view_func=movies.view_history_add_or_delete, methods=['POST'])
    app.add_url_rule('/app/movies/clear_view_history', view_func=movies.clear_view_history, methods=['POST'])

    # enter the keyword into the search bar
    app.add_url_rule('/app/movies/search_by', view_func=movies.search_by, methods=['POST'])
    # return result depends on the search keyword
    app.add_url_rule('/app/movies/search_result', view_func=movies.search_result, methods=['POST'])
