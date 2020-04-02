const axios = require('axios');
const { print } = require('gluegun/print');

module.exports = {
  async login(username, password, socketId) {
    try {
      const { data } = await axios.post('http://localhost:3333/login', {
        username,
        password,
        socketId,
      });
  
      return data;
    } catch (err) {
      print.error(err.response.data.error);
      process.exit();
    }
  },

  async logoff(userId) {
    try {
      const { data } = await axios.post('http://localhost:3333/logoff', {
        userId,
      });
  
      return data;
    } catch (err) {
      print.error(err.response.data.error);
      process.exit();
    }
  },

  async connectTo(userId, userToName) {
    try {
      const { data } = await axios.post('http://localhost:3333/connect', {
        userId,
        userToName,
      });
  
      return data;
    } catch (err) {
      print.error(err.response.data.error);
      process.exit();
    }
  }
}