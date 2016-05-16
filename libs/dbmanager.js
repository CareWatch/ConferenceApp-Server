var sql = require('mssql'),
    q = require('q'),
    config = require('../configuration');

function getConnection() {
    var deferred = q.defer();
    sql.connect(config.dbString, function (err) {
        if (err) {
            deferred.reject(err);
        }
        deferred.resolve(sql);
    });
    return deferred.promise;
}

module.exports = {
    getConnection : getConnection
};