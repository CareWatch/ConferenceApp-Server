var authmanager = require('../../libs/authmanager');
var bcrypt = require('bcrypt');
var config = require('../../configuration');
var jwt = require('jsonwebtoken');
var common = require('./common');

function register (req, res, next){
    if (!req.body.username || !req.body.password) {
        next(common.createError('User login and password are required.', 401));
    } else {
        var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
        authmanager.addUser(req.body.username, hash)
            .then(function () {
                res.status(201).json({success: true, message: 'User registration is completed.'});
            })
            .fail(function (err) {
                if (err.code === 'EREQUEST') {
                    next(common.createError('Username is already taken.', 422));
                } else {
                    next(err);
                }
            })
    }
}

function login (req, res, next) {
    if (!req.body.username || !req.body.password) {
        next(common.createError('User login and password are required.', 401));
    } else {
        authmanager.getPassHash(req.body.username)
            .then(function (data) {
                if (bcrypt.compareSync(req.body.password, data[0].PasswordHash))
                {
                    var usertoken = jwt.sign(data[0].UserId, config.jwtSecret);
                    res.status(201).json({success: true, message: 'Logged into account: ' + req.body.username, token: usertoken});
                } else {
                    next(common.createError('Wrong password for user: ' + req.body.username, 401));
                }
            })
            .fail(function (err) {
                if (err instanceof TypeError)
                {
                    next(common.createError('No user found with username: ' + req.body.username, 401));
                } else {
                    next(err);
                }
            })
    }
}

function chechAuth (req, res, next) {
    var token =  req.body.token || req.query.token || req.headers['x-access-token'];
    if (token)
    {
        jwt.verify(token, config.jwtSecret, function (err, decodedUserId) {
            if (err) {
                next(common.createError('User authentication failed. Provide valid authtoken.', 401));
            } else {
                req.body.userId = decodedUserId;
                next();
            }
        })
    } else {
        next(common.createError('User authtoken is required.', 403));
    }
}


module.exports = {
    register: register,
    login: login,
    checkAuth: chechAuth
};

