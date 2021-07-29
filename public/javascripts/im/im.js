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

//            console.log(jsonData);

            if (userList) {
                updateUserList(userList);
            } else if (jsonData.editName) {
                if (jsonData.result == 'success') {
                    $('#user_name').html(jsonData.editName);
                    $('#my_name').hide();
                }
            } else if (jsonData.action == 'talk') {


                talk2One(jsonData.fromSocketId ,  jsonData.fromSocketId) ;

                $('#dialog_'+jsonData.fromSocketId).append('<div class="webim-dia-box"> '
                    + '<div class="msg-content msg-content-l">'
                    + jsonData.msgData
                    + '</div>'
                    + '<div class="msg-arr msg-arr-l"></div>'
                   + '</div>'
                    + '<div class="clearfix">'
                    +'</div>');

                // TODO：滚动条位置待处理
                var offsetTop = $('#multiple_dialog_con').height() - $('.msg-content:last').height() * 1.3;
                $('#dialog_'+jsonData.fromSocketId).scrollTop(offsetTop);

                /*
                $('#' + jsonData.fromSocketId + " a").trigger("click", "trigger");

                $('#diaglog_content_container').append('<div class="webim-dia-box"> '
                    + '<div class="msg-content msg-content-l">'
                    + jsonData.msgData
                    + '</div>'
                    + '<div class="msg-arr msg-arr-l"></div>'
                    + '</div>'
                    + '<div class="clearfix"></div>');

                var offsetTop = $('#diaglog_content_container').height() - $('.msg-content:last').height() * 1.3;
                $('#dialog_content').scrollTop(offsetTop);
                */
                // TODO:修改为新消息加入到对应的窗口，并弹出对应的提示信息
                //<span class='badge badge-info'>1</span>
                 /*
                var fromUserName = $("#"+jsonData.fromSocketId + " a").html();
                var msg;
                msg = $.globalMessenger().post({
                    message: fromUserName ,
                    type: 'info',
                    showCloseButton: true,
                    actions: {
                        cancel: {
                            label: 'cancel launch',
                            action: function() {
                              console.log('action...');
                            }
                        }
                    }
                });
                */
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
                uHtml += "<li id='" + user.socketId + "'class='user-li'><a href='javascript:void(0);'>" + user.name + " </a></li>";

                if($('#header_'+user.socketId).length == 1) {
                    $('#header_'+user.socketId).html('<a>'+user.name+'</a>');
                }
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

function talk2One(sid , userName) {

    $('.active' , $('#multiple_user_con')).removeClass('active');
    $('.active' , $('#multiple_dialog_con')).removeClass('active');

    /*
    * 左侧头像栏
    * */
    if($('#header_'+ sid).length == 1) {
        $('#header_'+ sid).addClass("active");
    }else {
        $('#multiple_user_con').append('<li class="active" id="header_'+sid+'"><a>'+userName+'</a></li>');

        // 左侧头像点击事件
        $('#header_'+ sid).click(function() {
            talk2One(sid ,userName ) ;
        })
    }

    /*
    * 右侧聊天内容栏
    * */
    if($('#dialog_'+ sid).length == 1) {
        $('#dialog_'+ sid).addClass("active");
    }else {
        $('#multiple_dialog_con').append('<div id="dialog_'+sid+'" class="webim-wrapper active"></div>');
    }

 }

function bindUserListEvent() {

    $('#user_wrapper li a').click(function (e) {

        var sid = $(this).parent('li').attr('id');
        talk2One(sid , $(this).html());


        if(true) {
             return;
        }

        $('span',$(this)).remove();
        if (e['isTrigger']) {
          return;
        }else {
            //$('#diaglog_content_container').html("");


        }

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
