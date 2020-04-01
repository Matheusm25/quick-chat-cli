const io = require('socket.io-client');

module.exports = {
  name: 'connection',
  alias: ['conn'],
  run: async toolbox => {
    const socket = io('http://localhost:3333');

    const {
      prompt,
      print,
    } = toolbox;

    socket.on('another', (response) => {
      print.info('\n' + response + '\n');
    })

    function sleep(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    }   
    
    let message = {};
    while (message.message !== '\\q') {
      await sleep(300);
      message = await prompt.ask({type: 'text', name: 'message', message: ' ', edgeLength: 0});
      socket.emit('message', message);
    }

    socket.close();
  }
}
