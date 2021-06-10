// ws://127.0.0.1:52300/socket.io/?EIO=3&transport=websocket
// ws://vworld-server.herokuapp.com:80/socket.io/?EIO=3&transport=websocket

let io = require('socket.io')(process.env.PORT || 52300);
let Server = require('./Classes/Server.js');

console.log("Server has started, listening...")

if (process.env.PORT == undefined) {
    console.log('Local Server');
} else {
    console.log('Hosted Server');
}

let server = new Server(process.env.PORT == undefined);

setInterval(() => {
    server.onUpdate();
}, 100, 0);

io.on('connection', function(socket) {
    let connection = server.onConnected(socket);
    connection.createEvents();
    connection.socket.emit('registerPlayer', {'id': connection.player.id});
})