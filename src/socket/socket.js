const socketSetup = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join room
    socket.on('join', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined their room`);
    });

    // Shop owner join
    socket.on('join_shop', (shopOwnerId) => {
      socket.join(`shop_${shopOwnerId}`);
      console.log(`Shop owner ${shopOwnerId} joined shop room`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

module.exports = socketSetup;