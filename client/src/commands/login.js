const io = require('socket.io-client');

module.exports = {
  name: 'login',
  run: async toolbox => {
    const socket = io('http://localhost:3333');
    const {
      login,
      print,
      prompt,
      chatInit,
      logout,
    } = toolbox;

    const userId = await login(socket.id);
    
    print.success('You are now connected.');
    print.info('We will let you know when someone wants to talk.');
    print.info('Press ctrl + C to cancel.');

    socket.on('wantToTalk', async data => {
      const confirmation = await prompt.confirm(`${data.username} wants to talk with you, do you accept?`);
      if (confirmation) {
        chatInit(data.chatId, socket);

        await logout(userId);
        socket.emit('closeChat', { chatId: data.chatId });
        socket.close();
      }
    });
    

  }
}