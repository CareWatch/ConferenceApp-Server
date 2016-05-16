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
                    var converted = convertSingleSpeechRecords(res);
                    if (converted === null) {
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

function convertSingleSpeechRecords(records) {
    if (records[0].length !== 1){
        return null;
    }
    var presenter = {};
    presenter.id = records[0][0].presenter_id;
    presenter.first_name = records[0][0].presenter_firstname;
    presenter.last_name = records[0][0].presenter_lastname;
    delete records[0][0].presenter_id;
    delete records[0][0].presenter_firstname;
    delete records[0][0].presenter_lastname;
    records[0][0].presenter = presenter;
    return records[0][0];
}


module.exports = {
    getSpeechInfo: getSpeechInfo
};