var express = require('express');
var router = express.Router();
var auth = require('./auth');
var conference = require('./conference');
var speech = require('./speech');
var common = require('./common');

router.get('/', function(req, res) {
    res.send('api test');
});


router.post('/signup', auth.register);
router.post('/login', auth.login);


router.get('/conferences', conference.getConferences);
router.get('/conferences/:id', conference.getConferenceInfo);
router.post('/conferences/:id/attend', auth.checkAuth, conference.subscribeConference);
router.post('/conferences/:id/unattend', auth.checkAuth, conference.unsubscribeConference);


router.get('/speeches/:id', speech.getSpeechInfo);


router.use(common.notFoundError);
router.use(common.otherError);


module.exports = router;