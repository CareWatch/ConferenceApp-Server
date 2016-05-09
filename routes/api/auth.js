var authmanager = require('../../libs/authmanager'),
    bcrypt = require('bcrypt'),
    log = require('../../libs/logger')(module);

function register (req, res, next){
    if (!req.body.name || !req.body.password) {
        res.status(400).json({success: false, message: 'User login and password are required.'});
    } else {
        var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
        authmanager.addUser(req.body.name, hash)
            .then(function () {
                res.status(201).json({success: true, message: 'User registration is completed.'});
            })
            .fail(function (err) {
                if (err.code !== 'EREQUEST') {
                    res.status(500).json({success: false, message: 'Internal server error.'});
                } else {
                    res.status(422).json({success: false, message: 'Username is already taken.'});
                }
            })
    }

}




module.exports = {
    register : register
};

