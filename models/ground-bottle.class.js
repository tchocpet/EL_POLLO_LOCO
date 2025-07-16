class GroundBottle extends Collectable {
    y = 365;
    h = 60;
    w = 70;

    offset = {
        left: 30,
        right: 20,
        top: 10,
        bottom: 10
    }

    IMAGES = [
        "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
        "img/6_salsa_bottle/2_salsa_bottle_on_ground.png"
    ];


    /** GroundBottle constructor */
    constructor() {
        let r = getRandomNum(0, 2);
        super().loadImage(this.IMAGES[r]);
        this.x = getRandomNum(100, LEVEL_1_END_X);
    }

}