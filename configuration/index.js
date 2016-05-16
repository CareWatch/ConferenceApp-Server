var fs = require('fs'),
    config = {},
    appRoot = require('app-root-path');

config.port = 3000;
config.sslPort = 3001;

config.appRoot = appRoot;

config.accessLogsPath = appRoot + '/logs/access.log';
config.loggerLogsPath = appRoot + '/logs/app.log';
/*
config.sslCa = fs.readFileSync('/etc/ssl/keys/server.ca-bundle');
config.sslKey = fs.readFileSync('/etc/ssl/keys/server.key');
config.sslCert = fs.readFileSync('/etc/ssl/keys/server.crt');
config.sslPassphrase = '';
*/

config.dbString = 'mssql://bulgakov:4jiFE604336pKPxg2s5Q5772D3366mK@confappdb.ceml2u1mwzx0.eu-central-1.rds.amazonaws.com/ConferenceAppDB';
config.jwtSecret = 'hello';

module.exports = config;




