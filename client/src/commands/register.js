const Auth = require('../services/auth');

module.exports = {
  name: 'register',
  alias: ['reg'],
  run: async toolbox => {
    const {
      prompt,
      print,
    } = toolbox;

    // Log in 
    print.info('Please insert an username and password to register:');
    const { username, password} = await prompt.ask([
      { type: 'text', name: 'username', message: 'Username:'},
      { type: 'invisible', name: 'password', message: 'Password:'},
    ])

    await Auth.register(username, password);

    print.success('User registered');
  }
}
