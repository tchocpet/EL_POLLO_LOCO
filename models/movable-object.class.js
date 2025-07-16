class MovableObject extends DrawableObject{
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2;
    lastHit = 0;

    /** ImageTextBar constructor */
    applyGravity() {
        let id = setStoppableInterval(() => {
            if (gameIsPaused) return;
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } else {
                this.speedY = 0;
                this.y = this.groundY;
            }
        }, 1000 / 25);
    }

    /** Check if movable object can move left  */
    moveRight() {
        this.x += this.speed;
    }

    /** Check if movable object can move left */
    moveLeft() {
        this.x -= this.speed;
    }
}