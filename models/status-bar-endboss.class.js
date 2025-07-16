class EndBossStatusBar extends DrawableObject {

    x = 480;
    y = 7;
    w = 0;
    h = 60;

    isShowable = false;
    intervalID;

    IMAGES = [
        "img/7_statusbars/2_statusbar_endboss/green/green0.png",
        "img/7_statusbars/2_statusbar_endboss/green/green20.png",
        "img/7_statusbars/2_statusbar_endboss/green/green40.png",
        "img/7_statusbars/2_statusbar_endboss/green/green60.png",
        "img/7_statusbars/2_statusbar_endboss/green/green80.png",
        "img/7_statusbars/2_statusbar_endboss/green/green100.png",
    ];

    percentage = 100;

    /** Status-bar-endboss constructor */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.setPercentage(100);
        this.animate();
    }

    /** Set statusbar in motion */
    animate() {
        this.intervalID = setStoppableInterval(()=>{
            if (this.isShowable) {
                if (this.w < 200) {
                    this.w += 10;
                } else {
                    clearInterval(this.intervalID);
                }
            }
        }, 0.5);
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