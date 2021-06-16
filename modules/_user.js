var mongodb = require('./db');

function User(user) {
    this.name = user.name;
    this.socketId = user.socketId;
};

// 暴露接口
module.exports = User;


User.prototype.save = function save(callback) {

    // 存入 Mongodb 的 document 结构
    var user = {
        name: this.name,
        socketId: this.socketId
    };

    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }

        // 读取 users collection
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

            // 插入 user
            collection.insert(user, {safe: true}, function (err, user) {
                mongodb.close();
                callback(err, user);
            });
        });
    });
};

User.get = function get(username, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        // 读取 users collection
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            // 根据 name 属性查找 user document
            collection.findOne({name: username}, function (err, doc) {
                mongodb.close();
                if (doc) {
                    //将获取的document转换为 user 类型
                    var user = new User(doc);
                    callback(err, doc);
                } else {
                    callback(err, null);
                }
            });
        });
    });
};


User.getAll = function getAll(callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        // 读取 users collection
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err, null);
            }

            collection.find({}).toArray(function (err, docs) {
                mongodb.close();
                callback(err, docs);
            });

        });
    });
};




