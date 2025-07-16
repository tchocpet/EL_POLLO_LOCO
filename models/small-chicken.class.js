class SmallChicken extends CoolidableObject {
    y = 385;
    originY = 385;
    h = 60;
    w = 60;
    damage = 3;
    energy = 100;
    speed = 1;
    

    offset = {
        top: 10,
        left: 10,
        right: 10,
        bottom: 10  
    }

    IMAGES_WALKING =  [
        "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
        "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
        "img/3_enemies_chicken/chicken_small/1_walk/3_w.png"
    ];

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png',
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

    AUDIO_HURT = ASSERTS["audios"]["audio/small_chicken_hurt.wav"];

     /** Smallchicken constructor 
      * @param {String} name chicken name
      * @param {Nummber} x x value
      * @param {Nummber} speed chicken speed
     */
    constructor(name, x, speed) {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);

        this.x = x;
        this.speed = speed;
        this.name = name;
        this.animate();
        this.applyGravity();
    }

    /** Set Smallchicken in motion */
    animate() {
        
        setStoppableInterval(() => {
            if (gameIsPaused) return;
            this.moveLeft();
            if(!this.isAboveGround()) {
                this.jump();
            }
        }, 1000 / 60);

        setStoppableInterval(()=> {
            if (gameIsPaused) return;
            if(!this.energy) {
                this.playAnimation(this.IMAGES_DEAD);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 100);
    }

    /** Check if smallchicken can jump */
    canJump() {
        return !this.isAboveGround();
    }

    /** Smallchicken jumps */
    jump() {
        this.speedY = 15;
    }

    /** Check if smallchicken is above ground */
    isAboveGround() {
        return this.y < 385;
    }
}