var fs = require('fs'),
    router = require('../routes'),
    morgan = require('morgan'),
    config = require('../configuration'),
    sql = require("mssql");

module.exports = function (app) {

    var accessLogStream = fs.createWriteStream('logs' + '/app.log', {flags: 'a'});


    var sqlConn = new sql.Connection(config.databaseConfiguration);
    sqlConn.connect();

    app.use(morgan('combined', {stream: accessLogStream}));

    router(app);
};