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
      sleep,
    } = toolbox;

    // Log in 
    print.info('Please insert your username and password to log in:');
    const { username, password} = await prompt.ask([
      { type: 'text', name: 'username', message: 'Username:'},
      { type: 'invisible', name: 'password', message: 'Password:'},
    ])

    const { userId } = await Auth.login(username, password, socket.id);
    
    const { toUser } = await prompt.ask({ type: 'text', name: 'toUser', message: 'Connect to user:'});
    const { chatId } = await Auth.connectTo(userId, toUser);

    socket.on('response', (response) => {
      print.info(response);
    })

    let message = {};
    while (message.message !== '\\q') {
      await sleep(300);
      message = await prompt.ask({type: 'text', name: 'message', message: ' ', edgeLength: 0});
      if (message.message !== '\\q') {
        socket.emit('message', {
          message: message.message,
          chatId: chatId,
        });
      }
    }

    await Auth.logoff(userId);
    socket.emit('closeChat', { chatId });
    socket.close('somethig');
  }
}
