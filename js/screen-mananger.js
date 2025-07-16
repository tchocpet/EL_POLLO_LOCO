

/** Check current orientation mode */
function checkOrientation() {
    if (window.matchMedia("(orientation: landscape)").matches) {
        if (window.innerHeight < 480) {
            newHeight = window.innerHeight;
            document.getElementById("canvas").style.height = `${newHeight}px`;
        }
    } else {
        document.getElementById("canvas").style.height = '100%';
    }
}


/** If the ismobile Device */
function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}


/** If the screen is small */
function isSmallScreen() {
    return window.innerWidth < 700; 
}


/** When user resizes the screen */
window.addEventListener("orientationchange", onSizeChange); 
window.addEventListener("resize", onSizeChange); 


/** If any size change, this function will be called */
function onSizeChange() {
    if (window.matchMedia("(orientation: landscape)").matches) {
        checkIfGameStarted();
    } else {
        if (window.innerHeight > window.innerWidth && isSmallScreen()) {
            showScreen(rotateScreen);
        } else {
            checkIfGameStarted();
        }
    }
    
    if (isSmallScreen() || isMobileDevice()) {
        preventContextMenu();
        canvasScreenBottom.style.display = "flex";
    } else {
        canvasScreenBottom.style.display = "none";
    }
}


/** Stop context menu from popping */
function preventContextMenu() {
    window.addEventListener("contextmenu", function(e) {
        e.preventDefault();
    });
}


/** Check if Game started already */
function checkIfGameStarted(){
    if (gameIsStarted) {
        rotateScreen.classList.add("d-none");
        if(lastShowedScreen.id == "confirm-screen" || lastShowedScreen.id == "won-end-screen" || lastShowedScreen.id== "lost-end-screen") {
            showScreen(lastShowedScreen);
        }
    } else {
        showScreen(lastShowedScreen);
    }
}


/** Toggle full screen */
function toggleFullScreen() {
    if(!fullScreenIsOn) {
        fullScreenIsOn = true;
        fullScreenImg.src = "img/10_controls/fullscreen-off.png";
        legalNoticeBtn.classList.add("d-none");
        enterfullScreen();
    } else {
        closeFullscreen();
        afterUserExistFullScreen();
    }
}



/**  Enter full screen mode */
function enterfullScreen() {
    lastShowedScreen = startScreen;
    if (fullScreenDiv.requestFullscreen) {
        fullScreenDiv.requestFullscreen();

    } else if (fullScreenDiv.webkitRequestFullscreen) { /* Safari */
        fullScreenDiv.requestFullscreen();
    } else if (fullScreenDiv.msRequestFullscreen) { /* IE11 */
        fullScreenDiv.msRequestFullscreen();
    }

}


window.addEventListener("fullscreenchange", () => {
    console.log("Fullscreen change detected");
    if (!document.fullscreenElement) {
        afterUserExistFullScreen();
    }
});


/* Close fullscreen */
function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
    }
}

/** After user exit full screen */
function afterUserExistFullScreen(){
    fullScreenIsOn = false;
    fullScreenImg.src = "img/10_controls/fullscreen_on.png";
    legalNoticeBtn.classList.remove("d-none");
}
