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
        })
        .fail(function (err) {
            log.error(err);
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
                    log.error(err);
                    deferred.reject(err);
                })
        })
        .fail(function (err) {
            log.error(err);
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
                    log.error(err);
                    deferred.reject(err);
                })
        })
        .fail(function (err) {
            log.error(err);
            deferred.reject(err);
        });

    return deferred.promise;
}




function convertRecords(records) {
    var conference = {};

    if (records[0].length === 0) {
        return null;
    }

    conference.ConferenceId = records[0][0].ConferenceId;
    conference.Title = records[0][0].Title;
    conference.StatusDescription = records[0][0].StatusDescription;
    conference.Description = records[0][0].Description;
    conference.CityName = records[0][0].CityName;
    conference.Address = records[0][0].Address;
    conference.StartDate = records[0][0].StartDate;
    conference.EndDate = records[0][0].EndDate;
    conference.PhotoIDs = [];
    conference.SpeechIDs = [];
    for (var i in records[0]) {
        if (conference.PhotoIDs.indexOf(records[0][i].ConferencePhotoId) === -1 && records[0][i].ConferencePhotoId != null) {
            conference.PhotoIDs.push(records[0][i].ConferencePhotoId);
        }

        if (conference.SpeechIDs.indexOf(records[0][i].SpeechId) === -1 && records[0][i].SpeechId != null) {
            conference.SpeechIDs.push(records[0][i].SpeechId);
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