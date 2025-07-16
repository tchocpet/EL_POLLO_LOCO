class World {

    requestAnimationFrameID;

    character = new Character();
    statusBar = new StatusBar();
    endBossStatusBar = new EndBossStatusBar();
    imageTextBarBottle = new ImageTextBarBottle(10, 60, 80, 50, SALSA_BOTTLE_PATH);
    imageTextBarCoin = new ImageTextBarCoin(100, 32, 110, 110, COIN_PATH);
    throwableObjects = [];
    
    level = LEVEL1;
    enemiesToRemove = [];
    bottlesToRemove = [];

    ctx;
    canvas;
    kb;
    camera_x = 0;
    isCollected = false;
    colltedBottleCount = 0;

    /** World constructor 
     * @param {HTMLCanvasElement} canvas - The HTML canvas element where the game is rendered.
     * @param {Object} kb - The keyboard input handler object used
    */
    constructor(canvas, kb) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.kb = kb;
        this.draw();
        this.setWorld();
        this.gaming();
    }

    /** Set world property to character and endboss */
    setWorld() {
        this.character.world = this;
        this.level.endBoss.world = this;
    }

    /** Draw function, to call drawall objcts */
    draw() {
        if (this.level) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.translate(this.camera_x, 0);
            this.drawAllObject();
            this.ctx.translate(-this.camera_x, 0);
            this.requrestAnimation();
        }
    }

    /** Add all objects to map */
    drawAllObject() {
        this.addObjectsToMap(this.level.backgroundObjects);
        
        this.addObjectsToMap(this.level.clouds);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addToMap(this.level.endBoss);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.groundBottles);
        this.addObjectsToMap(this.throwableObjects);
        this.drawFixedObjects();
    }
    
    /** Request animation frame */
    requrestAnimation() {
        currentAnimationFrameID = requestAnimationFrame(()=> {
            this.draw();
        });
    }

    /** Draw all fixed obcjtes */
    drawFixedObjects() {
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusBar);
        
        if (this.endBossStatusBar.isShowable) this.addToMap(this.endBossStatusBar);
        this.addToMap(this.imageTextBarBottle);
        this.addToMap(this.imageTextBarCoin);
        this.ctx.translate(this.camera_x, 0);

    }

    /** In this function, add to map will be called 
     * @param {Array} objects all object to be drawn
    */
    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });    
    }

    /** In this function, draw function will be called 
     * * @param {Object} mo one object to be drawn
    */
    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }

        mo.draw(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    /** In this function, canvas will be flipped 
     *   @param {Object} mo one object to be flipped
    */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.w, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

     /** In this function, canvas will be flipped back 
      * @param {Object} mo one object to be flipped back
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

     /** Start game */
    gaming(){
        this.checkingAnyChange();
    }

     /** Start interval to check page changes */
    checkingAnyChange() {
        setStoppableInterval(() => {
            this.checkCharacterWithEnemies();
            this.checkCharacterWithEndBoss();
            this.checkCharacterWithCollectable(this.level.coins, this.imageTextBarCoin);
            this.checkCharacterWithCollectable(this.level.groundBottles, this.imageTextBarBottle);
            this.checkThrowObjectWithEnemies();
            this.checkThrowObjectWithEndBoss();
            this.checkThrowableObjectWithGround();
        }, 100);
    }

    /** Check if character hit chicken */
    checkCharacterWithEnemies() {
        for (let index = 0; index < this.level.enemies.length; index++) {
            const enemy = this.level.enemies[index];
            if (this.character.isColliding(enemy) && this.character.isFallingUpon(enemy)) {
                enemy.audioPlay(enemy.AUDIO_HURT);
                this.removeEnemy(enemy);
                enemy.damage = 0;
                this.character.jump(10);     

            } else if( this.character.isColliding(enemy) && enemy.damage){
                this.setCharacterEnery(enemy.damage);
            }
        }
    }

    /** Check if character hit endboss */
    checkCharacterWithEndBoss() {
        if (this.character.isColliding(this.level.endBoss)) {
            this.level.endBoss.isAttacking = true;
            this.setCharacterEnery(this.level.endBoss.damage);
        }
    }

     /** When character hit 
      * @param {Nummber} damage it will take damage, statusbar will also change 
     */
    setCharacterEnery(damage){
        this.character.hit(damage);
        this.statusBar.setPercentage(this.character.energy);
    }

    /** Set endboss energy 
     *  * @param {Nummber} damage it will take damage, statusbar will also change 
    */
    setEndBossEnergy(damage){
        this.level.endBoss.takeDamage(damage);
        this.endBossStatusBar.setPercentage(this.level.endBoss.energy);
    }
       
    
    /** Check if character hit bottles on ground or coins 
     * @param {Array} arr bottle array
     * @param {ImageTextBar} arr which text will change
    */
    checkCharacterWithCollectable(arr, imgTextBar) {
        for (let index = 0; index < arr.length; index++) {
            const collectable = arr[index];
            if (this.character.isColliding(collectable) ) {
                imgTextBar.text += 1;
                imgTextBar.jump();
                if(collectable instanceof GroundBottle) {
                    this.colltedBottleCount ++;
                    this.character.audioPlay(this.character.AUDIO_BOTTLE_COLLECTING);
                } else {
                    this.character.audioPlay(this.character.AUDIO_COIN_COLLECTING);
                }
                collectable.destroySelf();
                arr.splice(index, 1);
                index --;  
            }
        }
    }

    /** When character clicks J */
    characterShoot() {
        this.character.shooting();
        if(this.colltedBottleCount <= 0) return;

        this.character.audioPlay(this.character.AUDIO_THROWING);
        this.imageTextBarBottle.text = --this.colltedBottleCount;

        this.playBottleAnimation();
    }

    /** Show bottle on canvas */
    playBottleAnimation(){
        let speedDirection = 1;
        let x = this.character.x + this.character.w - this.character.offset.right;
        if (this.character.otherDirection)  {
            speedDirection = -1;
            x = this.character.x + this.character.offset.left;
        }

        let bottole = new ThrowableObject(x, this.character.y + this.character.offset.top, speedDirection);
        this.throwableObjects.push(bottole);
    }
    
    /** Check if bottle hits chicken */
    checkThrowObjectWithEnemies() {
        for (let i = 0; i < this.throwableObjects.length; i++) {
            const bottle = this.throwableObjects[i];
             for (let j = 0; j < this.level.enemies.length; j++) {
                const enemy = this.level.enemies[j];
                if (bottle.isColliding(enemy)) {
                    bottle.audioPlay(bottle.AUDIO_BROKEN);
                    enemy.audioPlay(enemy.AUDIO_HURT);
                    this.removeBottles(bottle);
                    this.removeEnemy(enemy);
                }
             }
        }
    }

    /** Check if bottle hits endboss */
    checkThrowObjectWithEndBoss() {
        for (let i = 0; i < this.throwableObjects.length; i++) {
            const bottle = this.throwableObjects[i];
            if (bottle.isColliding(this.level.endBoss)) {
                
                this.level.endBoss.audioPlay(this.level.endBoss.AUDIO_HURT);
                this.removeBottles(bottle);
                this.setEndBossEnergy(bottle.damage, bottle);
            }
        }
    }

    /** Check if bottle hits ground */
    checkThrowableObjectWithGround() {
        for (let index = 0; index < this.throwableObjects.length; index++) {
            let bottle = this.throwableObjects[index];
            if ((!bottle.isAboveGround()) ) {
                bottle.audioPlay(bottle.AUDIO_BROKEN);
                this.removeBottles(bottle);
            }
        }
    }

     /**  Remove enemies from canvas 
      * @param {Array} enemy enemies to be removed
     */
    removeEnemy(enemy) {
        enemy.energy = 0;

        setPushToArrayTimeout300(() => {
            enemy.destroySelf();
            this.enemiesToRemove.push(enemy);
        });
        setRemoveFromArraryTimeout310(() => this.level.enemies = this.level.enemies.filter(e => !this.enemiesToRemove.includes(e)));
    }

    /**  Remove bottole from canvas
     *  @param {ThrowableObject} bottle bottles to be removed
     */
    removeBottles(bottle) {
        bottle.enemyTouche();
        bottle.speed = 0;

        setPushToArrayTimeout300(() => {
            bottle.destroySelf();
            this.bottlesToRemove.push(bottle);
        });
        setRemoveFromArraryTimeout310(() => this.throwableObjects = this.throwableObjects.filter(b => !this.bottlesToRemove.includes(b)));
    }
}