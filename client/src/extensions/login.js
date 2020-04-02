const Auth = require('../services/auth');

module.exports = toolbox => {
  async function login(socketId) {
    const {
      prompt,
      print,
    } = toolbox;

    print.info('Please insert your username and password to log in:');
    const { username, password} = await prompt.ask([
      { type: 'input', name: 'username', message: 'Username:'},
      { type: 'invisible', name: 'password', message: 'Password:'},
    ])

    const { userId } = await Auth.login(username, password, socketId);
    return userId;
  }   

  toolbox.login = login;
};