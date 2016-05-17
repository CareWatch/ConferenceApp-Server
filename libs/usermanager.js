var db = require('./dbmanager');
var q = require('q');
var sql = require('mssql');

function getUserInfo(userId) {
    var deferred = q.defer();

    db.getConnection()
        .then(function (connection) {
            new connection.Request()
                .input('SelectedUserId', sql.Int, userId)
                .execute('GetUserInfo')
                .then(function (res) {
                    if (res[0].length === 0) {
                        deferred.reject(new TypeError('No user with such id found in database'));
                    } else {
                        deferred.resolve(res[0][0]);
                    }
                })
                .catch(function (err) {
                    deferred.reject(err);
                })
        })
        .fail(function (err) {
            deferred.reject(err);
        });

    return deferred.promise;
}

module.exports = {
    getUserInfo: getUserInfo
};