const axios = require('axios');
const { print } = require('gluegun/print');

const apiLink = 'http://localhost:3333';

module.exports = {
  async register(username, password) {
    try {
      const { data } = await axios.post(`${apiLink}/user`, {
        username,
        password,
      });
    } catch (err) {
      print.error(err.response.data.error);
      process.exit();
    }
  },

  async login(username, password, socketId) {
    try {
      const { data } = await axios.post(`${apiLink}/login`, {
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
      const { data } = await axios.post(`${apiLink}/logoff`, {
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
      const { data } = await axios.post(`${apiLink}/connect`, {
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