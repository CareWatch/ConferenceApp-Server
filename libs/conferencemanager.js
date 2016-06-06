var db = require('./dbmanager');
var q = require('q');
var sql = require('mssql');
var configuration = require('../configuration');

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
                    var converted = convertInfoRecords(res);
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

function convertInfoRecords(records) {
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
            } else {
                speech.author.photo_id = configuration.defaultUserImageId;
            }
            conference.scheduled_speeches.push(speech);
            tmp.push(records[0][i].SpeechId);
        }
    }
    return conference;
}

function convertCommentsRecords(records) {
    for (var i in records[0]) {
        var author = {};
        author.id = records[0][i].author_id;
        author.first_name = records[0][i].author_firstname;
        author.last_name = records[0][i].author_lastname;
        if (records[0][i].author_photoid != null) {
            author.photo_id = records[0][i].author_photoid;
        } else {
            author.photo_id = configuration.defaultUserImageId;
        }
        
        delete records[0][i].author_id;
        delete records[0][i].author_firstname;
        delete records[0][i].author_lastname;
        delete records[0][i].author_photoid;
        records[0][i].author = author;
    }
    return records[0];
}



function getConferenceComments(conferenceId) {
    var deferred = q.defer();
    db.getConnection()
        .then(function (connection) {
            new connection.Request()
                .input('SelectedConferenceId', sql.Int, conferenceId)
                .execute('getConferenceComments')
                .then(function (res) {
                    var converted = convertCommentsRecords(res);
                    deferred.resolve(converted);
                })
                .catch(function (err) {
                    deferred.reject(new TypeError('No conference with such id found in database'));
                })
        })
        .fail(function (err) {
            deferred.reject(err);
        });

    return deferred.promise;
}

function addConferenceComment(conferenceId, authorId, text) {
    var deferred = q.defer();

    db.getConnection()
        .then(function (connection) {
            var request = new connection.Request();
            var time = new Date();
            time.setHours(time.getHours());

            request.input('SelectedConferenceId', sql.Int, conferenceId);
            request.input('CommentAuthorId', sql.Int, authorId);
            request.input('CommentTime', sql.DateTime, time);
            request.input('CommentText', sql.NVarChar, text);
            request.execute('AddConferenceComment')
                .then(function (res) {
                    deferred.resolve(res);
                })
                .catch(function (err) {
                    if (err.code === 'EREQUEST')
                    {
                        deferred.reject(new TypeError('No conference with such id found in database'));
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
    getConferences : getConferences,
    getConferenceInfo : getConferenceInfo,
    addConferenceAttender : addConferenceAttender,
    removeConferenceAttender : removeConferenceAttender,
    getConferenceComments : getConferenceComments,
    addConferenceComment: addConferenceComment
};