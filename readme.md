# client CLI
> A cli project used to link with other user and send messages.

The idea came up through a college job where I would have to implement a way for two users to talk.

The first thing that came to my mind was the <span>socket.io<span> library. I made the server using the express along with websocket, and for the client I chose the gluegun library to make a CLI.

  ![](/assets/logo.png)

## Installation

Using npm:

```sh
$ npm install -g quick-chat-cli
```

or with yarn:

```sh
$ yarn global add quick-chat-cli
```

_make sure you have yarn or npm in your path._

## Usage 

## Register

First of all you will need an account. Registration is done using the command:

```sh
$ quick-chat-cli register
```

or for short syntax:

```sh
$ quick-chat-cli reg
```

then you must enter a username and a password, that's all you need to do to be ready to use!

![](/assets/register-example.png)

## Chatting

There is two paths to follow in here, you can make yourself available for chat by log in, or you can try contact someone whos already logged.

### Login

By log in the aplication you will be waiting for someone to ask for connect with you.

```
$ quick-chat-cli login
```

when other user try to connect with you, a message will apear asking for acceptance. If the answer is yes, the chat will begin.

![](/assets/login-example.png)

### Connecting

Using the connect command you will be asked the username of the person that you are tryng to contact. If the user is logged, he will receive a messagem asking if he wants to accept the chat.

```
$ quick-chat-cli connect
```

or for short syntax:

```
$ quick-chat-cli conn
```

![](/assets/connect-example.png)


## Credits

Matheus Marques – [@YourTwitter](https://twitter.com/dbader_org) – YourEmail@example.com

Distributed under the MIT license. See [``LICENSE``](https://github.com/Matheusm25/js-structure-builder/blob/master/LICENSE) for more information.

[https://github.com/matheusm25/quick-chat-cli](https://github.com/matheusm25/quick-chat-cli)