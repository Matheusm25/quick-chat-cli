module.exports = toolbox => {
  async function chatInit({ chatId, socket, userId }) {
    const { sleep, prompt, print } = toolbox;

    socket.on('response', (response) => {
      print.info(`\n${response}\n`);
    })

    let message = {};
    while (message.message !== '\\q') {
      await sleep(300);
      message = await prompt.ask({type: 'text', name: 'message', message: ' ', edgeLength: 0});
      if (message.message !== '\\q') {
        socket.emit('message', {
          message: message.message,
          chatId,
          userId,
        });
      }
    }
  }   

  toolbox.chatInit = chatInit;
};