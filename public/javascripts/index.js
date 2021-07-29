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

        var targetSid =  $('#multiple_user_con .active').attr('id').split('_')[1];
        var sendMsgJson = {"action" : "talk" , "msgData" :  $('#dialog_input').val() , "targetSocketId" : targetSid   }
        send(JSON.stringify(sendMsgJson));

        console.log('targetSid : ' + targetSid);
        $('#dialog_'+targetSid).append('<div class="webim-dia-box"> '
            + '<div class="msg-content msg-content-r">'
            +  $('#dialog_input').val()
            + '</div>'
            + '<div class="msg-arr msg-arr-r"></div>'
            + '</div>'
            + '<div class="clearfix"></div>');

        $('#dialog_input').val('');

//        var winDivHeight = $('#dialog_content').height();
        var offsetTop =   $('#diaglog_content_container').height() - $('.msg-content:last').height() * 1.3 ;
        $('#dialog_content').scrollTop(offsetTop);
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
