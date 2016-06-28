'use strict';
var express = require('express');
var router = express.Router();
var auth = require('./auth');
var conference = require('./conference');
var speech = require('./speech');
var user = require('./user');
var common = require('./common');
var image = require('./image');

router.get('/', common.apiInfo);


router.post('/signup', auth.register);
router.post('/login', auth.login);


router.get('/conferences', conference.getConferences);
router.get('/conferences/:id', conference.getInfo);
router.get('/conferences/:id/comments', conference.getComments);
router.post('/conferences/:id/comments', auth.checkAuth, conference.addComment);


router.post('/conferences/:id/attend', auth.checkAuth, conference.subscribe);
router.post('/conferences/:id/unattend', auth.checkAuth, conference.unsubscribe);


router.get('/speeches/:id', speech.getInfo);

router.get('/users/:id', user.getInfo);

router.get('/images/:id', image.getBinary);

router.use(common.notFoundError);
router.use(common.otherError);


module.exports = router;