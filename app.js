var http = require("http");
var express = require("express");
var app = express();
var server = http.Server(app);
var io = require("socket.io").listen(server);
var colors = require("colors/safe");
var PORT = 3000;

app.set("views", __dirname + "/public");
app.set("view engine", "jade");
app.use("/jquery", express.static(__dirname + "/node_modules/jquery/dist/"));
app.use("/bootstrap", express.static(__dirname + "/node_modules/bootstrap/dist/"));
app.use("/src", express.static(__dirname + "/public/src/"));

app.get("/", function(req, res) {
    res.render("index");
});

io.on("connection", function(client) {
    console.log(colors.green("A user connect..."));
    client.on("disconnect", function() {
        console.log(colors.yellow("A user disconnect..."));
    })
    client.on("send message", function(data, callback) {
        console.log(colors.bold("<"+ data.name +">"), data.message);
        callback();
        io.emit("broadcast message", data);
    });
})

server.listen(PORT, function() {
    console.log("Listening port:", PORT);
});
