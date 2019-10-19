class Object {
    constructor(id, x, y, dir, speed) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.direction = dir;
        this.speed = speed;
        this.locationHistory = [{x, y}, {x, y}, {x, y}];
        this.turnLeft = false;
        this.turnRight = false;
    }

    update(dt) {
        if (this.turnRight) {
            this.direction = this.direction + 1 / (4 * Math.PI);
        }

        if (this.turnLeft) {
            this.direction = this.direction - 1 / (4 * Math.PI);
        }

        this.x += dt * this.speed * Math.sin(this.direction);
        this.y -= dt * this.speed * Math.cos(this.direction);
        this.locationHistory.push({x: this.x, y: this.y});
    }

    distanceTo(object) {
        const dx = this.x - object.x;
        const dy = this.y - object.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    setDirection(dir) {
        if (dir === 'leftDown') {
            this.turnLeft = true;
        } else if (dir === 'rightDown') {
            this.turnRight = true;
        } else if (dir === 'leftUp') {
            this.turnLeft = false;
        } else if (dir === 'rightUp') {
            this.turnRight = false;
        }
    }

    serializeForUpdate() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            locationHistory: this.locationHistory.slice(this.locationHistory.length - 3, this.locationHistory.length - 1),
            fullHistory: this.locationHistory
        };
    }
}

module.exports = Object;
