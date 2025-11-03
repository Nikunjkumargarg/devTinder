const socket = require("socket.io");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: { 
      origin: 'http://localhost:3000',
      credentials: true,
    },
  });
  io.on('connection', (socket) => {
    socket.on('joinChat', ({firstName, userId, targetUserId}) => {
      const roomId = [userId, targetUserId].sort().join("_");
      console.log(firstName + "Joined room " + roomId);
      socket.join(roomId)
    });
    socket.on('sendMessage', (message) => {});
    socket.on('disconnect', () => {}); 
  });
};

module.exports = initializeSocket;