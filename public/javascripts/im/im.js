/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-6-26
 * Time: 下午3:00
 * To change this template use File | Settings | File Templates.
 */


var socket;
var firstconnect = true;

var STATUS_CODE_SUCCESS = "success";
var STATUS_CODE_ERROR = "error";
var STATUS_CODE_WARN = "warn";

function connect() {
    if (firstconnect) {

        socket = io.connect(null);

        socket.on('message', function (data) {
            var jsonData = JSON.parse(data);
            var userList = jsonData.onlineUsers;
            updateUserList(userList);
//          message(data);
        });
        socket.on('connect', function () {
            updateStatus(STATUS_CODE_SUCCESS, "连接服务器成功！");
        });
        socket.on('disconnect', function () {
            updateStatus("Disconnected from Server");
        });
        socket.on('reconnect', function () {
            updateStatus("Reconnected to Server");
        });
        socket.on('reconnecting', function (nextRetry) {
            updateStatus("Reconnecting in "
                + nextRetry + " seconds");
        });
        socket.on('reconnect_failed', function () {
            message("Reconnect Failed");
        });

        firstconnect = false;
    } else {
        socket.socket.reconnect();
    }
}

function disconnect() {
    socket.disconnect();
}

function message(data) {
    document.getElementById('message').innerHTML = "Server says: " + data;
}

function updateUserList(userList) {
    if (userList) {
        var uHtml = "";
        for (var i = 0; i < userList.length; i++) {
            var user = userList[i];
            uHtml += "<li id='"+ user.socketId +"'><a href='javascript:void(0);'>" + user.name + "</a></li>";
        }

        $('#user_wrapper').html(uHtml);
    }
}

function updateStatus(code, txt) {

    var alertClass = "";

    if (code == STATUS_CODE_SUCCESS) {
        alertClass = "alert-success";
    } else if (code == STATUS_CODE_ERROR) {
        alertClass = "alert-error";
    } else {
        alertClass = "";
    }

    $('#alert_wrapper').append('<div class="alert alert-' + code + '" >'
        + '<button type="button" class="close" data-dismiss="alert">&times;</button>'
        + txt + '</div>').show();
}

function esc(msg) {
    return msg.replace(/</g, '<').replace(/>/g, '>');
}

function send() {
    socket.send("Hello Server!");
}

function rename(newname) {
    socket.send('{"rename" : "' + newname + '" }')
}
