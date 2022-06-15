/**
 * Created by lei_sun on 2019/8/20.
 */
let obj = {};

obj.showJSON = function(res, content){
    res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8'
    });
    res.end(JSON.stringify(content));
};

obj.show404 = function(res){
    res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8'
    });
    res.end('<html><body><div>404</div></body></html>');
};

obj.getClientIp = function(req) {
    if(req){
        let ip = req.headers['x-forwarded-for'] ||
            req.ip ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress || '';

        if(ip.split(',').length > 0){
            ip = ip.split(',')[0];
        }
        ip = ip.substr(ip.lastIndexOf(':') + 1, ip.length);
        return ip;
    }
    return '';
}

module.exports = obj;