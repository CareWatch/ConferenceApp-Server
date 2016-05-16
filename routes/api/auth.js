var authmanager = require('../../libs/authmanager'),
    bcrypt = require('bcrypt'),
    config = require('../../configuration'),
    jwt = require('jsonwebtoken');

function register (req, res, next){
    if (!req.body.username || !req.body.password) {
        next(CreateError('User login and password are required.', 401));
    } else {
        var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
        authmanager.addUser(req.body.username, hash)
            .then(function () {
                res.status(201).json({success: true, message: 'User registration is completed.'});
            })
            .fail(function (err) {
                if (err.code === 'EREQUEST') {
                    next(CreateError('Username is already taken.', 422));
                } else {
                    next(err);
                }
            })
    }
}

function login (req, res, next) {
    if (!req.body.username || !req.body.password) {
        next(CreateError('User login and password are required.', 401));
    } else {
        authmanager.getPassHash(req.body.username)
            .then(function (data) {
                if (bcrypt.compareSync(req.body.password, data[0].PasswordHash))
                {
                    var usertoken = jwt.sign(data[0].UserId, config.jwtSecret);
                    res.status(201).json({success: true, message: 'Logged into account: ' + req.body.username, token: usertoken});
                } else {
                    next(CreateError('Wrong password for user: ' + req.body.username, 401));
                }
            })
            .fail(function (err) {
                if (err instanceof TypeError)
                {
                    next(CreateError('No user found with username: ' + req.body.username, 401));
                } else {
                    next(err);
                }
            })
    }
}

function CreateError(message, status) {
    var err = new Error(message);
    err.status = status;
    return err;
}

module.exports = {
    register : register,
    login : login
};

