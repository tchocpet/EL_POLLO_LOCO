
/** Change pauseBtn Img */
function disableInGameBtns() {
    pauseImg.src = "img/10_controls/continue.png";
}


/** Change pauseBtn Img */
function enableInGameBtns() {
    pauseImg.src = "img/10_controls/pause.png";
}


/** User click Pause Game */
function pauseGame(){
    if(!gameIsPaused) {
        gameIsPaused = true;
        disableInGameBtns();
    } else {
        gameIsPaused = false;
        enableInGameBtns();
    } 
}


/** When games stops 
 * @param {boolean} isWon if won, true, or eles false
*/
function stopGame(isWon) {
    intervalIDs.forEach(clearInterval);
    bgMusicAudio.pause();
    document.getElementById("canvas-overlay").style.display = "block";

    if (!isWon) {
        ASSERTS["audios"][GAME_LOST_PATH].play();
        showScreen(lostEndScreen);
    } else {
        ASSERTS["audios"][GAME_WON_PATH].play();
        showScreen(wonEndScreen);
    }

    setTimeout(showEndScreenButton, 3000);
}


/** When user click Play Again */ 
function playAgain() {
    lostEndScreen.classList.add("d-none");
    wonEndScreen.classList.add("d-none");
    document.getElementById("canvas-overlay").style.display = "none";
    startGame();
}

/** Show buttons on endscreen */ 
function showEndScreenButton() {
    lostEndScreen.querySelectorAll("button").forEach((b)=>{
        b.classList.remove("d-none");
    });
    wonEndScreen.querySelectorAll("button").forEach((b)=>{
        b.classList.remove("d-none");
    });
}

/** Hide buttons on endscreen */ 
function hideEndScreenButton() {
    lostEndScreen.querySelectorAll("button").forEach((b)=>{
        b.classList.add("d-none");
    });
    wonEndScreen.querySelectorAll("button").forEach((b)=>{
        b.classList.add("d-none");
    });
}


/** When user clicks Home Button */
function goBackToHome() {
    hideEndScreenButton();
    document.getElementById("canvas-overlay").style.display = "none";

    gameIsStarted = false;
    gameIsPaused = false;
    stopBgMusic();
    intervalIDs.forEach(clearInterval);
    goBackToStartScreen();
}


/** Quit Game, To go cofirm screen */
function quitGame() {
    gameIsPaused = true;
    disableInGameBtns();
    showScreen(confirmScreen);
}


/** Resume Game */
function resumeGame(){
    lastShowedScreen = null;
    gameIsPaused = false;
    enableInGameBtns();
    confirmScreen.classList.add("d-none");
}

/** Start loading */
function startLoading() { 
    showScreen(loadingScreen);
    loadAssets((images, audios) => {
        ASSERTS["images"] = images;
        ASSERTS["audios"] = audios;
        loadingScreen.classList.add("d-none");
        startGame();
    });
}


/** When game starts */
function startGame() { 
    cancelAnimationFrame(currentAnimationFrameID);
    intervalIDs.forEach(clearInterval);
    gameIsStarted = true;
    gameIsPaused = false;
    enableInGameBtns();
    
    initGameElements();
    initLevel();
    initCanvasAndKeyBoard();
    initBgMusic();
}


/** Init background muscis */
function initBgMusic() {
    bgMusicAudio = ASSERTS["audios"][AUDIO_BG_MUSIC];
    bgMusicAudio.playbackRate = 0.8;
    bgMusicAudio.loop = true;
    bgMusicAudio.currenTime = 0;
    bgMusicAudio.play();
}


/** Init game elementes */
function initGameElements() {
    enemies = [];
    endBoss = null;
    clouds = [];
    backgrounds = [];
    coins = [];
    groundBottles = [];
    removeEventListener("keydown", onKeyDown);
    removeEventListener("keyup", onKeyUp);
    removeMobielButtonEventListener();

    addEnemies();
    createEndBoss();
    addSmallChickenAroundBoss();
    addClouds();
    addBgs();
    addCoins();
    addGroundBottles();
    addKeydownEventListener();
    addMobielButtonEventListener() ;
    addKeyUpEventListener();
}


/** Init the first level */
function initLevel(){
    LEVEL1 = new Level(
        enemies,
        endBoss,
        clouds,
        backgrounds,
        coins,
        groundBottles
    );
}


/** Init the game world and canvas and keyboard */
function initCanvasAndKeyBoard() {
    canvas = document.getElementById("canvas");

    kb = new Keyboard();
    world = new World(canvas, kb);
}


/** On touchstart  
 * @param {HTMLELEmentEvent} event current event triggered
*/
function onTouchStart(event){
    const btn = event.currentTarget;
    if(btn.id == "mobile-left") {
        kb.LEFT = true;
    } else if(btn.id == "mobile-right") {
        kb.RIGHT = true;
    } else if(btn.id == "mobile-jump") {
        kb.SPACE = true;
    } else if (btn.id == "mobile-throw") {
        kb.D = true;
        if (!gameIsPaused) {
            world.characterShoot();
        }
       
    }
}


/** On touchup  
 * @param {HTMLELEmentEvent} event current event triggered
*/
function onTouchUp(event){
    const btn = event.currentTarget;

    if(btn.id == "mobile-left") {
        kb.LEFT = false;
    } else if(btn.id == "mobile-right") {
        kb.RIGHT = false;
    } else if(btn.id == "mobile-jump") {
        kb.SPACE = false;
    } else if (btn.id == "mobile-throw") {
        kb.D = false;
        if (world) {
            world.character.isShooting = false;
        }
    }

}

/** Add Events for mobile button */
function addMobielButtonEventListener(){
    document.querySelectorAll(".mobile-control-btn").forEach((btn)=>{
        btn.addEventListener("touchstart", onTouchStart);
        btn.addEventListener("touchend", onTouchUp);
    })
}

/** Remove Events for mobile button */
function removeMobielButtonEventListener(){
    document.querySelectorAll(".mobile-control-btn").forEach((btn)=>{
        btn.removeEventListener("touchstart", onTouchStart);
        btn.removeEventListener("touchend", onTouchUp);
    })
}



/** Events for keybord */
function addKeydownEventListener (){
    addEventListener("keydown", onKeyDown);
}

/** When keydown
 * @param {HTMLELEmentEvent} event current event
 */
function onKeyDown(event) {
    if(kb) {
        switch (event.code) {
            case ARROW_LEFT:
                kb.LEFT = true;
                break;
            case ARROW_RIGHT:
                kb.RIGHT = true;
                break;
            case SHOT:
                kb.D = true;
                if (!gameIsPaused) {
                    world.characterShoot();
                }
                break;
            case ARROW_DOWN:
                kb.DOWN = true;
                break;
            case ARROW_UP:
                kb.SPACE = true;
                break;
            default:
                break;
        } 
    }
}


/** Events for keybord */
function addKeyUpEventListener (){
    addEventListener("keyup", onKeyUp);
}

/** When users press key up
 * @param {HTMLELEmentEvent} event current event
 */
function onKeyUp(event){
    if(kb) {
        switch (event.code) {
            case ARROW_LEFT:
                kb.LEFT = false;
                break;
            case ARROW_RIGHT:
                kb.RIGHT = false;
                break;
            case SHOT:
                kb.D = false;
                if (world) {
                    world.character.isShooting = false;
                }
                break;
            case ARROW_DOWN:
                kb.DOWN = false;
                break;
            case ARROW_UP:
                kb.SPACE = false;
                break;
            default:
                break;
        
        } 
    }

}




