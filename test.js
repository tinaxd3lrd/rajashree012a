/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-6-26
 * Time: 上午11:18
 * To change this template use File | Settings | File Templates.
 */


/*
 var mongodb = require('mongodb');
 var server = new mongodb.Server('localhost', 27017, {auto_reconnect: true});
 var db = new mongodb.Db('mySocket', server, {safe: true});
 */


var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    server;


var User = require("./modules/user.js");

server = http.createServer(function (req, res) {
    // your normal server code
    var path = url.parse(req.url).pathname;

    switch (path) {
        case '/':
        {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write('<h1>Hello! Try the <a href="/index.html">Socket.io Test</a></h1>');
            res.end();
            break;
        }
        case '/index.html':
        {
            fs.readFile(__dirname + "/public/" + path, function (err, data) {
                if (err) {
                    return send404(res);
                }
                res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html'})
                res.write(data, 'utf8');
                res.end();
            });
            break;
        }
        default:
        {
            /*
             * 通过 扩展名 .js/.css 来判断是否请求加载js/css文件
             * */
            var isJsFile = path.endWith(".js");
            var isCssFile = path.endWith(".css");
            if (isJsFile) {
                fs.readFile(__dirname + "/public/" + path, function (err, data) {
                    if (err) {
                        return send404(res);
                    }
                    res.writeHead(200, {'Content-Type': 'text/javascript' })
                    res.write(data, 'utf8');
                    res.end();
                });
            } else if (isCssFile) {
                fs.readFile(__dirname + "/public/" + path, function (err, data) {
                    if (err) {
                        return send404(res);
                    }
                    res.writeHead(200, {'Content-Type': 'text/css' })
                    res.write(data, 'utf8');
                    res.end();
                });
            } else {
                send404(res);
            }


            break;
        }
    }
});

server.listen(8080);


var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {

    socket.on('message', function (message) {
        console.log("Received message: " + message + " - from client " + socket.id);
    });
    socket.on('disconnect', function () {
        User.removeByCon({"socketId": socket.id}, function (err, result) {
            console.log("[User.removeByCon result] : " + result);
        })
    });

    addNewOnlineUser(socket);

});


/*=====================================*/
/*
 * 增加新的在线人员
 * */
function addNewOnlineUser(socket) {
    var user = new User({
        name: socket.id,
        socketId: socket.id
    });

    user.save(function (err) {
        if (err) {
            console.log("save err : " + err);
        } else {
            returnOnlineUserList(function (retString) {
                for (var s in io.sockets['sockets']) {
                    io.sockets['sockets'][s].send(retString);
                }
            });
        }
    })
}

/*
 * 返回所有在线人员
 * */
function returnOnlineUserList(callback) {
    User.getAll(function (err, docs) {
        if (err) {
            console.error("err : " + err);
        } else {
            var retJson = {"onlineUsers": docs };
            var resultStr = JSON.stringify(retJson);
            callback(resultStr);
        }
    })
}

send404 = function (res) {
    res.writeHead(404);
    res.write('404');
    res.end();
};

String.prototype.startWith = function (str) {
    var reg = new RegExp("^" + str);
    return reg.test(this);
}

String.prototype.endWith = function (str) {
    var reg = new RegExp(str + "$");
    return reg.test(this);
}






