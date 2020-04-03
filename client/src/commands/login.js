const io = require('socket.io-client');
const readline = require('readline');
const config = require('../config');

module.exports = {
  name: 'login',
  run: async toolbox => {
    const socket = io(config.SERVER_URL);
    const {
      login,
      print,
      plainPrompt,
      chatInit,
      logout,
      sleep,
    } = toolbox;

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    await sleep(100);
    const userId = await login(socket.id, rl);

    print.success('You are now connected.');
    print.info('We will let you know when someone wants to talk.');
    print.info('Press ctrl + C to cancel.');

    socket.on('wantToTalk', async data => {
      const confirmation = await plainPrompt(`${data.username} wants to talk with you, do you accept (y/N): `, rl);
      if (confirmation === 'y') {
        socket.emit('chatResponse', {
          chatId: data.chatId,
          response: true,
        });

        await chatInit({
          chatId: data.chatId, socket, userId, readline: rl,
        });

        await logout(userId);
        socket.emit('closeChat', { chatId: data.chatId, userId });
        socket.close();
        process.exit();
      } else {
        socket.emit('chatResponse', {
          chatId: data.chatId,
          response: false,
        });

        process.exit();
      }
    });
  },
};
