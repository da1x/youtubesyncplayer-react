const io = require("../server.js").io;

const {
  VERIFY_USER,
  USER_CONNECTED,
  LOGOUT
} = require("../socket-client/src/Events");

const { createUser, createMessage, createChat } = require("../Factories");

let connectedUsers = {};

module.exports = function(socket) {
  console.log("Socket Id: " + socket.id);

  // Verify Username
  socket.on(VERIFY_USER, (nickname, callback) => {
    if (isUser(connectedUsers, nickname)) {
      callback({ isUser: true, user: null });
    } else {
      callback({ isUser: false, user: createUser({ name: nickname }) });
    }
  });

  // User connects with username
  socket.on(USER_CONNECTED, user => {
    connectedUsers = addUser(connectedUsers, user);
    socket.user = user.name;

    io.emit(USER_CONNECTED, connectedUsers);
    console.log(connectedUsers);
  });

  // User disconnect

  // User logout

  function addUser(userList, user) {
    let newList = Object.assign({}, userList);
    newList[user.name] = user;
    return newList;
  }

  function removeUser(userList, username) {
    let newList = Object.assign({}, userList);
    delete newList[username];
    return newList;
  }

  function isUser(userList, username) {
    return username in userList;
  }
};
