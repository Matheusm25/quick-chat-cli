module.exports = {
  async message(socket) {
    console.log('a user connected');

    socket.on('message', message => {
      console.log(message);

      if (message.message === '3') {
        socket.emit('another', 'something');
      }
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  },
};
