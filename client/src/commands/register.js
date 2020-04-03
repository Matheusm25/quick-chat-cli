const readline = require('readline');
const Auth = require('../services/auth');

module.exports = {
  name: 'register',
  alias: ['reg'],
  run: async toolbox => {
    const {
      plainPrompt,
      print,
    } = toolbox;

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // Log in
    print.info('Please insert an username and password to register:');

    const username = await plainPrompt('Username: ', rl);
    const password = await plainPrompt('Password: ', rl);

    await Auth.register(username, password);

    print.success('User registered');

    process.exit();
  },
};
