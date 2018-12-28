const uuidv4 = require("uuid/v4");

// Create User
const createUser = ({ name = "" } = {}) => ({
  id: uuidv4(),
  name
});

// Create Message
const createMessage = ({ message = "", sender = "" } = {}) => ({
  id: uuidv4(),
  time: getTime(new Date(Date.now())),
  message,
  sender
});

// Create Chat
const createChat = ({ message = [], name = "Community", users = [] } = {}) => ({
  id: uuidv4(),
  name,
  message,
  users,
  typingUsers: []
});

// Get Date
const getTime = date => {
  return `${date.getHours()}:${("0" + date.getMinutes()).slice(-2)}`;
};

module.exports = { createUser, createMessage, createChat };
