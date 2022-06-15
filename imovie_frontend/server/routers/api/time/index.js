/**
 * Created by chenjiajie on 2020/4/13.
 */
//https://www.cnblogs.com/zhaowinter/p/10776868.html
const response = require('../../response')
let obj = {};

obj.handleRouter = function(router){
    router.post('/time/getTime', function(req, res) {
        console.log('time/getTime')
        const date = (new Date()).getTime();
        response.showJSON(res, {
            time: date
        });
    });
};

module.exports = obj;