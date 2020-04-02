module.exports = toolbox => {
  async function chatInit(chatId, socket) {
    const { sleep, prompt } = toolbox;

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
  }   

  toolbox.chatInit = chatInit;
};