const next = require('next');
const express = require('express');
const path = require('path');
const serverRouters = require('./server/routers');
const bodyParser = require('body-parser')
const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });
const cookieParser = require('cookie-parser');
const handle = app.getRequestHandler();
const baseJs = require( 'js-base64')

const routerConfig = require('./router.config');
const server = express();
app.prepare().then(()=>{

    server.use(bodyParser.json());
    server.use(express.json());
    server.use(express.urlencoded({
        extended: true
    }));
    server.use(cookieParser());
    server.use('/static', express.static(path.join(__dirname, 'static')))

    serverRouters(server);
    routerConfig(app,server);
    server.listen(8080, (err)=>{
        if(err)
            throw err
        console.log('> Ready on http://localhost:8080')
    })
}).catch((ex)=>{
    console.error(ex.stack)
    process.exit(1)
})