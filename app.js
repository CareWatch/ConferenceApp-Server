'use strict';

var express = require('express'),
    https = require('https'),
    http = require('http'),
    config = require('./configuration'),
    app = express(),
    middleware = require('./middleware')(app);

/*
 https.createServer(config.sslConfiguration, app).listen(config.sslPort), function () {
    console.log('Server is online and running!');
};

http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(config.port);
 */

http.createServer(app).listen(config.port);



