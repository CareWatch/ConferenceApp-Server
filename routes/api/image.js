var usermanager = require('../../libs/imagemanager');
var common = require('./common');

function getBinary(req, res, next) {
    if (isNaN(req.params.id)) {
        next(common.createError('Wrong image id.', 400));
    } else {
        usermanager.getImage(req.params.id)
            .then(function (data) {
                res.writeHead(200, {
                    'Content-Type': 'image/jpg',
                    'Content-disposition': 'attachment;filename=' + 'image_' + req.params.id + '.jpg',
                    'Content-Length': data.length
                });
                res.end(new Buffer(data, 'binary'));
            })
            .fail(function (err) {
                if (err instanceof TypeError)
                {
                    next(common.createError('No image found with id: ' + req.params.id, 400));
                } else {
                    next(err);
                }
            });
    }
}


module.exports = {
    getBinary: getBinary
};