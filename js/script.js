/** Init Page */
function init() {
    checkifMusicIsUnlocked();
    addButtonHoverEventListener();
    if (window.innerHeight > window.innerWidth && isSmallScreen()) {
        showScreen(rotateScreen);
    } else {
        checkIfGameStarted();
    }
    if (isSmallScreen() || isMobileDevice()) {
        canvasScreenBottom.style.display = "flex";
    } else {
        canvasScreenBottom.style.display = "none";
    }
    
}


/** Check music */
function checkifMusicIsUnlocked() {
    let musicState = localStorage.getItem("audioUnlocked");
    if(musicState) {
        audioUnlocked = musicState == "false" ? false : true;
    } else {
        audioUnlocked = false;
    }

    TYPING_AUTIO.muted = audioUnlocked ? false : true;
    if(audioUnlocked) {
        soundImgs.forEach(soundImg => {
            soundImg.src = "img/10_controls/sound-on.png";
        });
    } else {
        soundImgs.forEach(soundImg => {
            soundImg.src = "img/10_controls/sound-off.png";
        });
    }
}



/** Show one screen with param of current screen 
 * @param {HTMLElement} currentScreen current div
*/
function showScreen(currentScreen) {
    document.querySelectorAll(".game-screen").forEach(screen => {
        screen.classList.add("d-none");
    });

    currentScreen.classList.remove("d-none");
    if (currentScreen.id !== "rotate-screen") {
        lastShowedScreen = currentScreen;
    }
}


/** Go to control screen */
function goToControlScreen(){
    showScreen(controlScreen);
}

/** Go to background story screen */
function goToBgstoryScreen(){
    showScreen(storyScreen);

    storyLineId = 0;
    charIndex = 0;
    isSkipping = false;
    skipBtn.innerText = "Skip";
    skipBtn.onclick = skipTyping;

    startStoryTelling();
}


/** When user click go back from story scren */
function storyScreenGoBack() {
    clearInterval(typingIntervalId);
    goBackToStartScreen();
}


/** When user clicks skip */
function skipTyping() {
    isSkipping = true;
    setTimeout(() => {
        isSkipping = false;
    }, 100);
}


/** Type each character of a line with optional onComplete callback 
 *  @param {String} line which line should be shown
 * @param {Function} onComplete which function should be called
*/
function typeLine(line, onComplete) {
    charIndex = 0;
    storyP.textContent = '';

    typingIntervalId = setTypingInterval(line, onComplete);
}


/** Type each character of a line with optional onComplete callback 
 * @param {String} line which line should be shown
 * @param {Function} onComplete which function should be called
*/
function setTypingInterval(line, onComplete) {
    return setInterval(() => {
        if (isSkipping) {
            clearInterval(typingIntervalId);
            storyP.textContent = line;
            setTimeout(onComplete, 500);
            return;
        }
        storyP.textContent += line.charAt(charIndex);
        charIndex++;
        TYPING_AUTIO.play();
        if (charIndex >= line.length) {
            clearInterval(typingIntervalId);
            setTimeout(onComplete, 1000);
        }
    }, 40);
}


/** Set interval to type characters one by one */
function startStoryTelling() {
    function showNextLine() {
        if (storyLineId >= STORYLINES.length) {
            skipBtn.innerText = "Start";
            skipBtn.onclick = startLoading;
            return;
        }
        const currentLine = STORYLINES[storyLineId];
        storyLineId++;
        typeLine(currentLine, showNextLine);
    }

    showNextLine();
}


/** Go back to the start screen and stop everything */
function goBackToStartScreen() {
    showScreen(startScreen);
}


/** Set loading button text with percentage and message 
 * @param {Number} loadingPercentage pertange nummber
 * @param {String} loadingText showed text 
*/
function setLoadingBtnText(loadingPercentage, loadingText) {
    loadingBtn.innerText = `${loadingText} are loading ... ${loadingPercentage}%`;
}


/** Stop background music */
function stopBgMusic() {
    ASSERTS["audios"][AUDIO_BG_MUSIC].pause();
    ASSERTS["audios"][AUDIO_BG_MUSIC].currenTime = 0; 
}


/** Mute all audio elements */
function muteAllAudios() {
    AUDIOS.forEach(a => {
        a.muted = true;
    });
}


/** Unmute all audio elements */
function unMuteAllAudios() {
    AUDIOS.forEach(a => {
        a.muted = false;
    });
}


/** Toggle sound on or off */
function enableSound() {
    if (!audioUnlocked) {
        localStorage.setItem("audioUnlocked", true);
        audioUnlocked = true;
        soundImgs.forEach(soundImg => {
            soundImg.src = "img/10_controls/sound-on.png";
        });
        unMuteAllAudios();

    } else {
        audioUnlocked = false;
        localStorage.setItem("audioUnlocked", false);
        soundImgs.forEach(soundImg => {
            soundImg.src = "img/10_controls/sound-off.png";
        });
        muteAllAudios();
    }
}


/** Add hover sound effect listeners to all sound buttons */
function addButtonHoverEventListener() {
    const btns = document.querySelectorAll(".sound-btn");
    btns.forEach(btn => {
        addButtonMouseEnter(btn);
    });
}


/** Create a mouseenter handler for a button 
 * @param {HTMLElement} btn current button
*/
function createMouseEnterHandler(btn) {
    return function mouseEnterHandler() {
        if (!audioUnlocked) return;
        if (lastAudio) {
            lastAudio.pause();
        }
        createButtionClickAudio();
    };
}


/** Add mouseenter audio listener to a button 
 * @param {HTMLElement} btn current button
*/
function addButtonMouseEnter(btn) {
    const handler = createMouseEnterHandler(btn);
    mouseEnterHandlers.set(btn, handler);
    btn.addEventListener("mouseenter", handler);
}


/** Remove mouseenter audio listener from a button 
 *  @param {HTMLElement} btn button
*/
function removeButtonMouseEnter(btn) {
    const handler = mouseEnterHandlers.get(btn, handler);
    btn.removeEventListener("mouseenter", handler);
}


/** Create and play button click audio */
function createButtionClickAudio(){
    const bAudio = new Audio(BUTTON_AUDIO_PATH);
    AUDIOS.push(bAudio);
    bAudio.currentTime = 0;
    bAudio.play().then(() => {
        lastAudio = bAudio;
    }).catch(err => {
        console.warn("Audio play failed:", err);
    });
}


