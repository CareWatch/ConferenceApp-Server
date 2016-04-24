var http = require('http');
var counter = 0;
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World!\nRequests count: ' + ++counter);
}).listen(3000, function()
{
    console.log('Server is online!');
});