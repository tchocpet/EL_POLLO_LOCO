class BackgroundObject extends MovableObject {
    w = 720;
    h = 480;
    
    /** BackgroundObject Contructor 
     * @param {String} path url location
     * @param {Nummer} x x value
    */
    constructor(path, x) {
        super().loadImage(path);
        this.y = 480 - this.h;
        this.x = x;
    }
}