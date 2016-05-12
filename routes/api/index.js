var express = require('express'),
    router = express.Router(),
    auth = require('./auth');

router.get('/', function(req, res, next) {
    res.send('api test');
});

router.post('/signup', auth.register);

router.post('/login', auth.login);

module.exports = router;