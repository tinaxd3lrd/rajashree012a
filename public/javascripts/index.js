/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-6-26
 * Time: 下午3:19
 * To change this template use File | Settings | File Templates.
 */
$(function() {


    $('#connect').click(function() {
        connect();
    })

    $('#disconnect').click(function() {
        disconnect();
    })

    $('#send').click(function() {
        send();
    })

    connect();

    $('#submit_name').click(function() {
        editName($('#profile_name').val());
    });

    $('#submit_msg').click(function() {
        var sendMsgJson = {"action" : "talk" , "msgData" :  $('#dialog_input').val() , "targetSocketId" :  $('#user_wrapper .active').attr('id')}
        send(JSON.stringify(sendMsgJson));
    })

//    $('#user_wrapper').live("click" ,function() {
//        alert("xxx");
//          $('#dialog').show();
//    });


    /*
    $('.rename').click(function() {
        $(this).
        rename();
    })
    */
})
