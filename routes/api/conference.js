var confmanager = require('../../libs/conferencesmanager'),
    log = require('../../libs/logger')(module),
    jwt = require('jsonwebtoken'),
    config = require('../../configuration');

function getConferences (req, res, next) {
    confmanager.getConferences()
        .then(function (data) {
            res.json({success: true, message: data[0]});
        })
        .fail(function (err) {
            res.status(500).json({success: false, message: 'Internal server error.'});
            log.error(err);
        });
}

function getConferenceInfo(req, res, next) {
    if (isNaN(req.params.id)) {
        res.status(400).json({success: false, message: 'Wrong conference id.'});
    } else {
        confmanager.getConferenceInfo(req.params.id)
            .then(function (data) {
                res.json({success: true, message: data});
            })
            .fail(function (err) {
                if (err instanceof TypeError)
                {
                    res.status(400).json({success: false, message: 'No conference found with id: ' + req.params.id});
                } else {
                    res.status(500).json({success: false, message: 'Internal server error.'});
                }
                log.error(err);
            });
    }
}

function subscribeConference(req, res, next) {
    var token =  req.body.token || req.headers['x-access-token'];
    if (isNaN(req.params.id)) {
        res.status(400).json({success: false, message: 'Wrong conference id.'});
    } else {
        if (token)
        {
            jwt.verify(token, config.jwtSecret, function (err, decodedUserId) {
                if (err) {
                    res.status(403).json({success: false, message: 'User authentication failed. Provide valid authtoken.'});
                } else {
                    confmanager.addConferenceAttender(decodedUserId, req.params.id)
                        .then(function () {
                            res.status(200).json({success: true, message: 'Successfully added user to conference: ' + req.params.id});
                        })
                        .fail(function (err) {
                            if (err.code === 'EREQUEST') {
                                res.status(422).json({success: false, message: 'User info needs to be filled before applying any conference.'});
                            } else {
                                res.status(500).json({success: false, message: 'Internal server error.'});
                                log(err);
                            }
                        })
                }
            })
        } else {
            res.status(403).json({success: false, message: 'User authtoken is required.'});
        }
    }
}

function unsubscribeConference(req, res, next)  {
    var token =  req.body.token || req.headers['x-access-token'];
    if (isNaN(req.params.id)) {
        res.status(400).json({success: false, message: 'Wrong conference id.'});
    } else {
        if (token)
        {
            jwt.verify(token, config.jwtSecret, function (err, decodedUserId) {
                if (err) {
                    res.status(403).json({success: false, message: 'User authentication failed. Provide valid authtoken.'});
                } else {
                    confmanager.removeConferenceAttender(decodedUserId, req.params.id)
                        .then(function () {
                            res.status(200).json({success: true, message: 'Successfully removed user from conference: ' + req.params.id});
                        })
                        .fail(function (err) {
                            if (err.code === 'EREQUEST') {
                                res.status(422).json({success: false, message: 'User info needs to be filled before applying any conference.'});
                            } else {
                                res.status(500).json({success: false, message: 'Internal server error.'});
                                log(err);
                            }
                        })
                }
            })
        } else {
            res.status(403).json({success: false, message: 'User authtoken is required.'});
        }
    }
}

module.exports = {
    getConferences: getConferences,
    getConferenceInfo: getConferenceInfo,
    subscribeConference: subscribeConference,
    unsubscribeConference: unsubscribeConference
};
