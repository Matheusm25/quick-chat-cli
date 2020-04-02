const express = require('express');

const UserController = require('./controllers/UserController')
const ChatController = require('./controllers/ChatController');

const routes = express.Router();

routes.post('/user', UserController.store);
routes.post('/login', UserController.create);
routes.post('/logoff', UserController.delete);

routes.post('/connect', ChatController.connectUser);

module.exports = routes;
