class EndBoss extends CoolidableObject {
    x = LEVEL_1_END_X + 400;
    y = 90;
    h = 350;
    w = 220;
    
    world;

    speed = 4;
    damage = 100;
    alertCount = 999;

    isAlert = false;
    isAttacking = false;
    canTakeDamage = true;

    offset = {
        top: 100,
        left: 45,
        right: 40,
        bottom: 20
    }

    IMAGES_ALERT = [
        "img/4_enemie_boss_chicken/2_alert/G5.png",
        "img/4_enemie_boss_chicken/2_alert/G6.png",
        "img/4_enemie_boss_chicken/2_alert/G7.png",
        "img/4_enemie_boss_chicken/2_alert/G8.png",
        "img/4_enemie_boss_chicken/2_alert/G9.png",
        "img/4_enemie_boss_chicken/2_alert/G10.png",
        "img/4_enemie_boss_chicken/2_alert/G11.png",
        "img/4_enemie_boss_chicken/2_alert/G12.png",
    ];

    IMAGES_WALKING = [
        "img/4_enemie_boss_chicken/1_walk/G1.png",
        "img/4_enemie_boss_chicken/1_walk/G2.png",
        "img/4_enemie_boss_chicken/1_walk/G3.png",
        "img/4_enemie_boss_chicken/1_walk/G4.png"
    ];

    IMAGES_DEAD = [
        "img/4_enemie_boss_chicken/5_dead/G24.png",
        "img/4_enemie_boss_chicken/5_dead/G25.png",
        "img/4_enemie_boss_chicken/5_dead/G26.png",
    ];

    IMAGES_HURT = [
        "img/4_enemie_boss_chicken/4_hurt/G21.png",
        "img/4_enemie_boss_chicken/4_hurt/G21.png",
        "img/4_enemie_boss_chicken/4_hurt/G23.png",
    ];

    IMAGES_ATTACKING = [
        "img/4_enemie_boss_chicken/3_attack/G13.png",
        "img/4_enemie_boss_chicken/3_attack/G14.png",
        "img/4_enemie_boss_chicken/3_attack/G15.png",
        "img/4_enemie_boss_chicken/3_attack/G16.png",
        "img/4_enemie_boss_chicken/3_attack/G17.png",
        "img/4_enemie_boss_chicken/3_attack/G18.png",
        "img/4_enemie_boss_chicken/3_attack/G19.png",
        "img/4_enemie_boss_chicken/3_attack/G20.png"
    ];

    AUDIO_HURT = ASSERTS["audios"]["audio/chicken_hurt.mp3"];
    AUDIO_DEAD = ASSERTS["audios"]["audio/boss_dead.mp3"];
    AUDIO_SPAWNING = ASSERTS["audios"]["audio/boss_intro_sound.mp3"];

    /** End boss constructor */
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_ATTACKING);
        this.loadImages(this.IMAGES_DEAD);
        this.animate();
    }

    /** End boss constructor */
    animate() {
        setStoppableInterval(()=>{
            this.moveCharacter();
        }, 1000/60);

        setStoppableInterval(()=>{
            this.animateCharacter();
        }, 100);
    }

    /** Move endBoss */
    moveCharacter() {
        if (gameIsPaused) return;
        if (this.canMoveLeft()) {
            this.moveLeft();
        }
    }
    
    /** Set endBoss in motion */
    animateCharacter() {
        if (gameIsPaused) return;
        if (this.alertCount < 16) {
            this.playAnimation(this.IMAGES_ALERT);
            this.audioPlay(this.AUDIO_SPAWNING);
        } else {
            if(!this.canTakeDamage) {
                this.playAnimation(this.IMAGES_ATTACKING);
            } else if(this.isDead()){
                handleDead();
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        } 
        this.setAlertStatus();
    }

    /** the end boss is dead */
    handleDead() {
        this.audioPlay(this.AUDIO_DEAD);
        this.playAnimation(this.IMAGES_DEAD);
        setTimeout(() => {
            stopGame(true);
        }, 1000);
    }

    /** When endboss is alert */
    setAlertStatus() {
        this.alertCount ++; 
        if(this.world) {
            if ((this.world.character.x > this.world.level.level_end_x - 100) && !this.isAlert) {
                this.alertCount = 0;
                this.isAlert = true;
                
                this.world.endBossStatusBar.isShowable = true;
            }
        }
    }

     /** Check if Endboss can move left */
    canMoveLeft() {
        return this.alertCount > 16 && this.isAlert && !this.isDead() && !gameIsPaused;
    }

    /**
     * when endboss is hit
     * @param {Nummber} damage how much damage
     * @returns 
     */
    takeDamage(damage) {
        if (!this.canTakeDamage) return;

        this.energy -= damage;
        this.canTakeDamage = false;

        if(this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = getTimestamp();
        }

        setTimeout(() => {
            this.canTakeDamage = true;
        }, 1500); 
    }

}