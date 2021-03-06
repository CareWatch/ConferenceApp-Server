'use strict';
var confmanager = require('../../libs/conferencemanager');
var common = require('./common');
var log = require('../../libs/logger')(module);

function getConferences (req, res, next) {
    confmanager.getConferences()
        .then(function (data) {
            res.json({success: true, message: 'Scheduled conference list.', conferences: data});
        })
        .fail(function (err) {
            next(err);
        });
}

function getInfo(req, res, next) {
    if (isNaN(req.params.id)) {
        next(common.createError('Wrong conference id.', 400));
    } else {
        confmanager.getConferenceInfo(req.params.id)
            .then(function (data) {
                res.json({success: true, message: 'Info about conference: ' + req.params.id, conference: data});
            })
            .fail(function (err) {
                if (err instanceof TypeError)
                {
                    next(common.createError('No conference found with id: ' + req.params.id, 400));
                } else {
                    next(err);
                }
            });
    }
}

function subscribe(req, res, next) {
    if (isNaN(req.params.id)) {
        next(common.createError('Wrong conference id. ' + req.params.id, 400));
    } else {
        confmanager.addConferenceAttender(req.body.userId, req.params.id)
            .then(function () {
                res.status(200).json({success: true, message: 'Successfully added user to conference: ' + req.params.id});
            })
            .fail(function (err) {
                if (err instanceof TypeError)
                {
                    next(common.createError('User info needs to be filled before applying any conference.', 422));
                } else {
                    next(err);
                }
            })
    }
}

function unsubscribe(req, res, next)  {
    if (isNaN(req.params.id)) {
        next(common.createError('Wrong conference id. ' + req.params.id, 400));
    } else {
        confmanager.removeConferenceAttender(req.body.userId, req.params.id)
            .then(function () {
                res.status(200).json({success: true, message: 'Successfully removed user from conference: '});
            })
            .fail(function (err) {
                if (err instanceof TypeError)
                {
                    next(common.createError('User info needs to be filled before applying any conference.', 422));
                } else {
                    next(err);
                }
            })
    }
}

function getComments(req, res, next) {
    if (isNaN(req.params.id)) {
        next(common.createError('Wrong conference id.', 400));
    } else {
        confmanager.getConferenceComments(req.params.id)
            .then(function (data) {
                res.json({success: true, message: 'Comments for conference: ' + req.params.id, comments: data});
            })
            .fail(function (err) {
                if (err instanceof TypeError)
                {
                    next(common.createError('No conference found with id: ' + req.params.id, 400));
                } else {
                    next(err);
                }
            });
    }
}

function addComment(req, res, next) {
    if (isNaN(req.params.id) || !req.body.text) {
        next(common.createError('Wrong input data.', 400));
    } else {
        confmanager.addConferenceComment(req.params.id, req.body.userId, req.body.text)
            .then(function () {
                res.json({success: true, message: 'Successfully added comment.'});
            })
            .fail(function (err) {
                if (err instanceof TypeError)
                {
                    next(common.createError('No conference found with id: ' + req.params.id, 400));
                } else {
                    next(err);
                }
            });
    }
}


module.exports = {
    getConferences: getConferences,
    getInfo: getInfo,
    subscribe: subscribe,
    unsubscribe: unsubscribe,
    getComments: getComments,
    addComment: addComment
};
