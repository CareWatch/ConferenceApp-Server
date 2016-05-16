var confmanager = require('../../libs/conferencesmanager');
var jwt = require('jsonwebtoken');
var config = require('../../configuration');

function getConferences (req, res, next) {
    confmanager.getConferences()
        .then(function (data) {
            res.json({success: true, message: data[0]});
        })
        .fail(function (err) {
            next(err);
        });
}

function getConferenceInfo(req, res, next) {
    if (isNaN(req.params.id)) {
        next(CreateError('Wrong conference id.', 400));
    } else {
        confmanager.getConferenceInfo(req.params.id)
            .then(function (data) {
                res.json({success: true, message: data});
            })
            .fail(function (err) {
                if (err instanceof TypeError)
                {
                    next(CreateError('No conference found with id: ' + req.params.id, 400));
                } else {
                    next(err);
                }
            });
    }
}

function subscribeConference(req, res, next) {
    var token =  req.body.token || req.headers['x-access-token'];
    if (isNaN(req.params.id)) {
        next(CreateError('Wrong conference id. ' + req.params.id, 400));
    } else {
        if (token)
        {
            jwt.verify(token, config.jwtSecret, function (err, decodedUserId) {
                if (err) {
                    next(CreateError('User authentication failed. Provide valid authtoken.' + req.params.id, 401));
                } else {
                    confmanager.addConferenceAttender(decodedUserId, req.params.id)
                        .then(function () {
                            res.status(200).json({success: true, message: 'Successfully added user to conference: ' + req.params.id});
                        })
                        .fail(function (err) {
                            if (err.code === 'EREQUEST') {
                                next(CreateError('User info needs to be filled before applying any conference.' + req.params.id, 422));
                            } else {
                                next(err);
                            }
                        })
                }
            })
        } else {
            next(CreateError('User authtoken is required.', 403));
        }
    }
}

function unsubscribeConference(req, res, next)  {
    var token =  req.body.token || req.headers['x-access-token'];
    if (isNaN(req.params.id)) {
        next(CreateError('Wrong conference id. ' + req.params.id, 400));
    } else {
        if (token)
        {
            jwt.verify(token, config.jwtSecret, function (err, decodedUserId) {
                if (err) {
                    next(CreateError('User authentication failed. Provide valid authtoken.' + req.params.id, 401));
                } else {
                    confmanager.removeConferenceAttender(decodedUserId, req.params.id)
                        .then(function () {
                            res.status(200).json({success: true, message: 'Successfully removed user from conference: ' + req.params.id});
                        })
                        .fail(function (err) {
                            if (err.code === 'EREQUEST') {
                                next(CreateError('User info needs to be filled before applying any conference.' + req.params.id, 422));
                            } else {
                                next(err);
                            }
                        })
                }
            })
        } else {
            next(CreateError('User authtoken is required.', 403));
        }
    }
}

function CreateError(message, status) {
    var err = new Error(message);
    err.status = status;
    return err;
}

module.exports = {
    getConferences: getConferences,
    getConferenceInfo: getConferenceInfo,
    subscribeConference: subscribeConference,
    unsubscribeConference: unsubscribeConference
};
