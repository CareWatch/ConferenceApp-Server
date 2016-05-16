var db = require('./dbmanager');
var q = require('q');
var sql = require('mssql');

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
                .catch(function (err) {
                    deferred.reject(err);
                })
        })
        .fail(function (err) {
            deferred.reject(err);
        });

    return deferred.promise;
}

function getConferenceInfo(conferenceId) {
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

function addConferenceAttender(userId, conferenceId) {
    var deferred = q.defer();

    db.getConnection()
        .then(function (connection) {
            new connection.Request()
                .input('SelectedConferenceId', sql.Int, conferenceId)
                .input('SelectedUserId', sql.Int, userId)
                .input('SelectedUserRoleId', sql.Int, 1)
                .execute('AddConferenceAttender')
                .then(function (records) {
                    deferred.resolve(records);
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


function removeConferenceAttender(userId, conferenceId) {
    var deferred = q.defer();

    db.getConnection()
        .then(function (connection) {
            new connection.Request()
                .input('SelectedConferenceId', sql.Int, conferenceId)
                .input('SelectedUserId', sql.Int, userId)
                .execute('RemoveConferenceAttender')
                .then(function (records) {
                    deferred.resolve(records);
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
    var conference = {};

    if (records[0].length === 0) {
        return null;
    }

    conference.conferenceId = records[0][0].ConferenceId;
    conference.title = records[0][0].Title;
    conference.status_description = records[0][0].StatusDescription;
    conference.description = records[0][0].Description;
    conference.city_name = records[0][0].CityName;
    conference.address = records[0][0].Address;
    conference.start_date = records[0][0].StartDate;
    conference.end_date = records[0][0].EndDate;
    conference.photos = [];
    conference.scheduled_speeches = [];
    var tmp = [];
    for (var i in records[0]) {
        if (conference.photos.indexOf(records[0][i].ConferencePhotoId) === -1 && records[0][i].ConferencePhotoId != null) {
            conference.photos.push(records[0][i].ConferencePhotoId);
        }
        if (tmp.indexOf(records[0][i].SpeechId) === -1 && records[0][i].SpeechId != null) {
            var speech = {};
            speech.id = records[0][i].SpeechId;
            speech.title = records[0][i].SpeechTitle;
            speech.description = records[0][i].SpeechDescription;
            speech.address = records[0][i].SpeechAddress;
            speech.start_time = records[0][i].SpeechStartTime;
            speech.end_time = records[0][i].SpeechEndTime;
            speech.presenter = {};
            speech.presenter.first_name = records[0][i].FirstName;
            speech.presenter.last_name = records[0][i].LastName;
            speech.presenter.id = records[0][i].UserId;
            conference.scheduled_speeches.push(speech);
            tmp.push(records[0][i].SpeechId);
        }
    }
    return conference;
}


module.exports = {
    getConferences : getConferences,
    getConferenceInfo : getConferenceInfo,
    addConferenceAttender : addConferenceAttender,
    removeConferenceAttender : removeConferenceAttender
};