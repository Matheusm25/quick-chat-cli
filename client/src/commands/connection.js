const io = require('socket.io-client');
const readline = require('readline');
const Auth = require('../services/auth');
const config = require('../config');

module.exports = {
  name: 'connect',
  alias: ['conn'],
  run: async toolbox => {
    const socket = io(config.SERVER_URL);

    const {
      plainPrompt,
      print,
      login,
      logout,
      chatInit,
      sleep,
    } = toolbox;

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    do {
      await sleep(30);
    } while (!socket.id);
    const userId = await login(socket.id, rl);

    const toUser = await plainPrompt('Connect to user: ', rl);

    const { chatId } = await Auth.connectTo(userId, toUser);

    socket.emit('talkTo', {
      chatId,
      toUser,
    });

    const spinner = print.spin('Waiting for the user response.');

    socket.on('requestChatResponse', async data => {
      if (data.response) {
        spinner.succeed('Starting chat now.');
        if (data.chatId === chatId) {
          await chatInit({
            chatId, socket, userId, readline: rl,
          });
          await logout(userId);
          socket.emit('closeChat', { chatId, userId });
          socket.close();
          process.exit();
        }
      } else {
        spinner.fail('Your request was denied.');
        process.exit();
      }
    });
  },
};
