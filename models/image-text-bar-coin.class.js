class ImageTextBarCoin extends ImageTextBar{

  

    offset = {
        left: 70,
        right: 70,
        top: 70,
        bottom: 70
    }

    /** ImageTextBarCoin constructor 
     * @param {Nummber} x x value
     * @param {Nummber} y y value
     * @param {Nummber} w width value
     * @param {Nummber} h height value
     * @param {String} path url 
    */
    constructor(x, y, w, h, path) {
        super(x, y, w, h, path);
        this.circleX = this.x + 100;
        this.circleY = this.y + 54;

        this.textX1 = this.x + 94;
        this.textX2 = this.x + 88;
        this.textY = 95;
    }

    
}