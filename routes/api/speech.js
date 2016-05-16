var speechmanager = require('../../libs/speechmanager');
var common = require('./common');

function getSpeechInfo(req, res, next) {
    if (isNaN(req.params.id)) {
        next(createError('Wrong conference id.', 400));
    } else {
        speechmanager.getSpeechInfo(req.params.id)
            .then(function (data) {
                res.json({success: true, message: data});
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
    getSpeechInfo: getSpeechInfo
};