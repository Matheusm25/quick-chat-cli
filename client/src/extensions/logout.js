const Auth = require('../services/auth');

module.exports = toolbox => {
  async function logout(userId) {
    await Auth.logoff(userId);
  }   

  toolbox.logout = logout;
};