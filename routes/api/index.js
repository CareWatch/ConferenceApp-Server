var express = require('express'),
    router = express.Router(),
    auth = require('./auth');

router.get('/', function(req, res, next) {
    res.send('api test');
});

router.post('/signup', function (req, res, next) {
    auth.register(req, res, next);
});

module.exports = router;