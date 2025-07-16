class StatusBar extends DrawableObject {

    x = 30;
    y = 0;
    w = 200;
    h = 60;

    IMAGES = [
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png",
    ];

    percentage = 100;

    /** Statusbar constructor */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.setPercentage(100);
    }

     /** Set statusbar percentage 
      * @param {Nummber} percentage the perctange of statusbar
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let index = parseInt(this.resolveImageIndex());  
        let imagePath = this.IMAGES[index];
        this.img = this.imgCache[imagePath];
    }

    /** From perctange to index */
    resolveImageIndex() {
        return this.percentage / 20;
    }
}