class  ImageTextBar extends DrawableObject{
 
    text = 0;
    radius = 22;

    circleX = 0;
    circleY = 0;

    textX1 = 0;
    textX2 = 0;
    textY = 0;

    jumpCount = 0;
    lastJumpIntervalId;

    speedY = 2;
    yDirection = 1;
    originalY = 93;
    jumpY = 85;

    /** ImageTextBar constructor 
     * @param {Nummber} x x value
     * @param {Nummber} y y value
     * @param {Nummber} w width value
     * @param {Nummber} h height value
     * @param {String} path url 
    */
    constructor(x, y, w, h, path) {
        super();
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.loadImage(path);
    }

    /** Draw ImageTextBar 
     * @param {CanvasRenderingContext2D} ctx context of canvaes
    */
    draw(ctx) {
        try {
            ctx.save();
            ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
            this.drawCirle(ctx);
            this.drawText(ctx);
            ctx.restore();
        } catch (e) {
            console.warn("Error loading image", e);
            console.log("Current Obj:", this);
            console.log("Could not load image:", this.img.src);
        }
    }

    /** Draw Cirle
     * @param {CanvasRenderingContext2D} ctx context of canvaes
     */
    drawCirle(ctx) {
        ctx.beginPath();
        ctx.arc(this.circleX , this.circleY, this.radius, 0, 2 * Math.PI, false);
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'black';
        ctx.stroke();
    }

    /** Draw text in the cirle 
     * @param {CanvasRenderingContext2D} ctx context of canvaes
    */
    drawText(ctx) {
        let textX = this.textX2;
        let textString = this.text.toString();
        if (this.text.toString().length == 1) {
            textX = this.textX1;
        } 
        ctx.font = '20pt Calibri';
        ctx.fillText(textString, textX, this.textY);
    }

    /** When collcted, it should jump */
    jump() {
        this.clearLastJump();
        this.lastJumpIntervalId = setStoppableInterval(()=>{
            this.jumpCount ++;
            if(this.jumpCount > 10) {
                this.textY = this.originalY;
                clearInterval(this.lastJumpIntervalId);
            }
            this.textY += this.speedY * this.yDirection;
            if (this.textY > this.originalY) {
                this.yDirection = -1;
            } else if (this.textY < this.jumpY){
                this.yDirection = 1;
            }
        }, 0.01);
        
    }

    /** After jumping goes back to the original position */
    clearLastJump() {
        this.jumpCount = 0;
        if(this.lastJumpIntervalId) {
            clearInterval(this.lastJumpIntervalId);
            this.textY = this.originalY;
        }
        
    }
    
}