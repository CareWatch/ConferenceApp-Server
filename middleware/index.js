module.exports = function (app) {
    var fs = require('fs'),
        router = require('../routes'),
        morgan = require('morgan');

    var accessLogStream = fs.createWriteStream('logs' + '/app.log', {flags: 'a'});

    app.use(morgan('combined', {stream: accessLogStream}));
    //app.use('/api', router);
    router(app);
};