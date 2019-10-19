class Object {
    constructor(id, x, y, dir, speed) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.direction = dir;
        this.speed = speed;
        this.locationHistory = [{x, y}];
        this.lastDirection = dir;
    }

    update(dt) {
        this.x += dt * this.speed * Math.sin(this.direction);
        this.y -= dt * this.speed * Math.cos(this.direction);

        if(this.lastDirection !== this.direction) {
            this.locationHistory.push({x: this.x, y: this.y});
        }
        this.lastDirection = this.direction;
    }

    distanceTo(object) {
        const dx = this.x - object.x;
        const dy = this.y - object.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    setDirection(dir) {
        this.direction = this.direction + dir;
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
