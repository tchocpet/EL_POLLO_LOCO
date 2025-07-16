class Level {
    enemies;
    endBoss;
    clouds;
    backgroundObjects;
    coins;
    groundBottles;
    level_end_x = LEVEL_1_END_X;

     /**
     * Creates an instance of the game world with all necessary objects.
     * @constructor
     * @param {Array<Object>} enemies - Array of enemy objects in the game.
     * @param {Object} endBoss - The final boss character object.
     * @param {Array<Object>} clouds - Array of cloud objects for the background.
     * @param {Array<Object>} backgroundObjects - Array of background layer objects.
     * @param {Array<Object>} coins - Array of collectible coin objects.
     * @param {Array<Object>} groundBottles - Array of throwable bottle or item objects on the ground.
     */
    constructor(enemies, endBoss, clouds, backgroundObjects, coins, groundBottles) {
        this.enemies = enemies;
        this.endBoss = endBoss;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.groundBottles = groundBottles;
    }
}