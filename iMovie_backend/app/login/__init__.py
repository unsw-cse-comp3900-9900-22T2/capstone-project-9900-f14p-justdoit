from flask import Flask
from . import views, movies, recommend


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
    app.add_url_rule('/app/views/register_visitor', view_func=views.register_visitor, methods=['POST'])

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

    # write comment on movie details page
    app.add_url_rule('/app/movies/create_review', view_func=movies.create_review, methods=['POST'])

    # reply other users' review
    app.add_url_rule('/app/movies/reply_review', view_func=movies.reply_review, methods=['POST'])

    # like user' review
    app.add_url_rule('/app/movies/like_review', view_func=movies.like_review, methods=['POST'])

    # display reviews under movie details
    app.add_url_rule('/app/movies/display_movieReview', view_func=movies.display_movieReview, methods=['POST'])

    # display movie reviews user posted before
    app.add_url_rule('/app/movies/display_usersMovieReview', view_func=movies.display_usersMovieReview, methods=['POST'])

    # delete movie reviews user posted before
    app.add_url_rule('/app/movies/delete_movieReview', view_func=movies.delete_movieReview, methods=['POST'])

    # delete user review
    app.add_url_rule('/app/movies/delete_userReview', view_func=movies.delete_userReview, methods=['POST'])

    #followe / not follow users
    app.add_url_rule('/app/views/follow_or_not', view_func=views.follow_or_not, methods=['POST'])
    app.add_url_rule('/app/views/get_followers', view_func=views.get_followers, methods=['POST'])
    app.add_url_rule('/app/views/check_follow', view_func=views.check_follow, methods=['POST'])
    app.add_url_rule('/app/views/block_user', view_func=views.block_user, methods=['POST'])
    app.add_url_rule('/app/views/get_blockers', view_func=views.get_blockers, methods=['POST'])
    app.add_url_rule('/app/views/check_block', view_func=views.check_block, methods=['POST'])

    # similar movies
    app.add_url_rule('/app/recommend/movie_similer_recommend', view_func=recommend.movie_similer_recommend, methods=['POST'])
    # similar user movies
    app.add_url_rule('/app/recommend/movie_recommend_user', view_func=recommend.movie_recommend_user, methods=['POST'])

    app.add_url_rule('/app/movies/insert_movie', view_func=movies.insert_movie, methods=['POST'])
    app.add_url_rule('/app/movies/rate_display', view_func=movies.rate_display, methods=['POST'])
    app.add_url_rule('/app/movies/rate_distribution', view_func=movies.rate_distribution, methods=['POST'])
    # movie_list
    app.add_url_rule('/app/movies/create_movielist', view_func=movies.create_movielist, methods=['POST'])
    app.add_url_rule('/app/movies/edit_movielist', view_func=movies.edit_movielist, methods=['POST'])
    app.add_url_rule('/app/movies/delete_movielist', view_func=movies.delete_movielist, methods=['POST'])
    app.add_url_rule('/app/movies/add_movie_to_movielist', view_func=movies.add_movie_to_movielist, methods=['POST'])
    app.add_url_rule('/app/movies/delete_movie_from_movielist', view_func=movies.delete_movie_from_movielist, methods=['POST'])
    app.add_url_rule('/app/movies/get_movielists', view_func=movies.get_movielists, methods=['POST'])
    app.add_url_rule('/app/movies/get_movies_in_movielist', view_func=movies.get_movies_in_movielist, methods=['POST'])
    app.add_url_rule('/app/movies/get_latest_movielists', view_func=movies.get_latest_movielists, methods=['POST'])
    app.add_url_rule('/app/movies/get_movielists_in_mdp', view_func=movies.get_movielists_in_mdp, methods=['POST'])

    app.add_url_rule('/app/movies/get_recent_movies', view_func=movies.get_recent_movies, methods=['POST'])
