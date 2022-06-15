
const apiRouter = require('./api')

module.exports = function(app){
    const urlPrefix = "";

    app.use(urlPrefix + '/api', apiRouter);
}