var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;

//module.exports = new Db("mySocket", new Server('localhost', 27017, {auto_reconnect: true}));

var connectionInstance;

module.exports = function (callback) {
    //if already we have a connection, don't connect to database again
    if (connectionInstance) {
        callback(connectionInstance);
        return;
    }

    var db = new Db('mySocket', new Server("localhost", 27017, { auto_reconnect: true }));
    db.open(function (error, databaseConnection) {
        if (error) {
            throw new Error(error);
        }
        connectionInstance = databaseConnection;
        callback(databaseConnection);
    });
};