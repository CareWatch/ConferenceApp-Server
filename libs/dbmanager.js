var sql = require('mssql'),
    q = require('q'),
    config = require('../configuration'),
    log = require('./logger')(module);

function getConnection() {
    var deferred = q.defer();
    sql.connect(config.dbString, function (err) {
        if (err) {
            log.error(err);
            deferred.reject(err);
        }
        //log.debug('Connection established!');
        deferred.resolve(sql);
    });
    return deferred.promise;
}

function prepareQuery(query, parameters){
    if(!query || !parameters) {
        throw  new Error('Query and parameters function parameters should be specified.');
    }
    return sql.format(query, parameters);
}

module.exports = {
    getConnection : getConnection,
    prepareQuery: prepareQuery
};