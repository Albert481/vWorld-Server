let io = require('socket.io')(process.env.PORT || 52300);
let Server = require('./Classes/Server.js');

let server = new Server();

console.log("Server has started, listening...")

var players = [];
var sockets = [];

setInterval(() => {
    server.onUpdate();
}, 100, 0);

io.on('connection', function(socket) {
    let connection = server.onConnected(socket);
    connection.createEvents();
    connection.socket.emit('registerPlayer', {'id': connection.player.id});
})