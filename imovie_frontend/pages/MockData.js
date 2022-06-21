import Fetch from '../util/fetch';

const fetchData = (url, param) => {
    return Fetch.fetchAuditDataWithPromise(url, param);
};

export function userRegister(param) {
    return fetchData('http://a.uat.qa.nt.ctripcorp.com:5000/api/user/register', param);
}
export function userLogin(param) {
    return fetchData('http://a.uat.qa.nt.ctripcorp.com:5000/api/user/login', param);
}