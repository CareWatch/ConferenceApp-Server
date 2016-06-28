'use strict';
var db = require('./dbmanager');
var q = require('q');
var sql = require('mssql');

function getImage(imageId) {
    var deferred = q.defer();

    db.getConnection()
        .then(function (connection) {
            new connection.Request()
                .input('SelectedImageId', sql.Int, imageId)
                .execute('GetImage')
                .then(function (res) {
                    if (res[0].length === 0) {
                        deferred.reject(new TypeError('No photo with such id found in database'));
                    } else {
                        deferred.resolve(res[0][0].PhotoBinary);
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
    getImage: getImage
};