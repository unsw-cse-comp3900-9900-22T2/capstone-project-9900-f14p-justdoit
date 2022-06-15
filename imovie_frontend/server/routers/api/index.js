/**
 * Created by lei_sun on 2019/8/20.
 */
const express = require('express');
const moment = require('moment');
const timeApi = require('./time');
const response = require('../response');

const router = express.Router();

router.use(function timeLog(req, res, next) {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log(moment().format('YYYY-MM-DD HH:mm:ss') + ' ' + fullUrl);
    next();
});

timeApi.handleRouter(router);

router.get('/*', function(req, res) {
    console.log('api/*')
    response.show404(res);
});

module.exports = router;