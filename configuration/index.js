var fs = require('fs');

var config = {};

config.port = 3000;
config.sslPort = 3001;
/*
 var sslConfiguration = {
 ca: fs.readFileSync('/etc/ssl/keys/server.ca-bundle'),
 key: fs.readFileSync('/etc/ssl/keys/server.key'),
 cert: fs.readFileSync('/etc/ssl/keys/server.crt'),
 passphrase: process.env.PH_KEY || ''
 };

 config.sslOptions = sslConfiguration;
 */

var databaseConfiguration = {
    userName: '',
    password: '',
    server: '',
    database: 'ConferenceAppDB',
    port: 1433
}

config.databaseConfiguration = databaseConfiguration;

module.exports = config;




