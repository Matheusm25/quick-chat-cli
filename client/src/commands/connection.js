const io = require('socket.io-client');
const Auth = require('../services/auth');

module.exports = {
  name: 'connection',
  alias: ['conn'],
  run: async toolbox => {
    const socket = io('http://localhost:3333');

    const {
      prompt,
      print,
      login,
      logout,
      chatInit,
    } = toolbox;

    const userId = await login(socket.id);
    
    const { toUser } = await prompt.ask({ type: 'text', name: 'toUser', message: 'Connect to user:'});
    const { chatId } = await Auth.connectTo(userId, toUser);

    socket.on('response', (response) => {
      print.info(response);
    })

    await chatInit(chatId, socket);

    await logout(userId);
    socket.emit('closeChat', { chatId });
    socket.close();
  }
}
