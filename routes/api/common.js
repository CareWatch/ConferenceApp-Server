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
        //log.info(err);
    } else {
        res.status(500).json({success: false, message: 'Internal server error.'});
        log.error(err);
    }
}


function createError(message, status) {
    var err = new Error(message);
    err.status = status;
    return err;
}


module.exports = {
    notFoundError: notFoundError,
    otherError: otherError,
    createError: createError
};