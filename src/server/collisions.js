const Constants = require('../shared/constants');

// Returns an array of powerUps to be destroyed.
function applyCollisions(players, powerUps) {
    const destroyedPowerUps = [];
    for (let i = 0; i < powerUps.length; i++) {
        // Look for a player (who didn't create the bullet) to collide each bullet with.
        // As soon as we find one, break out of the loop to prevent double counting a bullet.
        for (let j = 0; j < players.length; j++) {
            const powerUp = powerUps[i];
            const player = players[j];
            if (player.distanceTo(powerUp) <= Constants.PLAYER_RADIUS + Constants.BULLET_RADIUS) {
                destroyedPowerUps.push(powerUp);
                player.getPowerUp();
                break;
            }
        }
    }
    return destroyedPowerUps;
}

module.exports = applyCollisions;
