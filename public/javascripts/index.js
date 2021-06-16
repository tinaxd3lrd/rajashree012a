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

    /*
    $('.rename').click(function() {
        $(this).
        rename();
    })
    */
})
