var speechmanager = require('../../libs/speechmanager');
var common = require('./common');

function getInfo(req, res, next) {
    if (isNaN(req.params.id)) {
        next(createError('Wrong conference id.', 400));
    } else {
        speechmanager.getSpeechInfo(req.params.id)
            .then(function (data) {
                res.json({success: true, message: 'Information about speech: ' + req.params.id, speech: data});
            })
            .fail(function (err) {
                if (err instanceof TypeError)
                {
                    next(common.createError('No speech found with id: ' + req.params.id, 400));
                } else {
                    next(err);
                }
            });
    }
}

function getComments(req, res, next) {
    if (isNaN(req.params.id)) {
        next(createError('Wrong conference id.', 400));
    } else {
        speechmanager.getSpeechComments(req.params.id)
            .then(function (data) {
                res.json({success: true, message: 'Comments for speech: ' + req.params.id, comments: data});
            })
            .fail(function (err) {
                if (err instanceof TypeError)
                {
                    next(common.createError('No speech found with id: ' + req.params.id, 400));
                } else {
                    next(err);
                }
            });
    }
}

module.exports = {
    getInfo: getInfo,
    getComments: getComments
};