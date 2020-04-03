module.exports = toolbox => {
  async function chatInit({
    chatId,
    socket,
    userId,
    readline,
  }) {
    const { plainPrompt } = toolbox;

    console.log('Send \\q to quit chat or press ctrl + c twice.');

    socket.on('response', response => {
      process.stdout.write(`\x1b[36m${response}\x1b[0m\n > `);
    });

    socket.on('disconnectUser', () => {
      console.log('\x1b[31mThe user has disconnect.\x1b[0m');
      process.exit();
    });

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
