var express = require('express');
var path = require('path');
var app = express();

var counter = 0;
app.get('/', function (req, res) {
    res.send('Requests count: ' + ++counter);
})


app.get('/api', function (req, res) {
    res.send('API is running');
});

app.use(function (req, res) {
    res.status(404).send("Page Not Found");
})


app.listen(3000, function(){
    console.log('Express server listening on port 3000');
});