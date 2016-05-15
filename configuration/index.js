var fs = require('fs'),
    config = {},
    appRoot = require('app-root-path');

config.port = 3000;
config.sslPort = 3001;

config.logPath = appRoot + '/logs/access.log';

config.sslCa = fs.readFileSync('/etc/ssl/keys/server.ca-bundle');
config.sslKey = fs.readFileSync('/etc/ssl/keys/server.key');
config.sslCert = fs.readFileSync('/etc/ssl/keys/server.crt');
config.sslPassphrase = '';

config.dbString = '';
config.jwtSecret = '';

module.exports = config;




