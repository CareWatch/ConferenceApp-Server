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


function addSpeechComment(speechId, authorId, text) {
    var deferred = q.defer();

    db.getConnection()
        .then(function (connection) {
            var request = new connection.Request();
            var time = new Date();
            time.setHours(time.getHours() + 3);

            request.input('SelectedSpeechId', sql.Int, speechId);
            request.input('CommentAuthorId', sql.Int, authorId);
            request.input('CommentTime', sql.DateTime, time);
            request.input('CommentText', sql.NVarChar, text);
            request.execute('AddSpeechComment')
                .then(function (res) {
                    deferred.resolve(res);
                })
                .catch(function (err) {
                    if (err.code === 'EREQUEST')
                    {
                        deferred.reject(new TypeError('No speech with such id found in database'));
                    }
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