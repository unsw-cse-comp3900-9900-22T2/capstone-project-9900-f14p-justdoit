import axios from 'axios'
export default class Fetch {

  static getAuditUrlPrefix = (env, isHttps) => {
    let urlPrefix;
    const domain = isHttps ? "https://" : "http://";
    urlPrefix = domain + 'localhost:5000/';
    return urlPrefix;
  };

  static fetchAuditDataWithPromise = (url, param, env) => {
    let postUrl = url;
    if (url.indexOf('https://') < 0 && url.indexOf('http://') < 0) {
      const isHttps = (window.location.protocol || '').indexOf('https:') >= 0;
      postUrl = Fetch.getAuditUrlPrefix(env, isHttps) + url;
    }
    return new Promise((resolve, reject) => {
      axios
        .post(postUrl, {
          ...param
        })
        .then((res) => {
          if (res) {
            const { data } = res;
            resolve(data)
          } else {
            reject()
          }
        })
        .catch((_e) => {
          reject(_e)
        })
    });
  };
}