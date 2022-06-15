
const router = require("./router");


module.exports = function (app,server) {
    const handle = app.getRequestHandler();
    for(let i = 0 ; i < router.length ; i++){
        const _router = router[i];
        if(_router.reg && _router.pageName){
            server.get(_router.reg, (req, res) => {
                const actualPage = _router.pageName;
                let params = {};
                if(_router.params){
                    for(let x = 0 ; x < _router.params.length ; x++){
                        const _params  = _router.params[x];
                        params[_params] = req.params[_params];
                    }
                }
                const queryParams = params;
                app.render(req, res, actualPage, queryParams)
            })
        }
    }
    server.get('*', (req, res)=>{

        //console.log('originalUrl', req.originalUrl)
        /*const parsedUrl = parse(req.url,true);
        const { pathname , query } =  parsedUrl;

        //路由映射，自定义服务端路由
        /!*if(pathname === "/Test"){
            return app.render(req, res, '/Test2', query)
        }else if(pathname === "/Test2"){
            return app.render(req, res, '/Test', query)
        }else{*!/
        return handle(req,res,parsedUrl);
        /!* }*!/*/
        return handle(req, res)
    });
}

