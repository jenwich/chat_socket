
$(document).ready(function() {
    $name = $("#name-input");
    $message = $("#message-input");
    $sendButton = $("#send-button");
    $display = $("#message-display");
    clearMessageBox();

    $sendButton.click(sendMessage);
    pressEnter($message, function() {
        $sendButton.click();
    });
    server.on("broadcast message", showMessage);
});

var server = io();
var $name, $message, $sendButton, $display;

function sendMessage() {
    var name = $name.val(),
        message = $message.val();
    server.emit("send message", {
        "name": name,
        "message": message
    }, function() {
        clearMessageBox();
    });
}

function showMessage(data) {
    var $li = $("<li></li>").text(data.message).
        prepend($("<b></b>").text("<"+data.name+"> "));
    $display.append($li);
}

function pressEnter(object, callback) {
    object.keypress(function(e) {
        var code = e.keyCode || e.which;
        if(code == 13) callback();
    });
}

function clearMessageBox() {
    $message.val("");
    $message.focus();
}
