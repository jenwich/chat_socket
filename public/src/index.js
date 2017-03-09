
var server = io();
var $nameInputPanel, $messageInputPanel, $messageDisplay;
var $name, $message, $sendButton, $nameButton, $whosay;
var name = "";

$(document).ready(function() {
    //Define jQuery Object
    $nameInputPanel = $("#name-input-panel");
    $messageInputPanel = $("#message-input-panel").hide();
    $messageDisplay = $("#message-display").hide();
    $name = $("#name-input");
    $nameButton = $("#name-send");
    $message = $("#message-input");
    $sendButton = $("#message-send");
    $whosay = $("#whosay");

    //Input name when login
    $name.focus();
    $nameButton.click(function() {
        name = $name.val();
        if(name == "") name = "Anonymous";
        server.emit("login", name, function() {
            $nameInputPanel.toggle();
            $messageInputPanel.toggle();
            $messageDisplay.toggle();
            $messageDisplay.html("");
            $whosay.text(name + " say: ");
            clearMessageBox();
        });
    });

    //Set events
    $sendButton.click(sendMessage);
    pressEnter($message, function() {
        $sendButton.click();
    });
    pressEnter($name, function() {
        $nameButton.click();
    });

    //Broadcast events
    server.on("broadcast message", addMessage);
    server.on("broadcast connect", function(name) {
        $messageDisplay.append($("<li><i>"+ parseText(name) +" connected...</i></li>"));
    });
    server.on("broadcast disconnect", function(name) {
        $messageDisplay.append($("<li><i>"+ parseText(name) +" disconnected</i></li>"));
    });
});

function sendMessage() {
    var message = $message.val();
    server.emit("send message", message, function() {
        clearMessageBox();
    });
}

function addMessage(data) {
    var $li = $("<li></li>").text(data.message).
        prepend($("<b></b>").text("<"+data.name+"> "));
    $messageDisplay.append($li);
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

function parseText(str) {
    return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
