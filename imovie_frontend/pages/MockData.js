import Fetch from '../util/fetch';

const fetchData = (url, param) => {
    return Fetch.fetchAuditDataWithPromise(url, param);
};

export function userRegister(param) {
    return fetchData('http://localhost:5000/register', param);
}
export function userLogin(param) {
    return fetchData('http://localhost:5000/login', param);
}
export function getUserDetail(param) {
    return fetchData('http://localhost:5000/app/views/get_user_detail', param);
}