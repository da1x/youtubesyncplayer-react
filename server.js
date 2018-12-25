var fs = require("fs");
var express = require("express");
var http = require("http");
var socketIO = require("socket.io");

// our localhost port
var port = 4001;

var app = express();

var option = {
  key: fs.readFileSync("./file.pem"),
  cert: fs.readFileSync("./file.crt")
};

// our server instance
var server = http.createServer(option, app);

// This creates our socket using the instance of the server
var io = socketIO(server);

// This is what the socket.io syntax is like, we will work this later
io.on("connection", socket => {
  console.log("New user connected");

  socket.on("change color", color => {
    console.log("Color Changed to: ", color);
    io.sockets.emit("change color", color);
  });

  socket.on("PlayState", playState => {
    console.log("Server.js: " + playState);

    io.sockets.emit("PlayState", playState);
  });

  socket.on("change videoId", videoId => {
    console.log("Server videoID: " + videoId);

    io.sockets.emit("change videoId", videoId);
  });

  // disconnect is fired when a client leaves the server
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
