class Cloud extends MovableObject {
    
    y = 50;
    w = 500;
    h = 250;
    speed = 0.15;

    /** Cloud constructor */
    constructor() {
        super().loadImage("img/5_background/layers/4_clouds/1.png");

        this.x = Math.random() * 3600;
        this.animate();
    }

     /** Cloud animation */
    animate() {
        setStoppableInterval(()=> {
            if (gameIsPaused) return;
            this.moveLeft();
        }, 1000 / 60)
       
    }
}