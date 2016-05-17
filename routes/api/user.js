var usermanager = require('../../libs/usermanager');
var common = require('./common');

function getInfo(req, res, next) {
    if (isNaN(req.params.id)) {
        next(common.createError('Wrong user id.', 400));
    } else {
        usermanager.getUserInfo(req.params.id)
            .then(function (data) {
                res.json({success: true, message: 'Information about user id: ' + req.params.id, user: data});
            })
            .fail(function (err) {
                if (err instanceof TypeError)
                {
                    next(common.createError('No user found with id: ' + req.params.id, 400));
                } else {
                    next(err);
                }
            });
    }
}


module.exports = {
    getInfo: getInfo
};