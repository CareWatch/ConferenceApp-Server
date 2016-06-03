var fs = require('fs');
var appRoot = require('app-root-path');
var config = {};


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

config.dbString = 'mssql://bulgakov:spgxq078l1T1SAsluCBP76Rk6d4dt1347Q803j2Z28VosMi2uF@appdbhost.ceml2u1mwzx0.eu-central-1.rds.amazonaws.com/ConferenceAppDB';
config.jwtSecret = '';

config.mainImageId = 1;
config.extendedMainImageId = 2;

module.exports = config;




