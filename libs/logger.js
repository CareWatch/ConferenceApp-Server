'use strict';
var winston = require('winston');
var config = require('../configuration');

winston.emitErrs = true;

function logger(module) {

    return new winston.Logger({
        transports : [
            new winston.transports.File({
                level: 'info',
                filename: config.loggerLogsPath,
                handleException: true,
                json: true,
                maxSize: 5242880,  
                maxFiles: 2,
                colorize: false
            }),
            new winston.transports.Console({
                level: 'debug',
                label: getFilePath(module),
                handleException: true,
                json: false,
                colorize: true
            })
        ],
        exitOnError: false
    });
}

function getFilePath (module ) {
    return module.filename.split('/').slice(-2).join('/');
}

module.exports = logger;