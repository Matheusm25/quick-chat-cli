const connection = require('../database/connection');
const generateUniqueId = require('../utils/GenerateUniqueId');

module.exports = {
  async message(socket) {
    console.log('a user connected');

    socket.on('message', async data => {
      console.log(data);

      const result = await connection('chat')
        .join('users AS sending', 'chat.sendingId', '=', 'sending.userId')
        .join('users AS receiving', 'chat.receivingId', '=', 'receiving.userId')
        .select([
          'chat.*',
          'receiving.socketId AS receivingSocketId',
          'sending.socketId AS sendingSocketId',
          'sending.username AS sendingUsername',
          'receiving.username AS receivingUsername',
        ])
        .where({ id: data.chatId })
        .first();

      console.log(result);

      socket.to(result.receivingSocketId).emit('wantToTalk', {
        chatId: data.chatId,
        username: result.receivingUsername,
      });
    });

    socket.on('closeChat', async data => {
      await connection('chat').update({ enabled: false }).where({ id: data.chatId });
      console.log(`Chat ${data.chatId} closed`);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  },

  async connectUser(req, res) {
    const {
      userId,
      userToName: username,
    } = req.body;

    const user = await connection('users')
      .select('*')
      .where({ username })
      .first();

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        error: 'Cannot find user',
      });
    }

    // Check if user is available/connected
    if (!user.available) {
      return res.status(406).json({
        error: 'User is not connected or chating with someone else',
      });
    }

    // Disable users so no one can send them requests
    // while they are talking to each other
    await connection('users')
      .update({ available: false })
      .whereIn('userId', [userId, user.userId]);

    const chatId = generateUniqueId();

    await connection('chat')
      .insert({
        id: chatId,
        sendingId: userId,
        receivingId: user.userId,
        enabled: true,
      });

    return res.status(200).json({
      chatId,
    });
  },
};
