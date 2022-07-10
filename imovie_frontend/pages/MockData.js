import Fetch from '../util/fetch';

const fetchData = (url, param) => {
    return Fetch.fetchAuditDataWithPromise(url, param);
};
//
// export function userRegister(param) {
//     return fetchData('http://localhost:5000/register', param);
// }
// export function userLogin(param) {
//     return fetchData('http://localhost:5000/login', param);
// }
// export function getUserDetail(param) {
//     return fetchData('http://localhost:5000/app/views/get_user_detail', param);
// }
// export function modifyUserDetail(param) {
//     return fetchData('http://localhost:5000/app/views/modify_user_detail', param);
// }
// export function sendEmail(param) {
//     return fetchData('http://localhost:5000/app/views/send_email', param);
// }
// export function changePassword(param) {
//     return fetchData('http://localhost:5000/app/views/change_password', param);
// }
// export function changePasswordInDetial(param) {
//     return fetchData('http://localhost:5000/app/views/change_password_in_detial', param);
// }
// export function getMovies(param) {
//     return fetchData('http://localhost:5000/app/movies/get_movies', param);
// }
// export function getMovieDetail(param) {
//     return fetchData('http://localhost:5000/app/movies/get_movie_detail', param);
// }
// export function wishlistAddOrDelete(param) {
//     return fetchData('http://localhost:5000/app/movies/wishlist_add_or_delete', param);
// }
// export function ratingMovie(param) {
//     return fetchData('http://localhost:5000/app/movies/rating_movie', param);
// }
// export function getWishlist(param) {
//     return fetchData('http://localhost:5000/app/movies/get_wishlist', param);
// }
// export function clearWishlist(param) {
//     return fetchData('http://localhost:5000/app/movies/clear_wishlist', param);
// }
// export function browseBy(param) {
//     return fetchData('http://localhost:5000/app/movies/browse_by', param);
// }


export function userRegister(param) {
    return fetchData('http://127.0.0.1:5000/register', param);
}
export function userLogin(param) {
    return fetchData('http://127.0.0.1:5000/login', param);
}
export function getUserDetail(param) {
    return fetchData('http://127.0.0.1:5000/app/views/get_user_detail', param);
}
export function modifyUserDetail(param) {
    return fetchData('http://127.0.0.1:5000/app/views/modify_user_detail', param);
}
export function sendEmail(param) {
    return fetchData('http://127.0.0.1:5000/app/views/send_email', param);
}
export function changePassword(param) {
    return fetchData('http://127.0.0.1:5000/app/views/change_password', param);
}
export function changePasswordInDetial(param) {
    return fetchData('http://127.0.0.1:5000/app/views/change_password_in_detial', param);
}
export function getMovies(param) {
    return fetchData('http://127.0.0.1:5000/app/movies/get_movies', param);
}
export function getMovieDetail(param) {
    return fetchData('http://127.0.0.1:5000/app/movies/get_movie_detail', param);
}
export function wishlistAddOrDelete(param) {
    return fetchData('http://127.0.0.1:5000/app/movies/wishlist_add_or_delete', param);
}
export function watchlistAddOrDelete(param) {
    return fetchData('http://127.0.0.1:5000/app/movies/watchlist_add_or_delete', param);
}
export function ratingMovie(param) {
    return fetchData('http://127.0.0.1:5000/app/movies/rating_movie', param);
}
export function getWishlist(param) {
    return fetchData('http://127.0.0.1:5000/app/movies/get_wishlist', param);
}
export function getWatchlist(param) {
    return fetchData('http://127.0.0.1:5000/app/movies/get_watchlist', param);
}
export function wish_to_watch(param) {
    return fetchData('http://127.0.0.1:5000/app/movies/wish_to_watch', param);
}
export function clearWishlist(param) {
    return fetchData('http://127.0.0.1:5000/app/movies/clear_wishlist', param);
}
// export function clearWatchlist(param) {
//     return fetchData('http://127.0.0.1:5000/app/movies/clear_watchlist', param);
// }
export function browseBy(param) {
    return fetchData('http://127.0.0.1:5000/app/movies/browse_by', param);
}
export function likeAddOrDelete(param) {
    return fetchData('http://127.0.0.1:5000/app/movies/like_add_or_delete', param);
}
export function dislikeAddOrDelete(param) {
    return fetchData('http://127.0.0.1:5000/app/movies/dislike_add_or_delete', param);
}
export function historyAddOrDelete(param) {
    return fetchData('http://127.0.0.1:5000/app/movies/view_history_add_or_delete', param);
}
export function getLike(param) {
    return fetchData('http://127.0.0.1:5000/app/movies/get_like', param);
}
export function getDislike(param) {
    return fetchData('http://127.0.0.1:5000/app/movies/get_dislike', param);
}
export function getHistory(param) {
    return fetchData('http://127.0.0.1:5000/app/movies/get_view_history', param);
}
// export function clearLike(param) {
//     return fetchData('http://127.0.0.1:5000/app/movies/clear_like', param);
// }
// export function clearDislike(param) {
//     return fetchData('http://127.0.0.1:5000/app/movies/clear_dislike', param);
// }
export function clearHistory(param) {
    return fetchData('http://127.0.0.1:5000/app/movies/clear_view_history', param);
}
export function searchBy(param) {
    return fetchData('http://127.0.0.1:5000/app/movies/search_by', param);
}
export function searchResult(param) {
    return fetchData('http://127.0.0.1:5000/app/movies/search_result', param);
}