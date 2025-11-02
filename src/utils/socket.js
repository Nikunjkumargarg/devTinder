const socket = require("socket.io");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: 'http://localhost:3000',
      credentials: true,
    },
  });
  io.on('connection', (socket) => {
    console.log('a user connected');
  });
};

module.exports = initializeSocket;