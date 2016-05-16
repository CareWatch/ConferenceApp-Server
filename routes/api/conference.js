var confmanager = require('../../libs/conferencesmanager');

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
        next(createError('Wrong conference id.', 400));
    } else {
        confmanager.getConferenceInfo(req.params.id)
            .then(function (data) {
                res.json({success: true, message: data});
            })
            .fail(function (err) {
                if (err instanceof TypeError)
                {
                    next(createError('No conference found with id: ' + req.params.id, 400));
                } else {
                    next(err);
                }
            });
    }
}

function subscribeConference(req, res, next) {
    if (isNaN(req.params.id)) {
        next(createError('Wrong conference id. ' + req.params.id, 400));
    } else {
        confmanager.addConferenceAttender(req.body.UserId, req.params.id)
            .then(function () {
                res.status(200).json({success: true, message: 'Successfully added user to conference: ' + req.params.id});
            })
            .fail(function (err) {
                if (err.code === 'EREQUEST') {
                    next(createError('User info needs to be filled before applying any conference.' + req.params.id, 422));
                } else {
                    next(err);
                }
            })
    }
}

function unsubscribeConference(req, res, next)  {
    if (isNaN(req.params.id)) {
        next(createError('Wrong conference id. ' + req.params.id, 400));
    } else {
        confmanager.removeConferenceAttender(req.body.UserId, req.params.id)
            .then(function () {
                res.status(200).json({success: true, message: 'Successfully removed user from conference: '});
            })
            .fail(function (err) {
                if (err.code === 'EREQUEST') {
                    next(createError('User info needs to be filled before applying any conference.', 422));
                } else {
                    next(err);
                }
            })
    }
}

function createError(message, status) {
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
