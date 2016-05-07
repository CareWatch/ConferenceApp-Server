'use strict';

var express = require('express'),
    https = require('https'),
    http = require('http'),
    config = require('./config'),
    app = express();

https.createServer(config.sslOptions, app).listen(config.sslPort), function () {
    console.log('Server is online and running!');
};

http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(config.port);

var counter = 0;

app.get('/', function (req, res) {
    res.send('Hello, World! <br> Requests count: ' + ++counter);
});

app.get('/api', function (req, res) {
    res.send('API is running');
});

app.use(function (req, res) {
    res.status(404).send("Page Not Found");
});

