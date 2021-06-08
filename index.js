var io = require('socket.io')(process.env.PORT || 52300);

// Custom Classes
var Player = require('./Classes/Player.js');

var players = [];
var sockets = [];

io.on('connection', function(socket) {
    console.log('Socket IO listening..');

    var player = new Player();
    var thisPlayerID = player.id;

    players[thisPlayerID] = player;
    sockets[thisPlayerID] = socket;

    // Tell the client that this is our id for the server
    socket.emit('registerPlayer', {id: thisPlayerID});
    // Tell myself I have spawned
    socket.emit('spawnPlayer', player);
    // Tell others I have spawned
    socket.broadcast.emit('spawnPlayer', player);

    // Tell myself about everyone else in the game (Show other prefabs when I join)
    for (var playerID in players) {
        if (playerID != thisPlayerID) {
            socket.emit('spawn', players[playerID])
        }
    }

    // Positional Data from Client
    socket.on('updatePosition', function(data) {
        player.position.x = data.position.x;
        player.position.y = data.position.y;
        player.position.z = data.position.z;

        player.rotation.x = data.rotation.x;
        player.rotation.y = data.rotation.y;
        player.rotation.z = data.rotation.z;
        player.rotation.w = data.rotation.w;

        socket.broadcast.emit('updatePosition', player);
    });

    socket.on('disconnect', function() {
        console.log('Client disconnected');
        delete players[thisPlayerID];
        delete sockets[thisPlayerID];
        socket.broadcast.emit('disconnected', player);
    })

})