var fs = require('fs');

var config = {};

config.port = 3001;
config.sslPort = 443;

var sslOptions = {
    ca: fs.readFileSync('/etc/ssl/keys/server.ca-bundle'),
    key: fs.readFileSync('/etc/ssl/keys/server.key'),
    cert: fs.readFileSync('/etc/ssl/keys/server.crt'),
    passphrase: process.env.PH_KEY || ''
};

config.sslOptions = sslOptions;

module.exports = config;




