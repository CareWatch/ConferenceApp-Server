var db = require('./dbmanager');
var q = require('q');
var sql = require('mssql');

function getSpeechInfo(speechId) {
    var deferred = q.defer();

    db.getConnection()
        .then(function (connection) {
            new connection.Request()
                .input('SelectedConferenceId', sql.Int, conferenceId)
                .input('FilterPhotoTypeId', sql.Int, 1)
                .execute('GetConferenceInfo')
                .then(function (res) {
                    var converted = convertRecords(res);
                    if (converted === null) {
                        deferred.reject(new TypeError('No conference with such id found in database'));
                    }
                    else {
                        deferred.resolve(converted);
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