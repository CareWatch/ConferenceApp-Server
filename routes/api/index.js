var express = require('express'),
    router = express.Router(),
    auth = require('./auth'),
    conference = require('./conference');

router.get('/', function(req, res, next) {
    res.send('api test');
});

router.post('/signup', auth.register);

router.post('/login', auth.login);

router.get('/conference', conference.getConferences);

module.exports = router;