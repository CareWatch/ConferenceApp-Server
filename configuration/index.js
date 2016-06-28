'use strict';
var fs = require('fs');
var appRoot = require('app-root-path');
var config = {};


config.port = 3001;

config.appRoot = appRoot;

config.accessLogsPath = appRoot + '/logs/access.log';
config.loggerLogsPath = appRoot + '/logs/app.log';

config.dbString = '';
config.jwtSecret = '';

config.mainImageId = 1;
config.extendedMainImageId = 2;
config.defaultUserImageId = 11;

module.exports = config;




