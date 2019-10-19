class Object {
    constructor(id, x, y, dir, speed) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.direction = dir;
        this.speed = speed;
        this.locationHistory = [{x, y}, {x,y}, {x,y}];
        this.lastDirection = dir;
        this.turnLeft = false;
        this.turnRight = false;
        this.lastSeenLocation = {x, y};
    }

    update(dt) {
        if(this.turnRight) {
          this.direction = this.direction + 1/(4*Math.PI)
        }

        if(this.turnLeft) {
          this.direction = this.direction - 1/(4*Math.PI)
        }

        this.x += dt * this.speed * Math.sin(this.direction);
        this.y -= dt * this.speed * Math.cos(this.direction);

        // if(this.lastDirection !== this.direction) {
        this.locationHistory.push({x: this.x, y: this.y});
        // }
        this.lastDirection = this.direction;
    }

    distanceTo(object) {
        const dx = this.x - object.x;
        const dy = this.y - object.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    setDirection(dir) {
        if (dir == 'leftDown') {
          this.turnLeft = true
        } else if (dir == 'rightDown') {
          this.turnRight = true
        } else if (dir == 'leftUp') {
          this.turnLeft = false
        } else if (dir == 'rightUp') {
          this.turnRight = false
        }
    }

    getLocationHistoryAfterLastSeenLocation(location) {
        var pos = this.locationHistory.find((value, index) => {
            if(value.x === location.x && value.y === location.y){
                return index;
            } else {
                return 0;
            }
        });
        return this.locationHistory.slice(pos, this.locationHistory.length - 1);
    }

    serializeForUpdate() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            // locationHistoryFull: this.getLocationHistoryAfterLastSeenLocation(this.lastSeenLocation),
            locationHistory: this.locationHistory.slice(this.locationHistory.length - 3, this.locationHistory.length - 1),
            // locationHistorySince
        };
    }
}

module.exports = Object;
