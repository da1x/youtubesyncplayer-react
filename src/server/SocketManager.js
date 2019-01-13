const io = require("./index.js").io;

const {
  VERIFY_USER,
  USER_CONNECTED,
  USER_DISCONNECTED,
  LOGOUT,
  COMMUNITY_CHAT,
  MESSAGE_RECIEVED,
  MESSAGE_SENT,
  TYPING,
  PLAY_STATE,
  VIDEO_ID,
  MUTE_STATE
} = require("../Events");

const { createUser, createMessage, createChat } = require("../Factories");

let connectedUsers = {};

let communityChat = createChat();

module.exports = function(socket) {
  console.log("Socket Id:" + socket.id);

  let sendMessageToChatFromUser;

  let sendTypingFromUser;

  //Verify Username
  socket.on(VERIFY_USER, (nickname, callback) => {
    if (isUser(connectedUsers, nickname)) {
      callback({ isUser: true, user: null });
    } else {
      callback({ isUser: false, user: createUser({ name: nickname }) });
    }
  });

  //User Connects with username
  socket.on(USER_CONNECTED, user => {
    connectedUsers = addUser(connectedUsers, user);
    socket.user = user;

    sendMessageToChatFromUser = sendMessageToChat(user.name);
    sendTypingFromUser = sendTypingToChat(user.name);

    io.emit(USER_CONNECTED, connectedUsers);
    console.log(connectedUsers);
  });

  //User disconnects
  socket.on("disconnect", () => {
    if ("user" in socket) {
      connectedUsers = removeUser(connectedUsers, socket.user.name);

      io.emit(USER_DISCONNECTED, connectedUsers);
      console.log("Disconnect", connectedUsers);
    }
  });

  //User logout
  socket.on(LOGOUT, () => {
    connectedUsers = removeUser(connectedUsers, socket.user.name);
    io.emit(USER_DISCONNECTED, connectedUsers);
    console.log("Disconnect", connectedUsers);
  });

  //Get Community Chat
  socket.on(COMMUNITY_CHAT, callback => {
    callback(communityChat);
  });

  socket.on(MESSAGE_SENT, ({ chatId, message }) => {
    sendMessageToChatFromUser(chatId, message);
  });

  socket.on(TYPING, ({ chatId, isTyping }) => {
    sendTypingFromUser(chatId, isTyping);
  });

  // Youtube Player Sockets
  // Play/Pause
  socket.on(PLAY_STATE, isPlaying => {
    io.emit(PLAY_STATE, isPlaying);
    console.log("SocketManager - isPlaying: " + isPlaying);
  });

  // Current video id
  socket.on(VIDEO_ID, videoIndex => {
    io.emit(VIDEO_ID, videoIndex);
    console.log("SocketManager - videoIndex" + videoIndex);
  });

  // Mute/Unmute state
  socket.on(MUTE_STATE, isMuted => {
    io.emit(MUTE_STATE, isMuted);
    console.log("SocketManager - isMuted: " + isMuted);
  });
};

// Server side functions
function sendTypingToChat(user) {
  return (chatId, isTyping) => {
    io.emit(`${TYPING}-${chatId}`, { user, isTyping });
  };
}

function sendMessageToChat(sender) {
  return (chatId, message) => {
    io.emit(
      `${MESSAGE_RECIEVED}-${chatId}`,
      createMessage({ message, sender })
    );
  };
}

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
