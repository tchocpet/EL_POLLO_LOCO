class DrawableObject {
    x = 0;
    y = 0;
    w = 100;
    h = 150;
    img;
    imgCache = {};
    currentImage = 0;

    offset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    }

    /** Load image */
    loadImage(path) {
        if (ASSERTS["images"]) {
            this.img = ASSERTS["images"][path];
        }
        
       
    }

    /** Draw Image on the canvas */
    draw(ctx) {
        try {
            if (this instanceof Character) {
                ctx.save();
                this.drawShadow(ctx);
                ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
                ctx.restore();
            } else {
                ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
                
            }   
        } catch (e) {
            console.warn("Error loading image", e);
            console.log("Current Obj:", this);
            console.log("Could not load image:", this.img.src);
        }
    }

    /** Draw frame of objects if needed 
     * @param {CanvasRenderingContext2D} ctx context of canvas
    */
    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof SmallChicken || this instanceof Coin || this instanceof ImageTextBar || this instanceof GroundBottle || this instanceof ThrowableObject || this instanceof EndBoss) {
            ctx.beginPath();
            ctx.lineWidth = "5";
            ctx.strokeStyle = "blue";
            ctx.rect(this.x, this.y, this.w, this.h);
            ctx.stroke();

            this.drawFrameWithOffset(ctx);
        }
    }

    /** Draw frame with offset of objects if needed 
     * @param {CanvasRenderingContext2D} ctx context of canvas
    */
    drawFrameWithOffset(ctx) {
        ctx.beginPath();
        ctx.lineWidth = "2";
        ctx.strokeStyle = "red";
        ctx.rect(this.x + this.offset.left, this.y + this.offset.top, this.w - this.offset.right - this.offset.left, this.h - this.offset.bottom - this.offset.top);
        ctx.stroke();
    }

    /** Draw shadow of objects if needed 
     * @param {CanvasRenderingContext2D} ctx context of canvas
    */
    drawShadow(ctx) {
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 20;
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 20;
    }

    /** Load all images when there are mutiple 
     * @param {Array} arr all image assert array
    */
    loadImages(arr){
        arr.forEach(path => {
            if (ASSERTS["images"]) {
                this.imgCache[path] = ASSERTS["images"][path];
            }
        });
    }

    /** Show animation 
     * @param {Array} imgs image path array
    */
    playAnimation(imgs) {
        let i = this.currentImage % imgs.length;
        let path = imgs[i];
        this.img = this.imgCache[path];
        this.currentImage++;

    }

    /** Play audio 
     * @param {Audio} audioElement which audio should be played
    */
    audioPlay(audioElement) {
        audioElement.play();
       
    }
}