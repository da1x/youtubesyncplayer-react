var http = require("http");

var express = require("express");
var app = express();
var server = http.createServer(app);

var io = (module.exports.io = require("socket.io")(server));

const PORT = process.env.PORT || 4001;
const SocketManager = require("./server/SocketManager");

// This is what the socket.io syntax is like, we will work this later
io.on("connection", SocketManager);
/*
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
  });*/

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
