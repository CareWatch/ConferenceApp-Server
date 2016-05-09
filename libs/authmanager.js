var db = require('./dbmanager'),
    q = require('q'),
    log = require('./logger')(module);

function addUser(name, passwordHash) {
    var deferred = q.defer();

    db.getConnection()
        .then(function (connection) {
            var request = new connection.Request();
            var command = "INSERT INTO UserCredentials(Login, PasswordHash) VALUES ('" + name + "', '" + passwordHash + "')";
            request.query(command, function (err, res) {
               if (err) {
                   log.error(err.code);
                   deferred.reject(err);
               }
                deferred.resolve(res);
            });
        })
        .fail(function (err) {
            log.error(err);
            deferred.reject(err);
        });

    return deferred.promise;
}

module.exports = {
    addUser: addUser
};