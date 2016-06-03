var db = require('./dbmanager');
var q = require('q');
var sql = require('mssql');
var configuration = require('../configuration');
var log = require('../libs/logger')(module);

function getConferences() {
    var deferred = q.defer();

    db.getConnection()
        .then(function (connection) {
            new connection.Request()
                .input('SelectedPhotoTypeId', sql.Int, 1)
                .execute('GetAllConferences')
                .then(function (res) {
                    deferred.resolve(res[0]);
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
                .execute('GetConferenceInfo')
                .then(function (res) {
                    var converted = convertRecords(res);
                    if (!converted) {
                        deferred.reject(new TypeError('No conference with such id found in database'));
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

function addConferenceAttender(userId, conferenceId) {
    var deferred = q.defer();

    db.getConnection()
        .then(function (connection) {
            new connection.Request()
                .input('SelectedConferenceId', sql.Int, conferenceId)
                .input('SelectedUserId', sql.Int, userId)
                .input('SelectedUserRoleId', sql.Int, 1)
                .execute('AddConferenceAttender')
                .then(function (res) {
                    deferred.resolve(res);
                })
                .catch(function (err) {
                    if (err.code === 'EREQUEST')
                    {
                        deferred.reject(new TypeError('User info needs to be filled before applying any conference.'));
                    }
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
                .then(function (res) {
                    deferred.resolve(res);
                })
                .catch(function (err) {
                    if (err.code === 'EREQUEST')
                    {
                        deferred.reject(new TypeError('User info needs to be filled before applying any conference.'));
                    }
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

    conference.conference_id = records[0][0].ConferenceId;
    conference.title = records[0][0].Title;
    conference.status_description = records[0][0].StatusDescription;
    conference.description = records[0][0].Description;
    conference.city_name = records[0][0].CityName;
    conference.address = records[0][0].Address;
    conference.start_date = records[0][0].StartDate;
    conference.end_date = records[0][0].EndDate;
    conference.scheduled_speeches = [];
    var tmp = [];
    for (var i in records[0]) {
        if (records[0][i].PhotoTypeId == configuration.mainImageId && records[0][i].ConferencePhotoId != null){
            conference.main_image = records[0][i].ConferencePhotoId;
        } else if (records[0][i].PhotoTypeId == configuration.extendedMainImageId){
            conference.main_image_bigger = records[0][i].ConferencePhotoId;
        }

        if (tmp.indexOf(records[0][i].SpeechId) === -1 && records[0][i].SpeechId != null) {
            var speech = {};
            speech.speech_id = records[0][i].SpeechId;
            speech.title = records[0][i].SpeechTitle;
            speech.description = records[0][i].SpeechDescription;
            speech.address = records[0][i].SpeechAddress;
            speech.start_time = records[0][i].SpeechStartTime;
            speech.end_time = records[0][i].SpeechEndTime;
            speech.author = {};
            speech.author.first_name = records[0][i].FirstName;
            speech.author.last_name = records[0][i].LastName;
            speech.author.id = records[0][i].UserId;
            if (records[0][i].ProfilePhotoId != null) {
                speech.author.photo_id = records[0][i].ProfilePhotoId;
            } else
            {
                speech.author.photo_id = configuration.defaultUserImageId;
            }
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