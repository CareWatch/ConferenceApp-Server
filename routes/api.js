var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send('api test');
});

router.post('/signup', function(req, res, next) {
    if (!req.body.name || !req.body.password) {
        res.statusCode = 400;
        res.json({success: false, msg: 'Please pass name and password.'});
    }
    else {
        res.json({success: true, msg: 'OK!'});
    }
});

module.exports = router;
