/** Call createImageLoadingPromises */
async function preloadImages() {
    const imageAudioMapArr = Object.entries(imageAudioMap);
    const promises = createImageLoadingPromises(imageAudioMapArr);
    return mapImageKeyValue(promises);
}


/** Create Imageloading Promises 
 * @param {Array} imageAudioMapArr Original image and audio array
*/
function createImageLoadingPromises(imageAudioMapArr) {
    loaded = 0;
    loadingBtn.innerText = "Asserts are loading ...";
    const promises = imageAudioMapArr.map(([key, url]) => {
        return new Promise((resolve, reject) => {
            let suffix = url.split(".").pop().toLowerCase();
            if(suffix == "mp3" || suffix == "wav") {
                createAudioObj(imageAudioMapArr, key, url, resolve, reject);
            } else if (suffix == "png") {
                createImgObj(imageAudioMapArr, key, url, resolve, reject);
            }
        });
    });
    return promises;
}


/**
 *  Create all predloaded audio object
 * @param {Array} imageAudioMapArr Original image and audio array
 * @param {*} key map key
 * @param {*} url map url
 * @param {*} resolve when a request succeeded
 * @param {*} reject  when a request failed
 */
function createAudioObj(imageAudioMapArr, key, url, resolve, reject) {
    const audio = new Audio();
    allAudios.push();
    audio.addEventListener("canplaythrough", () => {
        loaded++;
        setProgressBar("Audios", loaded, imageAudioMapArr.length);
        resolve([key, audio]);
    });
    audio.addEventListener("error", reject);
    audio.src = url;
    audio.load();
}


/**
 *  Create all predloaded audio object
 * @param {Array} imageAudioMapArr Original image and audio array
 * @param {*} key map key
 * @param {*} url map url
 * @param {*} resolve when a request succeeded
 * @param {*} reject  when a request failed
 */
function createImgObj(imageAudioMapArr, key, url, resolve, reject) {
    const img = new Image();
    img.onload = () => {
        loaded ++;
        setProgressBar("Images", loaded, imageAudioMapArr.length);
        resolve([key, img]);
    };
    img.onerror = reject;
    img.src = url;
}


/** Change progress bar percentage 
 * @param {String} loadingText 
 * @param {Boolean} loaded 
 * @param {Number} length 
*/
function setProgressBar(loadingText, loaded, length) {
    let loadingPercentage = getPercentage(loaded, length);
    setLoadingBtnText(loadingPercentage, loadingText)
}


/** Remap asser keys and values 
 * @param {Promise} promises all promises created
*/
async function mapImageKeyValue(promises) {
    const results = await Promise.all(promises);
    const asserts = {};
    results.forEach(([key, assert]) => {
        asserts[key] = assert;
    });
    return asserts;
}


/** Load all asserts 
 * @param {Function} fn 
*/
function loadAssets(fn) {
    Promise.all([
        preloadImages(),
    ]).then(([asserts]) => {
        let [images, audios] = splitAsserts(asserts);
        fn(images, audios);
    })
}


/** Split Assesrts into Images and Audios 
 * @param {Array} asserts 
 */
function splitAsserts(asserts){
    let images = {};
    let audios = {};
    let assertMap = Object.entries(asserts); 
    assertMap.map(([key, obj]) => {
        if(obj instanceof Audio) {
            audios[key] = obj;
            obj.muted = audioUnlocked ? false : true;
            AUDIOS.push(obj);
        } else {
            images[key] = obj;
        }

    });
    return [images, audios];
}

