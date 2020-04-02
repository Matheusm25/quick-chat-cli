const connection = require('../database/connection');

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

  async connectUser(req, res) {
    const {
      username,
    } = req.body;

    const user = await connection('users')
      .select('*')
      .where({ username })
      .first();

    if (!user) {
      return res.status(404).json({
        error: 'Cannot find user',
      });
    }

    if (!user.available) {
      return res.status(406).json({
        error: 'User is not connected',
      });
    }

    return res.status(200).json({
      id: user.userId,
    });
  },
};
