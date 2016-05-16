var express = require('express');
var router = express.Router();
var auth = require('./auth');
var conference = require('./conference');
var speech = require('./speech');
var common = require('./common');

router.get('/', common.apiInfo);


router.post('/signup', auth.register);
router.post('/login', auth.login);


router.get('/conferences', conference.getConferences);
router.get('/conferences/:id', conference.getInfo);
router.post('/conferences/:id/attend', auth.checkAuth, conference.subscribe);
router.post('/conferences/:id/unattend', auth.checkAuth, conference.unsubscribe);


router.get('/speeches/:id', speech.getInfo);
//router.get('/speeches/:id/comments', speech.ge);

router.use(common.notFoundError);
router.use(common.otherError);


module.exports = router;