var express = require('express'),
    router = express.Router(),
    auth = require('./auth'),
    conference = require('./conference');

router.get('/', function(req, res, next) {
    res.send('api test');
});

router.post('/signup', auth.register);

router.post('/login', auth.login);


router.get('/conferences', conference.getConferences);

router.get('/conferences/:id', conference.getConferenceInfo);

router.post('/conferences/:id/attend', conference.subscribeConference);


module.exports = router;