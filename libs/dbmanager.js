var sql = require('mssql'),
    q = require('q'),
    config = require('../configuration'),
    log = require('./logger')(module);

function getConnection() {
    var deferred = q.defer();
    sql.connect(config.dbString, function (err) {
        if (err) {
            log.error(err);
            deferred.reject(err);
        }
        deferred.resolve(sql);
    });
    return deferred.promise;
}

module.exports = {
    getConnection : getConnection
};