const CryptoJS = require('crypto-js');

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
      const decryptedBytes = CryptoJS.AES.decrypt(response, socket.id);
      const decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8);
      process.stdout.write(`\x1b[36m${decryptedMessage}\x1b[0m\n > `);
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
          message: CryptoJS.AES.encrypt(message, socket.id).toString(),
          chatId,
          userId,
        });
      }
    }
  }

  toolbox.chatInit = chatInit;
};
