class Object {
    constructor(id, x, y, dir, speed) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.direction = dir;
        this.speed = speed;
        this.locationHistory = [{x, y}];
<<<<<<< Updated upstream
=======
        // this.locationHistory = [{x: 1, y:1} , {x: 50, y:50}, {x: 150, y:50}];
        this.lastDirection = dir;
>>>>>>> Stashed changes
    }

    update(dt) {
        this.x += dt * this.speed * Math.sin(this.direction);
        this.y -= dt * this.speed * Math.cos(this.direction);
<<<<<<< Updated upstream
        this.locationHistory.push({x: this.x, y: this.y});
=======

        if(this.lastDirection !== this.direction) {
            this.locationHistory.push({x: this.x, y: this.y});
        }
        this.lastDirection = this.direction;
>>>>>>> Stashed changes
    }

    distanceTo(object) {
        const dx = this.x - object.x;
        const dy = this.y - object.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    setDirection(dir) {
        this.direction = dir;
    }

    serializeForUpdate() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            locationHistory: this.locationHistory
        };
    }
}

module.exports = Object;
