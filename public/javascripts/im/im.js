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

            console.log(jsonData);

            if (userList) {
                updateUserList(userList);
            } else if (jsonData.editName) {
                if (jsonData.result == 'success') {
                    $('#user_name').html(jsonData.editName);
                    $('#my_name').hide();
                }
            } else if (jsonData.action == 'talk') {
                $('#' + jsonData.fromSocketId + " a").trigger("click");

                $('#diaglog_content_container').append('<div class="webim-dia-box"> '
                    + '<div class="msg-content msg-content-l">'
                    + jsonData.msgData
                    + '</div>'
                    + '<div class="msg-arr msg-arr-l"></div>'
                    + '</div>'
                    + '<div class="clearfix"></div>');

                var offsetTop =   $('#diaglog_content_container').height() - $('.msg-content:last').height() * 1.3 ;
                $('#dialog_content').scrollTop(offsetTop);
            }

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

            if (socket.socket.sessionid != user.socketId) {
                uHtml += "<li id='" + user.socketId + "'class='user-li'><a href='javascript:void(0);'>" + user.name + "</a></li>";
            }
        }
        $('#user_wrapper').html(uHtml);
        bindUserListEvent();

    }
}

function updateStatus(code, txt) {

    var alertClass = "";

    if (code == STATUS_CODE_SUCCESS) {
        alertClass = "alert-success";

        $('#my_profile').html("<span id='user_name'>" + socket.socket.sessionid + "</span><i class='icon-edit pull-right'></i>");

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

function send(msg) {
    socket.send(msg);
}

function editName(name) {
    var editNameCmd = {"action": "editName", "targetName": name};
    send(JSON.stringify(editNameCmd));
//    send('{"editName":' + '"' + name +'"}');
}


function bindUserListEvent() {

    $('#user_wrapper li a').click(function () {

        $('#user_wrapper .active').removeClass("active");

        $('#dialog').show();
        $('#dialog .close ').click(function () {
            $('#user_wrapper .active').removeClass("active");
            $('#dialog').hide();
        });

        $(this).parents("li").addClass("active");
        $('#dialog_talker').html($(this).html());
    });
}
