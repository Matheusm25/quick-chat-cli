const io = require('socket.io-client');
const Auth = require('../services/auth');
const readline = require('readline');

module.exports = {
  name: 'connection',
  alias: ['conn'],
  run: async toolbox => {
    const socket = io('http://localhost:3333');

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

    await sleep(100);
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
          await chatInit({ chatId, socket, userId, readline: rl });
          await logout(userId);
          socket.emit('closeChat', { chatId });
          socket.close();
        }
      } else {
        spinner.fail('Your request was denied.')
      }
    });
    
  }
}
