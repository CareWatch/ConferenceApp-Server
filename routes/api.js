var express = require('express'),
    router = express.Router(),
    authmanager = require('../libs/authmanager');

router.get('/', function(req, res, next) {
    res.send('api test');
});

router.post('/signup', function(req, res, next) {
    if (!req.body.name || !req.body.password) {
        res.status(400).json({success: false, message: 'User login and password are required.'});
    }
    else {
        authmanager.addUser(req.body.name, req.body.password)
            .then(function(){
                res.status(201).json({success: true, message: 'User registration is completed.'});
            })
            .fail(function(err){
                //res.status(500).json({success: false, msg: 'Internal server error.'});
                if (err.code === 'EREQUEST') {
                    res.status(422).json({success: false, message: 'Username is already taken.'});
                } else {
                    res.status(500).json({success: false, message: 'Internal server error.'});
                }
        });
    }
});

module.exports = router;
