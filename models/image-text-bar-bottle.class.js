class ImageTextBarBottle extends ImageTextBar{

    offset = {
        left: 50,
        right: 50,
        top: 40,
        bottom: 40
    }

    /** ImageTextBarBottle constructor 
     * @param {Nummber} x x value
     * @param {Nummber} y y value
     * @param {Nummber} w width value
     * @param {Nummber} h height value
     * @param {String} path url 
    */
    constructor(x, y, w, h, path) {
        super(x, y, w, h, path);

        this.circleX = this.x + 80;
        this.circleY = this.y + (this.h / 2);

        this.textX1 = this.x + 73;
        this.textX2 = this.x + 66;
        this.textY = 93;
        
    }
}