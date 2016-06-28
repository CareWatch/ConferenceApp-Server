'use strict';
var db = require('./dbmanager');
var q = require('q');
var sql = require('mssql');


function registerUser(userinfo) {
    var deferred = q.defer();

    db.getConnection()
        .then(function (connection) {
            var request = new connection.Request();

            request.input('UserLogin', sql.NVarChar, userinfo.usesrname);
            request.input('PasswordHash', sql.VarChar, userinfo.password);
            request.input('FirstName', sql.NVarChar, userinfo.firstname);
            request.input('LastName', sql.NVarChar, userinfo.lastname);
            request.input('EmailAddress', sql.NVarChar, userinfo.email);
            request.input('PersonalDescription', sql.NVarChar, userinfo.description);
            request.input('ProfilePhotoId', sql.Int, userinfo.photoid);
            request.execute('RegisterUser')
                .then(function (res) {
                    deferred.resolve(res);
                })
                .catch(function (err) {
                    if (err.code === 'EREQUEST')
                    {
                        deferred.reject(new TypeError('Username is already taken.'));
                    }
                    deferred.reject(err);
                })
        })
        .fail(function (err) {
            deferred.reject(err);
        });

    return deferred.promise;
}

function getPassHash(username) {
    var deferred = q.defer();

    db.getConnection()
        .then(function (connection) {
            var request = new connection.Request()
                .input('SelectedUsername', sql.VarChar, username)
                .execute('GetPasswordHash')
                .then(function (res) {
                    if (res[0].length === 0)
                    {
                        deferred.reject(new TypeError('No user found with username' + username))
                    }
                    deferred.resolve(res[0][0]);
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
    registerUser: registerUser,
    getPassHash : getPassHash
};