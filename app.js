var fs = require('fs');
var express = require('express');
var https = require('https');
var http = require('http');
var path = require('path');
var config = require('./config');
var app = express();

https.createServer(config.sslOptions, app).listen(config.sslPort);

http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(config.port);


var counter = 0;
app.get('/', function (req, res) {
    res.send('Hello, World! <br> Requests count: ' + ++counter);
})


app.get('/api', function (req, res) {
    res.send('API is running');
});

app.use(function (req, res) {
    res.status(404).send("Page Not Found");
})

