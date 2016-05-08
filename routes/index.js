module.exports = function (app) {
    var counter = 0;
    var apiPath = '/api';

    app.get(apiPath + '/test', function (req, res) {
        res.send('Hello, World! <br> Requests count: ' + ++counter);
    });

    app.get(apiPath + '/hello', function (req, res) {
        res.send('API is running');
    });

    app.use(function (req, res) {
        res.status(404).send("Page Not Found");
    });
};