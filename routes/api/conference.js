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

module.exports = {
    getConferences : getConferences
};
