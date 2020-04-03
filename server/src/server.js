const express = require('express');
const cors = require('cors');

const ChatController = require('./controllers/ChatController');

const routes = require('./routes');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);


io.on('connection', ChatController.message);

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(process.env.PORT || 3333);
