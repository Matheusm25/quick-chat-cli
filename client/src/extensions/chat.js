module.exports = toolbox => {
  async function chatInit({ chatId, socket, userId, readline }) {
    const { sleep, plainPrompt, print } = toolbox;

    socket.on('response', (response) => {
      console.log(`\n > ${response}\n > `);
    })

    let message = {};
    while (message !== '\\q') {
      message = await plainPrompt(' > ', readline);
      if (message !== '\\q') {
        socket.emit('message', {
          message,
          chatId,
          userId,
        });
      }
    }
  }   

  toolbox.chatInit = chatInit;
};