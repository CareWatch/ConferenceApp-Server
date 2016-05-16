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

function getSpeechComments(speechId) {
    var deferred = q.defer();

    db.getConnection()
        .then(function (connection) {
            new connection.Request()
                .input('SelectedSpeechId', sql.Int, speechId)
                .execute('getSpeechComments')
                .then(function (res) {
                    var converted = convertRecords(res);
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


function convertRecords(records) {
    if (records[0].length === 0){
        return null;
    }

    for (var i in records[0]) {
        var author = {};
        author.id = records[0][i].author_id;
        author.first_name = records[0][i].author_firstname;
        author.last_name = records[0][i].author_lastname;
        author.photo_id = records[0][i].author_photoid;
        delete records[0][i].author_id;
        delete records[0][i].author_firstname;
        delete records[0][i].author_lastname;
        delete records[0][i].author_photoid;
        records[0][i].author = author;
    }
    return records[0];
}


module.exports = {
    getSpeechInfo: getSpeechInfo,
    getSpeechComments: getSpeechComments
};