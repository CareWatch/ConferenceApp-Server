'use strict';
var db = require('./dbmanager');
var q = require('q');
var sql = require('mssql');

function getSpeechInfo(speechId) {
    var deferred = q.defer();

    db.getConnection()
        .then(function (connection) {
            new connection.Request()
                .input('SelectedSpeechId', sql.Int, speechId)
                .execute('GetSpeechInfo')
                .then(function (res) {
                    var converted = convertRecords(res)[0];
                    if (!converted) {
                        deferred.reject(new TypeError('No speech with such id found in database'));
                    } else {
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

module.exports = {
    getSpeechInfo: getSpeechInfo
};