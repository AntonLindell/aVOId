const Constants = require('../shared/constants');
const Player = require('./player');
const PowerUp = require('./powerup');
const applyCollisions = require('./collisions');

class Game {
    constructor() {
        this.sockets = {};
        this.players = {};
        this.powerUps = [];
        this.lastUpdateTime = Date.now();
        this.shouldSendUpdate = false;
        setInterval(this.update.bind(this), 1000 / 60);
    }

    addPlayer(socket, username, selectedScooter) {
        this.sockets[socket.id] = socket;

        // Generate a position to start this player at.
        const x = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
        const y = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
        this.players[socket.id] = new Player(socket.id, username, x, y, selectedScooter);
    }

    removePlayer(socket) {
        delete this.sockets[socket.id];
        delete this.players[socket.id];
    }

    handleInput(socket, dir) {
        if (this.players[socket.id]) {
            this.players[socket.id].setDirection(dir);
        }
    }

    isCollidingPlayer() {

    }

    checkCollision() {
        // for
        const margin = 2;
        var otherPlayers;
        var player1x;
        var player1y;
        var player2x;
        var player2y;
        var locationHistory;
        var ownLocationHistory;

      Object.keys(this.players).forEach(playerId => {
            otherPlayers = Object.values(this.players).filter(p => p !== this.players[playerId]);
            player1x = this.players[playerId].x;
            player1y = this.players[playerId].y;
            ownLocationHistory = this.players[playerId].locationHistory;
            Object.keys(otherPlayers).forEach(otherPlayerId => {
                //gå igenom locationHistory för varje spelare
                locationHistory = otherPlayers[otherPlayerId].locationHistory;

                if(ownLocationHistory.length > 20) {
                  // locationHistory.push(ownLocationHistory.slice(0,Math.max(ownLocationHistory.length - 20, 0)));
                }
                locationHistory.forEach((location) => {
                    player2x = location.x;
                    player2y = location.y;

                    if((player1x > player2x - margin && player1x < player2x + margin) && (player1y > player2y - margin && player1y < player2y + margin)) {
                        console.log("collision from " + this.players[playerId].username + " with " + otherPlayers[otherPlayerId].username);

                      this.players[playerId].hp = 0;
                        // this.sockets[playerId].emit(Constants.MSG_TYPES.GAME_OVER);
                        // this.removePlayer(this.sockets[playerId]);
                    }
                });
            });
        });
    }

    update() {
        // Calculate time elapsed
        const now = Date.now();
        const dt = (now - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = now;
        this.checkCollision();

        // Update each powerup
        const powerUpsToRemove = [];
        this.powerUps.forEach(powerUp => {
            if (powerUp.update(dt)) {
                // Destroy this bullet
              powerUpsToRemove.push(powerUp);
                }
        });
        this.powerUps = this.powerUps.filter(powerUp => !powerUpsToRemove.includes(powerUp));

        // Update each player
        Object.keys(this.sockets).forEach(playerID => {
            const player = this.players[playerID];
            player.update(dt);
        });

        // randomly insert a powerup
        if ( Math.random() > 0.99) {
            const newPowerUp = new PowerUp('speed', Math.random()*Constants.MAP_HEIGHT, Math.random() * Constants.MAP_WIDTH, 0);
            this.powerUps.push(newPowerUp)
        }

        // Apply collisions, give players score for hitting powerUps
        const destroyedPowerUps = applyCollisions(Object.values(this.players), this.powerUps);
        this.powerUps = this.powerUps.filter(powerup => !destroyedPowerUps.includes(powerup));
        // randomly insert a powerup
        if (Math.random() > 0.99) {
            const newPowerUp = new PowerUp('speed', Math.random() * Constants.MAP_HEIGHT, Math.random() * Constants.MAP_WIDTH, 0);
            this.powerUps.push(newPowerUp);
        }

        // Check if any players are dead
        Object.keys(this.sockets).forEach(playerID => {
            const socket = this.sockets[playerID];
            const player = this.players[playerID];
            if (player.hp <= 0) {
                socket.emit(Constants.MSG_TYPES.GAME_OVER);
                this.removePlayer(socket);
            }
        });

        // Send a game update to each player every other time
        if (this.shouldSendUpdate) {
            const leaderboard = this.getLeaderboard();
            Object.keys(this.sockets).forEach(playerID => {
                const socket = this.sockets[playerID];
                const player = this.players[playerID];
                socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate(player, leaderboard));
            });
            this.shouldSendUpdate = false;
        } else {
            this.shouldSendUpdate = true;
        }
    }

    getLeaderboard() {
        return Object.values(this.players)
        .sort((p1, p2) => p2.score - p1.score)
        .slice(0, 5)
        .map(p => ({username: p.username, score: Math.round(p.score)}));
    }

    createUpdate(player, leaderboard) {
        const nearbyPlayers = Object.values(this.players).filter(p => p !== player);

        return {
            t: Date.now(),
            me: player.serializeForUpdate(),
            others: nearbyPlayers.map(p => p.serializeForUpdate()),
            powerUps: this.powerUps.map(b => b.serializeForUpdate()),
            leaderboard
        };
    }
}

module.exports = Game;
