const CryptoJS = require('crypto-js');

const connection = require('../database/connection');
const ChatQuerys = require('../database/utils/chatQuerys');

const generateUniqueId = require('../utils/GenerateUniqueId');

module.exports = {
  async message(socket) {
    console.log('a user connected');

    socket.on('message', async data => {
      console.log(data);

      const result = await ChatQuerys.getChat(data.chatId);

      if (data.userId === result.sendingId) {
        const decryptedBytes = CryptoJS.AES.decrypt(data.message, result.sendingSocketId);
        const decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8);
        const newEncryptedMessage = CryptoJS.AES.encrypt(decryptedMessage, result.receivingSocketId).toString();
        socket.to(result.receivingSocketId).emit('response', newEncryptedMessage);
      } else {
        const decryptedBytes = CryptoJS.AES.decrypt(data.message, result.receivingSocketId);
        const decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8);
        const newEncryptedMessage = CryptoJS.AES.encrypt(decryptedMessage, result.sendingSocketId).toString();
        socket.to(result.sendingSocketId).emit('response', newEncryptedMessage);
      }
    });

    socket.on('talkTo', async data => {
      console.log('talkTo', data);
      const result = await ChatQuerys.getChat(data.chatId);
      console.log('result talkTo', result);

      socket.to(result.receivingSocketId).emit('wantToTalk', {
        chatId: data.chatId,
        username: result.sendingUsername,
      });
    });

    socket.on('chatResponse', async data => {
      const result = await ChatQuerys.getChat(data.chatId);

      socket.to(result.sendingSocketId).emit('requestChatResponse', {
        chatId: data.chatId,
        response: data.response,
      });
    });

    socket.on('closeChat', async data => {
      await connection('chat').update({ enabled: false }).where({ id: data.chatId });
      const result = await ChatQuerys.getChat(data.chatId);

      if (data.userId === result.sendingId) {
        socket.to(result.receivingSocketId).emit('disconnectUser', {});
      } else {
        socket.to(result.sendingSocketId).emit('disconnectUser', {});
      }

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
