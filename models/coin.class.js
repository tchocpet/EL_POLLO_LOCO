class Coin extends Collectable {
    y = 365;
    h = 60;
    w = 70;

    offset = {
        left: 25,
        right: 25,
        top: 20,
        bottom: 20
    }

    IMAGES = [
        "img/8_coin/coin_1.png",
        "img/8_coin/coin_2.png"
    ];


    /** Coin constructor */
    constructor() {
        super().loadImage(this.IMAGES[0]);
        this.loadImages(this.IMAGES);
        this.animate();

        this.x = getRandomNum(100, LEVEL_1_END_X);
        this.y = getRandomNum(120, 380);
        
    }

    /** Coin animation */
    animate() {
        let id = setStoppableInterval(()=>{
            if (gameIsPaused) return;
            this.playAnimation(this.IMAGES);
        }, 1000 / 60);

        this.intervalIDs.push(id);
    }

}