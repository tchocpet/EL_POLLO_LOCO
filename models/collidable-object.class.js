class CoolidableObject extends MovableObject {
    collidable = true;
    intervalIDs = [];

    damage = 0;
    energy = 100;

    /** CoolidableObject constructor */
    constructor() {
        super();
    }

    /** Check if this object is colliding with another
     * @param {Object} mo another object that is colliding
    */
    isColliding(mo) {
        return this.x + this.w - this.offset.right > mo.x + mo.offset.left &&
            this.y + this.h - this.offset.bottom > mo.y + mo.offset.top &&
            this.x + this.offset.left < mo.x + mo.w - mo.offset.right &&
            this.y + this.offset.top < mo.y + mo.h - mo.offset.bottom;
    }

    /** When it is hit, it should take damage 
     * @param {Nummber} damage the damage it should take
    */
    hit(damage) {
        this.energy -= damage;
        if(this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = getTimestamp();
        }
    }

    /** When it is dead, reset energy */
    isDead() {
        return this.energy == 0;
    }

    /** Check if it is hurt */
    isHurt() {
        return getTimeElapsedInSecond(this.lastHit) < .5;
    }

    /** When it is dead, intervals should stop */
    destroySelf() {
        this.intervalIDs.forEach(clearInterval);
    }
}