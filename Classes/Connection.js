module.exports = class Connection {
    constructor() {
        this.socket;
        this.player;
        this.server;
        this.lobby;
    }

    // Handles all our IO events and where we should route them to be handled
    createEvents() {
        let connection = this;
        let socket = connection.socket;
        let server = connection.server;
        let player = connection.player;

        socket.on('disconnect', function() {
            server.onDisconnected(connection);
            
        })

        socket.on('joinGame', function() {
            server.onAttemptToJoinGame(connection);
        })


        socket.on('updatePosition', function(data) {
            player.position.x = data.position.x;
            player.position.y = data.position.y;
            player.position.z = data.position.z;

            player.rotation.x = data.rotation.x;
            player.rotation.y = data.rotation.y;
            player.rotation.z = data.rotation.z;
            player.rotation.w = data.rotation.w;

            socket.broadcast.to(connection.lobby.id).emit('updatePosition', player);
        })

        socket.on('chatMessage', function(data) {
            console.log('broadcasting: ' + data);
            socket.emit('chatMessage', data);
        })
    }
}