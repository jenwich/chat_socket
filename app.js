
var http = require("http");
var express = require("express");
var app = express();
var server = http.Server(app);
var io = require("socket.io").listen(server);
var colors = require("colors/safe");
var PORT = 3000;

server.listen(PORT, function() {
    console.log("Listening port:", PORT, "...");
});

app.set("views", __dirname + "/public");
app.set("view engine", "jade");
app.use("/jquery", express.static(__dirname + "/node_modules/jquery/dist/"));
app.use("/bootstrap", express.static(__dirname + "/node_modules/bootstrap/dist/"));
app.use("/src", express.static(__dirname + "/public/src/"));

app.get("/", function(req, res) {
    res.render("index");
});

io.on("connection", function(socket) {
    socket.on("login", function(name, callback) {
        socket["name"] = name;
        console.log(colors.yellow(name), "connected...");
        io.emit("broadcast connect", name);
        callback();
    });

    socket.on("disconnect", function() {
        console.log(colors.yellow(socket.name), "disconnected");
        io.emit("broadcast disconnect", socket.name);
    });

    socket.on("send message", function(message, callback) {
        console.log(colors.bold("<"+ socket.name +">"), message);
        callback();
        io.emit("broadcast message", {
            "name": socket.name,
            "message": message
        });
    });
});
