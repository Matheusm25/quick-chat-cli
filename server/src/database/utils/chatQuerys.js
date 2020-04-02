const connection = require('../connection');

module.exports = {
  async getChat(chatId) {
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
      .where({ id: chatId })
      .first();

    return result;
  },
};
