var speechmanager = require('../../libs/speechmanager');
function getSpeechInfo(req, res, next) {
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

module.exports = {
    getSpeechInfo: getSpeechInfo
};