class Character extends CoolidableObject{
    x = 0;
    w = 100;
    h = 280;
    y = 0;
    groundY = 156;
    world;
    speed = 10;
    isShooting = false;

    offset = {
        top: 110,
        left: 20,
        right: 30,
        bottom: 15
    }

    bottleCount = 0;
    coinCount = 0;
    idleTimer = 0;
    maxIdleCount = 400;


    IMAGE_ORIGIN = "img/2_character_pepe/2_walk/W-21.png";

    IMAGES_IDLE = [
        "img/2_character_pepe/1_idle/idle/I-1.png",
        "img/2_character_pepe/1_idle/idle/I-2.png",
        "img/2_character_pepe/1_idle/idle/I-3.png",
        "img/2_character_pepe/1_idle/idle/I-4.png",
        "img/2_character_pepe/1_idle/idle/I-5.png",
        "img/2_character_pepe/1_idle/idle/I-6.png",
        "img/2_character_pepe/1_idle/idle/I-7.png",
        "img/2_character_pepe/1_idle/idle/I-8.png",
        "img/2_character_pepe/1_idle/idle/I-9.png",
        "img/2_character_pepe/1_idle/idle/I-10.png",
    ];

    IMAGES_LONG_IDLE = [
        "img/2_character_pepe/1_idle/long_idle/I-11.png",
        "img/2_character_pepe/1_idle/long_idle/I-12.png",
        "img/2_character_pepe/1_idle/long_idle/I-13.png",
        "img/2_character_pepe/1_idle/long_idle/I-14.png",
        "img/2_character_pepe/1_idle/long_idle/I-15.png",
        "img/2_character_pepe/1_idle/long_idle/I-16.png",
        "img/2_character_pepe/1_idle/long_idle/I-17.png",
        "img/2_character_pepe/1_idle/long_idle/I-18.png",
        "img/2_character_pepe/1_idle/long_idle/I-19.png",
        "img/2_character_pepe/1_idle/long_idle/I-20.png",
       
    ];

    IMAGES_THROWING = [
        "img/2_character_pepe/2_walk/W-21.png",
        "img/2_character_pepe/2_walk/W-22.png",
    ]

    IMAGES_WALKING = [
        "img/2_character_pepe/2_walk/W-21.png",
        "img/2_character_pepe/2_walk/W-22.png",
        "img/2_character_pepe/2_walk/W-23.png",
        "img/2_character_pepe/2_walk/W-24.png",
        "img/2_character_pepe/2_walk/W-25.png",
        "img/2_character_pepe/2_walk/W-26.png"
    ];

    IMAGES_JUMPING = [
        "img/2_character_pepe/3_jump/J-31.png",
        "img/2_character_pepe/3_jump/J-32.png",
        "img/2_character_pepe/3_jump/J-33.png",
        "img/2_character_pepe/3_jump/J-34.png",
        "img/2_character_pepe/3_jump/J-35.png",
        "img/2_character_pepe/3_jump/J-36.png",
        "img/2_character_pepe/3_jump/J-37.png",
        "img/2_character_pepe/3_jump/J-38.png",
        "img/2_character_pepe/3_jump/J-39.png",
    ];

    IMAGES_DEAD = [
        "img/2_character_pepe/5_dead/D-52.png",
        "img/2_character_pepe/5_dead/D-53.png",
        "img/2_character_pepe/5_dead/D-54.png",
        "img/2_character_pepe/5_dead/D-55.png",
        "img/2_character_pepe/5_dead/D-56.png",
        "img/2_character_pepe/5_dead/D-57.png"
    ];

    IMAGES_HURT = [
        "img/2_character_pepe/4_hurt/H-41.png",
        "img/2_character_pepe/4_hurt/H-42.png",
        "img/2_character_pepe/4_hurt/H-43.png"
    ];

    AUDIO_WALKING = ASSERTS["audios"]["audio/running.wav"];
    AUDIO_THROWING = ASSERTS["audios"]["audio/bottle_throw.mp3"];
    AUDIO_JUMPING = ASSERTS["audios"]["audio/jump.wav"];
    AUDIO_HURT = ASSERTS["audios"]["audio/hurt.mp3"];
    AUDIO_BOTTLE_COLLECTING = ASSERTS["audios"]["audio/bottle_collect.wav"];
    AUDIO_COIN_COLLECTING = ASSERTS["audios"]["audio/coin.mp3"];
    AUDIO_DEAD = ASSERTS["audios"]["audio/dead.wav"];

    /** BackgroundObject Contructor */
    constructor() {
        super().loadImage(this.IMAGE_ORIGIN);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        
        this.animate();
        this.applyGravity();
    }

    /** Check if character can move right */
    canMoveRight() {
        return this.world.kb.RIGHT && this.x < LEVEL_1_END_X && !this.isDead() && !gameIsPaused;
    }

    /** Check if character can move left */
    canMoveLeft() {
        return this.world.kb.LEFT && this.x > 0 && !this.isDead() && !gameIsPaused;;
    }

    /** Check if character can move jump */
    canJump() {
        return this.world.kb.SPACE && !this.isAboveGround() && !this.isDead() && !gameIsPaused;
    }

    /** Check if character is shooting */
    shooting() {
        if (gameIsPaused) return;
        this.isShooting = true;
        this.loadImage(this.IMAGE_ORIGIN);
    }

    /** Handle character moving */
    moveCharacter() {
        if (this.canMoveRight()) {
            this.moveRight();
            this.otherDirection = false;
        }
        if (this.canMoveLeft()) {
            this.moveLeft();
            this.otherDirection = true;
        }
        if (this.canJump()) {
            this.audioPlay(this.AUDIO_JUMPING);
            this.jump(20);
        }
        this.world.camera_x = -this.x + 100;
    }


    /** Handle character animation */
    animateCharacter() {
        if (gameIsPaused) return;
        this.setTimer();

        if (this.shouldDie()) return;
        if (this.shouldReactToHurt()) return;
        if (this.shouldJump()) return;
        if (this.shouldShoot()) return;

        this.handleIdleOrWalk();
    }

    /**  Handles death logic and triggers the game over sequence */
    shouldDie() {
        if (this.isDead()) {
            this.audioPlay(this.AUDIO_DEAD);
            this.playAnimation(this.IMAGES_DEAD);
            setTimeout(() => stopGame(false), 500); 
            return true;
        }
        return false;
    }

     /**  Triggers hurt animation and sound if the character is hit */
    shouldReactToHurt() {
        if (this.isHurt()) {
            this.audioPlay(this.AUDIO_HURT);
            this.playAnimation(this.IMAGES_HURT); 
            return true;
        }
        return false;
    }

     /**  Plays jumping animation if the character is above the ground */
    shouldJump() {
        if (this.isAboveGround()) {
            this.playAnimation(this.IMAGES_JUMPING); 
            return true;
        }
        return false;
    }

     /**  Triggers shooting animation if the character is shooting */
    shouldShoot() {
        if (this.isShooting) {
            this.playAnimation(this.IMAGES_THROWING); 
            return true;
        }
        return false;
    }

    /**  Chooses between walking, idle, or long idle animations */
    handleIdleOrWalk() {
        if (this.isWalking()) {
            this.audioPlay(this.AUDIO_WALKING); 
            this.playAnimation(this.IMAGES_WALKING); 
        } else if (this.idleTimer > this.maxIdleCount) {
            this.playAnimation(this.IMAGES_LONG_IDLE);
        } else {
            this.playAnimation(this.IMAGES_IDLE);
        }
    }

     /** Animate the character */
    animate() {
        setStoppableInterval(()=>{
            this.moveCharacter();
        }, 1000/60);

        setStoppableInterval(()=>{
            this.animateCharacter();
        }, 100);
    }

    /** Set vertical speed to simulate jumping 
     * @param {Nummber} speedY how fast it should jump
    */
    jump(speedY) {
        this.speedY = speedY;
    }

    /** Check if player is pressing left or right key */
    isWalking() {
        return this.world.kb.RIGHT || this.world.kb.LEFT;
    }

    /** Detect if falling from above onto another object (mo) */
    isFallingUpon() {
        return this.speedY < 0;
    }

    /** Track player idle time for triggering long idle animations */
    setTimer() {
        if (!this.world.kb.RIGHT && !this.world.kb.LEFT && !this.isAboveGround() && !this.isShooting) {
            this.idleTimer += 10;
        } else {
            this.idleTimer = 0;
        }
    }

    /** Check if charater is above around */
    isAboveGround() {
        return this.y < 140;
    }
}