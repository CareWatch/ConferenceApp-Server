var confmanager = require('../../libs/conferencesmanager'),
    log = require('../../libs/logger')(module);
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
                    res.status(403).json({success: false, message: 'No conference found with id: ' + req.params.id});
                } else {
                    res.status(500).json({success: false, message: 'Internal server error.'});
                }
                log.error(err);
            });
    }
}

module.exports = {
    getConferences : getConferences,
    getConferenceInfo : getConferenceInfo
};
