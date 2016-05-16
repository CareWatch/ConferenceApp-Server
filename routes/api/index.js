var express = require('express'),
    router = express.Router(),
    auth = require('./auth'),
    conference = require('./conference'),
    log = require('../../libs/logger')(module);

router.get('/', function(req, res) {
    res.send('api test');
});

router.post('/signup', auth.register);

router.post('/login', auth.login);


router.get('/conferences', conference.getConferences);

router.get('/conferences/:id', conference.getConferenceInfo);

router.post('/conferences/:id/attend', conference.subscribeConference);

router.post('/conferences/:id/unattend', conference.unsubscribeConference);


router.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


router.use(function(err, req, res, next) {
    if (err.status)
    {
        res.status(err.status).json({success: false, message: err.message});
        //log.info(err);
    } else {
        res.status(500).json({success: false, message: 'Internal server error.'});
        log.error(err);
    }
});


module.exports = router;