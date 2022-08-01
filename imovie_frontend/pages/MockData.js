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
export function checkUsername(param) {
    return fetchData('http://127.0.0.1:5000/app/views/check_username', param);
}
export function checkEmail(param) {
    return fetchData('http://127.0.0.1:5000/app/views/check_email', param);
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
export function createReview(param) {
    return fetchData('http://127.0.0.1:5000/app/movies/create_review', param);
}
export function displayMovieReview(param) {
    return fetchData('http://127.0.0.1:5000/app/movies/display_movieReview', param);
}
export function likeReview(param) {
    return fetchData('http://127.0.0.1:5000/app/movies/like_review', param);
}
export function replyReview(param) {
    return fetchData('http://127.0.0.1:5000/app/movies/reply_review', param);
}
export function displayUsersMovieReview(param) {
    return fetchData('http://127.0.0.1:5000/app/movies/display_usersMovieReview', param);
}
export function deleteMovieReview(param) {
    return fetchData('http://127.0.0.1:5000/app/movies/delete_movieReview', param);
}
export function movieSimilerRecommend(param) {
    return fetchData('http://127.0.0.1:5000/app/recommend/movie_similer_recommend', param);
}
export function movieRecommendUser(param) {
    return fetchData('http://127.0.0.1:5000/app/recommend/movie_recommend_user', param);
}
export function registerVisitor(param){
    return fetchData('http://127.0.0.1:5000/app/views/register_visitor', param);
}
export function followOrNot(param){
    return fetchData('http://127.0.0.1:5000/app/views/follow_or_not', param);
}
export function getFollowers(param){
    return fetchData('http://127.0.0.1:5000/app/views/get_followers', param);
}
export function checkFollow(param){
    return fetchData('http://127.0.0.1:5000/app/views/check_follow', param);
}
export function insertMovie(param){
    return fetchData('http://127.0.0.1:5000/app/movies/insert_movie', param);
}
export function blockOrNot(param){
    return fetchData('http://127.0.0.1:5000/app/views/block_user', param);
}
export function getBlockers(param){
    return fetchData('http://127.0.0.1:5000/app/views/get_blockers', param);
}
export function checkBlock(param){
    return fetchData('http://127.0.0.1:5000/app/views/check_block', param);
}
export function rateDisplay(param){
    return fetchData('http://127.0.0.1:5000/app/movies/rate_display', param);
}
export function rateDistribution(param){
    return fetchData('http://127.0.0.1:5000/app/movies/rate_distribution', param);
}
export function sentRecentMovie(param){
    return fetchData('http://127.0.0.1:5000/app/views/sent_recent_movie', param);
}
export function getRecentMovies(param){
    return fetchData('http://127.0.0.1:5000/app/movies/get_recent_movies', param);
}
/*
movies list
 */
//查询影单列表
export function getMoviesList(param) {
    return fetchData('http://127.0.0.1:5000/app/movies/get_movielists', param);
}
//创建一个影单
export function addMoviesList(param) {
    return fetchData('http://127.0.0.1:5000/app/movies/create_movielist', param);
}
//编辑影单
export function editMoviesList(param) {
    return fetchData('http://127.0.0.1:5000/app/movies/edit_movielist', param);
}
//删除一个影单
export function delMoviesList(param) {
    return fetchData('http://127.0.0.1:5000/app/movies/delete_movielist', param);
}
//添加一个电影到影单
export function addMovieToList(param) {
    return fetchData('http://127.0.0.1:5000/app/movies/add_movie_to_movielist', param);
}
//从影单删除一个电影
export function delMovieFromList(param) {
    return fetchData('http://127.0.0.1:5000/app/movies/delete_movie_from_movielist', param);
}
//获取影单的电影列表
export function getMoviesInList(param) {
    return fetchData('http://127.0.0.1:5000/app/movies/get_movies_in_movielist', param);
}
//查询主页的影单列表
export function getMoviesListInHome(param) {
    return fetchData('http://127.0.0.1:5000/app/movies/get_latest_movielists', param);
}
//查询详情页的影单列表
export function getMoviesListInDetail(param) {
    return fetchData('http://127.0.0.1:5000/app/movies/get_movielists_in_mdp', param);
}