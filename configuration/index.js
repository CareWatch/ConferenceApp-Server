var fs = require('fs');

var config = {};

config.port = 3000;
config.sslPort = 3001;

config.logPath = '../logs/app.log';

/*
 var sslConfiguration = {
 ca: fs.readFileSync('/etc/ssl/keys/server.ca-bundle'),
 key: fs.readFileSync('/etc/ssl/keys/server.key'),
 cert: fs.readFileSync('/etc/ssl/keys/server.crt'),
 passphrase: process.env.PH_KEY || ''
 };

 config.sslOptions = sslConfiguration;
*/

config.dbString = '';
module.exports = config;




