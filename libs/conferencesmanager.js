var db = require('./dbmanager'),
    q = require('q'),
    log = require('./logger')(module),
    sql = require('mssql');

function getConferences() {
    var deferred = q.defer();

    db.getConnection()
        .then(function (connection) {
            new connection.Request()
                .input('SelectedPhotoTypeId', sql.Int, 1)
                .execute('GetAllConferences')
                .then(function (res) {
                    deferred.resolve(res);
                })
        })
        .fail(function (err) {
            log.error(err);
            deferred.reject(err);
        });

    return deferred.promise;
}


module.exports = {
    getConferences : getConferences
};