var authmanager = require('../../libs/authmanager'),
    bcrypt = require('bcrypt'),
    log = require('../../libs/logger')(module),
    config = require('../../configuration'),
    jwt = require('jsonwebtoken');

function register (req, res, next){
    if (!req.body.username || !req.body.password) {
        res.status(400).json({success: false, message: 'User login and password are required.'});
    } else {
        var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
        authmanager.addUser(req.body.username, hash)
            .then(function () {
                res.status(201).json({success: true, message: 'User registration is completed.'});
            })
            .fail(function (err) {
                if (err.code === 'EREQUEST') {
                    res.status(422).json({success: false, message: 'Username is already taken.'});
                } else {
                    res.status(500).json({success: false, message: 'Internal server error.'});
                    log(err);
                }
            })
    }
}

function login (req, res, next) {
    if (!req.body.username || !req.body.password) {
        res.status(400).json({success: false, message: 'User login and password are required.'});
    } else {
        authmanager.getPassHash(req.body.username)
            .then(function (data) {
                if (bcrypt.compareSync(req.body.password, data[0].PasswordHash))
                {
                    var usertoken = jwt.sign(data[0].UserId, config.jwtSecret);
                    res.status(201).json({success: true, message: 'Logged into account: ' + req.body.username, token: usertoken});
                } else {
                    res.status(403).json({success: false, message: 'Wrong password for user: ' + req.body.username});
                }
            })
            .fail(function (err) {
                if (err instanceof TypeError)
                {
                    res.status(403).json({success: false, message: 'No user found with username: ' + req.body.username});
                } else {
                    console.log(err);
                    res.status(500).json({success: false, message: 'Internal server error.'});
                    log.error(err);   
                }
            })
    }
}

module.exports = {
    register : register,
    login : login
};

