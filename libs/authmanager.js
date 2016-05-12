var db = require('./dbmanager'),
    q = require('q'),
    log = require('./logger')(module);

function addUser(username, passwordHash) {
    var deferred = q.defer();

    db.getConnection()
        .then(function (connection) {
            var request = new connection.Request();
            var command = "INSERT INTO UserCredentials(Login, PasswordHash) VALUES ('" + username + "', '" + passwordHash + "')";
            request.query(command, function (err, res) {
               if (err) {
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

function getPassHash(username) {
    var deferred = q.defer();

    db.getConnection()
        .then(function (connection) {
            var request = new connection.Request();
            var command = "SELECT PasswordHash, UserId FROM UserCredentials WHERE Login = '" + username + "'";
            request.query(command, function (err, res) {
                if (err) {
                    deferred.reject(err);
                }
                if (res.length === 1) {
                    deferred.resolve(res);
                }
                else {
                    deferred.reject(new TypeError('No user found in database'));
                }
            });
        })
        .fail(function (err) {
            log.error(err);
            deferred.reject(err);
        });

    return deferred.promise;
}


module.exports = {
    addUser: addUser,
    getPassHash : getPassHash
};