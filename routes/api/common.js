var log = require('../../libs/logger')(module);

function notFoundError(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
}

function otherError(err, req, res, next) {
    if (err.status)
    {
        res.status(err.status).json({success: false, message: err.message});
    } else {
        res.status(500).json({success: false, message: 'Internal server error.'});
        log.error(err);
    }
}


function apiInfo(req, res, next) {
    var responseMessage =  'Welcome to myconf.guru api.\nSupported methods are:\n/singup - user registration\n' +
        '/login - login for registred users\n/conferences - list of all scheduled conferences/n' +
        '/conferences/id - info about selected conference\n/speeches/id - info about selected speech' +
        '\n/speeches/id/comments = comments for a selected speech\n/user/id - info about selected user' +
        '\n/image/id - get image from database';
    res.json({success: true, message: responseMessage});
}

function createError(message, status) {
    var err = new Error(message);
    err.status = status;
    return err;
}


module.exports = {
    notFoundError: notFoundError,
    otherError: otherError,
    createError: createError,
    apiInfo: apiInfo
};