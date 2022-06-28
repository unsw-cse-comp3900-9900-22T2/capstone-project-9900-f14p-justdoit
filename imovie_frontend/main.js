const next = require('next');
const express = require('express');
const path = require('path');
const serverRouters = require('./server/routers');
const bodyParser = require('body-parser')
const dev = process.env.NODE_ENV !== 'production';
const cors = require("cors");
const app = next({ dev });
const cookieParser = require('cookie-parser');
const handle = app.getRequestHandler();
const baseJs = require( 'js-base64')

const routerConfig = require('./router.config');
const server = express();
const corsOptions ={
    origin:'http://localhost:5000',
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.prepare().then(()=>{
    server.use(cors(corsOptions));
    server.use(bodyParser.json());
    server.use(express.json());
    server.use(express.urlencoded({
        extends: true
    }));
    server.use(cookieParser());
    server.use('/static', express.static(path.join(__dirname, 'static')))
    server.use( (req, res, next) =>{
        //Enabling CORS
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,Accept, x-client-key, x-client-token, x-client-secret, Authorization");
        next();
    });
    serverRouters(server);
    routerConfig(app,server);
    server.all(`/movie/*`, (req, res, next) => {

    })
    server.all(`/api/*`, (req, res, next) => {
        let token_data = req.cookies['USER_MESSAGE'];
        console.log(123123123)
        const getToken = (token) => {
            let _token = "";
            const tokenJson = {}
            if(!!token){
                try{
                    _token = baseJs.Base64.decode(token);
                    const tokenList = _token.split("&&");
                    if(tokenList.length > 0){
                        tokenJson["name"] = tokenList[0]
                    }
                    if(tokenList.length > 1){
                        tokenJson["id"] = tokenList[1]
                    }
                    if(tokenList.length > 2){
                        tokenJson["time"] = tokenList[2]
                    }
                }catch (e) {

                }
            }
            return tokenJson
        }
        if(!!token_data){
            try {
                token_data = JSON.parse(token_data)
            }catch (e) {

            }
        }
        let tokenMsg = {}
        if(!!token_data && !!token_data.token){
            tokenMsg = getToken(token_data["token"])
        }
        let {time} = tokenMsg;
        if(!!time){
            time = parseInt(time,10)
        }
        const _thisTime =  (new Date()).getTime();
        console.log(time && time > _thisTime,_thisTime,time)
        if(time && time > _thisTime){
            next();
        }else{
            if(req.url.indexOf("/login") >= 0){
                next();
            }else{
                res.send({
                    code : "fail",
                    err : "登陆失效"
                })
            }
        }
    })
    server.all('/login', (req, res,next)=> {
        console.log(12313123)
        res.clearCookie('USER_MESSAGE');
        next();
    })
    server.listen(8080, (err)=>{
        if(err)
            throw err
        console.log('> Ready on http://localhost:8080')
    })
}).catch((ex)=>{
    console.error(ex.stack)
    process.exit(1)
})