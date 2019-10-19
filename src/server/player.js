const ObjectClass = require('./object');
const Bullet = require('./bullet');
const Constants = require('../shared/constants');

class Player extends ObjectClass {
    constructor(id, username, x, y, selectedScooter) {
        super(id, x, y, Math.random() * 2 * Math.PI, Constants.PLAYER_SPEED);
        this.username = username;
        this.hp = Constants.PLAYER_MAX_HP;
        this.fireCooldown = 0;
        this.score = 0;
        this.selectedScooter = selectedScooter;
        this.collision = false;
        this.endPowerUp = 0;
    }

    // Returns a newly created bullet, or null.
    update(dt) {
        super.update(dt);

        // Update score
        this.score += dt * Constants.SCORE_PER_SECOND;

        console.log(Date.now() - this.endPowerUp)

        if ( Date.now() - this.endPowerUp > 15000 ) {this.speed = Constants.PLAYER_SPEED}

        // Make sure the player stays in bounds

        if (this.x < 0) {
            this.x = 0;
        }
        if (this.y < 0) {
            this.y = 0;
        }
        if (this.x > Constants.MAP_WIDTH) {
            this.x = Constants.MAP_WIDTH;
        }
        if (this.y > Constants.MAP_HEIGHT) {
            this.y = Constants.MAP_HEIGHT;
        }


        return null;
    }

    takeBulletDamage() {
        this.hp -= Constants.BULLET_DAMAGE;
    }

    getPowerUp(type) {
        this.speed = Constants.PLAYER_SPEED * 3;
        this.endPowerUp = Date.now();
    }

    onDealtDamage() {
        this.score += Constants.SCORE_BULLET_HIT;
    }

    serializeForUpdate() {
        return {
            ...(super.serializeForUpdate()),
            direction: this.direction,
            hp: this.hp,
            selectedScooter: this.selectedScooter,
            collision: this.collision
        };
    }
}

module.exports = Player;
