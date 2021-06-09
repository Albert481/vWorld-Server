var Vector3 = require('./Vector3.js');
var Quaternion = require('./Quaternion.js');
var shortID = require('shortid');


module.exports = class Player {
    constructor() {
        this.type = "";
        this.id = shortID.generate();
        this.lobby = 0;
        this.username = "Default Player";
        this.position = new Vector3();
        this.rotation = new Quaternion();
    }

    displayPlayerInformation() {
        let player = this;
        return '(' + player.username + ':' + player.id + ')';
    }
}

