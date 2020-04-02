const Auth = require('../services/auth');
const readline = require('readline');

module.exports = toolbox => {
  async function login(socketId, rl) {
    return new Promise((resolve, reject) => {
      console.log('Please insert your username and password to log in: ');
      rl.question('Username: ', async username => {
        rl.question('Password: ', async password => {
          const { userId } = await Auth.login(username, password, socketId);
          resolve(userId);
        });
      });
    });
  }   

  toolbox.login = login;
};