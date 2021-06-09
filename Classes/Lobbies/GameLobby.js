let LobbyBase = require('./LobbyBase');
let GameLobbySettings = require('./GameLobbySettings');
let Connection = require('../Connection');

module.exports = class GameLobby extends LobbyBase {
    constructor(id, settings = GameLobbySettings) {
        super(id);
        this.settings = settings;
    }

    onUpdate() {
        let lobby = this;
        
    }

    canEnterLobby(connection = Connection) {
        let lobby = this;
        let maxPlayerCount = lobby.settings.maxPlayers;
        let currentPlayerCount = lobby.connections.length;

        if (currentPlayerCount + 1 > maxPlayerCount) {
            return false;
        }

        return true;
    }

    onEnterLobby(connection = Connection) {
        let lobby = this;

        super.onEnterLobby(connection);

        lobby.addPlayer(connection);

        // Handle spawning of any server spawned objects here
        // Example: loot, flying bullets?
    }

    onLeaveLobby(connection = Connection) {
        let lobby = this;

        super.onLeaveLobby(connection);

        lobby.removePlayer(connection);

        // Handle unspawning of any server spawned objects here
        // Example: loot, flying bullets?
    }

    addPlayer(connection = Connection) {
        let lobby = this;
        let connections = lobby.connections;
        let socket = connection.socket;

        var returnData = {
            id: connection.player.id
        }

        socket.emit('spawnPlayer', returnData); // Tell myself I have spawned
        socket.broadcast.to(lobby.id).emit('spawnPlayer', returnData); // Tell others I have spawned

        // Tell myself about others else already in the lobby
        connections.forEach(c => {
            if (c.player.id != connection.player.id) {
                socket.emit('spawnPlayer', {
                    id: c.player.id
                });
            }
        })
    }

    removePlayer(connection = Connection) {
        let lobby = this;

        connection.socket.broadcast.to(lobby.id).emit('disconnected', {
            id: connection.player.id
        });
    }
}