const ObjectClass = require('./object');
const Bullet = require('./bullet');
const Constants = require('../shared/constants');

class Player extends ObjectClass {
    constructor(id, username, x, y) {
        super(id, x, y, Math.random() * 2 * Math.PI, Constants.PLAYER_SPEED);
        this.username = username;
        this.hp = Constants.PLAYER_MAX_HP;
        this.fireCooldown = 0;
        this.score = 0;
    }

    // Returns a newly created bullet, or null.
    update(dt) {
        super.update(dt);

        // Update score
        this.score += dt * Constants.SCORE_PER_SECOND;

        // Make sure the player stays in bounds

        if(this.x < 0) {
            this.x = 0;
        }
        if(this.y < 0) {
            this.y = 0;
        }
        if(this.x > Constants.MAP_WIDTH) {
            this.x = Constants.MAP_WIDTH;
        }
        if(this.y > Constants.MAP_HEIGHT) {
            this.y = Constants.MAP_HEIGHT;
        }

        // Fire a bullet, if needed
        this.fireCooldown -= dt;
        if (this.fireCooldown <= 0) {
            this.fireCooldown += Constants.PLAYER_FIRE_COOLDOWN;
            return new Bullet(this.id, this.x, this.y, this.direction);
        }

        return null;
    }

    takeBulletDamage() {
        this.hp -= Constants.BULLET_DAMAGE;
    }

    onDealtDamage() {
        this.score += Constants.SCORE_BULLET_HIT;
    }

    serializeForUpdate() {
        return {
            ...(super.serializeForUpdate()),
            direction: this.direction,
            hp: this.hp
        };
    }
}

module.exports = Player;
