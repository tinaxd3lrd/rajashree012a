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

    mongodb(function (db) {
        db.collection('users', function (err, collection) {
            if (err) {
                throw new Error(err);
            }

            // 插入 user
            collection.insert(user, {safe: true}, function (err, user) {
                callback(err, user);
            });
        });
    });
};

User.get = function get(username, callback) {
    mongodb(function (db) {
        db.collection('users', function (err, collection) {
            if (err) {
                throw new Error(err);
            }
            // 根据 name 属性查找 user document
            collection.findOne({name: username}, function (err, doc) {
                if (doc) {
                    //将获取的document转换为 user 类型
                    var user = new User(doc);
                    callback(err, doc);
                } else {
                    throw new Error(err);
                }
            });
        });
    });
};


User.getAll = function getAll(callback) {
    mongodb(function (db) {
        // 读取 users collection
        db.collection('users', function (err, collection) {
            if (err) {
                throw new Error(err);
            }
            collection.find({}).toArray(function (err, docs) {
                if(err) {
                    throw new Error(err);
                }
                callback(err, docs);
            });

        });
    });
};

User.removeByCon = function removeByCon(condition , callback) {
    mongodb(function (db) {
        // 读取 users collection
        db.collection('users', function (err, collection) {
            if (err) {
                throw new Error(err);
            }
            collection.remove(condition , function (err) {
                if(err) {
                    throw new Error(err);
                }
                callback(err);
            });

        });
    });
};


User.update = function update(condition , objNew , callback) {
    mongodb(function (db) {
        // 读取 users collection
        db.collection('users', function (err, collection) {
            if (err) {
                throw new Error(err);
            }
            collection.update(condition , {$set: objNew} , function (err) {
                if(err) {
                    throw new Error(err);
                }
                callback(err);
            });

        });
    });
};





