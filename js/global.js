
const ASSERTS = {};
const AUDIOS = [];
const CANVAS_HEIGHT = 480;
const CANVAS_WIDTH = 720;
const ARROW_LEFT = "KeyA";
const ARROW_RIGHT = "KeyD";
const ARROW_UP = "KeyW";
const ARROW_DOWN = "KeyS";
const SHOT = "KeyJ";
const CHICKEN_NUM = 10;
const SMALL_CHICKEN_NUM = 5;
const CLOUD_NUM = 10;
const BACKGROUND_NUM = 6;
const COIN_NUM = 10;
const GROUNDBOTTLE_NUM = 15;
let LEVEL1 = null;
const LEVEL_1_END_X = (BACKGROUND_NUM - 1) * 720 + 20;
const GAME_TIME = 60;

const SALSA_BOTTLE_PATH = "img/6_salsa_bottle/salsa_bottle.png";
const COIN_PATH = "img/8_coin/coin_1.png";
const BUTTON_AUDIO_PATH = "audio/button-hover.mp3";
const TYPING_AUDIO_PATH = "audio/typing.wav";
const GAME_LOST_PATH = "audio/game_lost.mp3";
const GAME_WON_PATH = "audio/game_won.mp3";
const AUDIO_BG_MUSIC = "audio/bg_music.wav";
let TYPING_AUTIO = new Audio(TYPING_AUDIO_PATH);
TYPING_AUTIO.muted = true;
AUDIOS.push(TYPING_AUTIO);

const fullScreenDiv = document.getElementById("fullscreen");
const canvas_script = document.getElementById("canvas");
const fullScreenImg = document.getElementById("full-screen-img");
const legalNoticeBtn = document.getElementById("legal-notice-btn");
let lastShowedScreen =  document.getElementById("start-screen");;
let fullScreenIsOn = false;
let gameIsStarted = false;

let canvas;
let world;
let kb;
let gameIsPaused = false;
let assertIsLoaded = false;
let bgMusicAudio;
const intervalIDs = [];
let currentAnimationFrameID;
const allAudios = [];

const loadingBtn = document.getElementById("loading-btn");
const gameTimerDiv = document.getElementById("game-timer");
let startScreen = document.getElementById("start-screen");
let soundImgs = document.querySelectorAll(".sound-img");
let pauseImg = document.getElementById("pause-img");
let pauseBtnInGame = document.getElementById("pause-btn-in-game");
let soundBtnInGame = document.getElementById("sound-btn-in-game");
let controlScreen = document.getElementById("control-screen");
let loadingScreen = document.getElementById("loading-screen");
let storyScreen = document.getElementById("story-screen");
let canvasScreen = document.getElementById("canvas-screen");
let rotateScreen = document.getElementById("rotate-screen");
let lostEndScreen = document.getElementById("lost-end-screen");
let wonEndScreen = document.getElementById("won-end-screen");
let confirmScreen = document.getElementById("confirm-screen");
let canvasScreenBottom = document.getElementById("canvas-screen-bottom");

let storyP = document.getElementById("story-p");
let skipBtn = document.getElementById("skip-btn");
let storyLineId = 0;
let charIndex = 0;
let typingIntervalId;
let isSkipping = false;
let lastAudio;
let audioUnlocked = false;
const mouseEnterHandlers = new Map(); 

const STORYLINES = [
    "In a peaceful farming valley nestled between two volcanoes, chickens lived a quiet, clucking life.",
    "That is, until a freak meteor storm collided with the coop’s feeding silo, unleashing a strange cosmic energy that transformed one ordinary chicken into... El Pollo Loco – the Mad Chicken.",
    "Once a mild-mannered hen, El Pollo Loco was granted unnatural speed, strength, and an unrelenting thirst for power.",
    "Driven mad by the surge, she began building an army of mutated poultry, robotic egg drones, and pecking minions to conquer the valley — and then the world.",
    "You are a lone farmhand, the last defender of Cluckridge, armed with little more than your reflexes, a slingshot, and some very determined boots.",
    "Fight your way through crazed chicken hordes, dodge explosive eggs, and confront El Pollo Loco herself in her lair atop Mount Feathermore.",
    "The fate of the coop — and the world — depends on you."
  ];


let loaded = 0;
const imageAudioMap = {
    "img/5_background/layers/air.png" : "img/5_background/layers/air.png",

    "img/5_background/layers/1_first_layer/1.png" : "img/5_background/layers/1_first_layer/1.png",
    "img/5_background/layers/1_first_layer/2.png" : "img/5_background/layers/1_first_layer/2.png",
    "img/5_background/layers/2_second_layer/1.png" : "img/5_background/layers/2_second_layer/1.png",
    "img/5_background/layers/2_second_layer/2.png" : "img/5_background/layers/2_second_layer/2.png",
    "img/5_background/layers/3_third_layer/1.png" : "img/5_background/layers/3_third_layer/1.png",
    "img/5_background/layers/3_third_layer/2.png" : "img/5_background/layers/3_third_layer/2.png",

    "img/5_background/layers/4_clouds/1.png" : "img/5_background/layers/4_clouds/1.png",

    "img/2_character_pepe/1_idle/idle/I-1.png": "img/2_character_pepe/1_idle/idle/I-1.png",
    "img/2_character_pepe/1_idle/idle/I-2.png": "img/2_character_pepe/1_idle/idle/I-2.png",
    "img/2_character_pepe/1_idle/idle/I-3.png": "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-4.png": "img/2_character_pepe/1_idle/idle/I-4.png",
    "img/2_character_pepe/1_idle/idle/I-5.png": "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png": "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png": "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png": "img/2_character_pepe/1_idle/idle/I-8.png",
    "img/2_character_pepe/1_idle/idle/I-9.png": "img/2_character_pepe/1_idle/idle/I-9.png",
    "img/2_character_pepe/1_idle/idle/I-10.png": "img/2_character_pepe/1_idle/idle/I-10.png",

    "img/2_character_pepe/1_idle/long_idle/I-11.png": "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png": "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png": "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png": "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png": "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-16.png": "img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png": "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png": "img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/2_character_pepe/1_idle/long_idle/I-19.png": "img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/2_character_pepe/1_idle/long_idle/I-20.png": "img/2_character_pepe/1_idle/long_idle/I-20.png",

    "img/2_character_pepe/2_walk/W-21.png": "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png": "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png": "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png": "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png": "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png": "img/2_character_pepe/2_walk/W-26.png",

    "img/2_character_pepe/3_jump/J-31.png": "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png": "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png": "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png": "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png": "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png": "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png": "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png": "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png": "img/2_character_pepe/3_jump/J-39.png",

    "img/2_character_pepe/5_dead/D-52.png": "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png": "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png": "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png": "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png": "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png": "img/2_character_pepe/5_dead/D-57.png",

    "img/2_character_pepe/4_hurt/H-41.png": "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png": "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png": "img/2_character_pepe/4_hurt/H-43.png",

    "img/5_background/layers/4_clouds/1.png": "img/5_background/layers/4_clouds/1.png",

    "img/8_coin/coin_1.png": "img/8_coin/coin_1.png",

    "img/4_enemie_boss_chicken/2_alert/G5.png": "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png": "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png": "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png": "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png": "img/4_enemie_boss_chicken/2_alert/G9.png",

    "img/4_enemie_boss_chicken/2_alert/G10.png": "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png": "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png": "img/4_enemie_boss_chicken/2_alert/G12.png",

    "img/4_enemie_boss_chicken/1_walk/G1.png": "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png": "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png": "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png": "img/4_enemie_boss_chicken/1_walk/G4.png",

    "img/4_enemie_boss_chicken/5_dead/G24.png": "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png": "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png": "img/4_enemie_boss_chicken/5_dead/G26.png",

    "img/4_enemie_boss_chicken/4_hurt/G21.png": "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png": "img/4_enemie_boss_chicken/4_hurt/G23.png",

    "img/4_enemie_boss_chicken/3_attack/G13.png": "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png": "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png": "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png": "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png": "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png": "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png": "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png": "img/4_enemie_boss_chicken/3_attack/G20.png",

    "img/6_salsa_bottle/1_salsa_bottle_on_ground.png": "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/2_salsa_bottle_on_ground.png": "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",

    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png":"img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png":"img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
     "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png": "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
     'img/3_enemies_chicken/chicken_normal/2_dead/dead.png':'img/3_enemies_chicken/chicken_normal/2_dead/dead.png',

    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png": "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png": "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png": "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
    "img/3_enemies_chicken/chicken_small/2_dead/dead.png": "img/3_enemies_chicken/chicken_small/2_dead/dead.png",

    "img/7_statusbars/2_statusbar_endboss/green/green0.png": "img/7_statusbars/2_statusbar_endboss/green/green0.png",
    "img/7_statusbars/2_statusbar_endboss/green/green20.png": "img/7_statusbars/2_statusbar_endboss/green/green20.png",
    "img/7_statusbars/2_statusbar_endboss/green/green40.png": "img/7_statusbars/2_statusbar_endboss/green/green40.png",
    "img/7_statusbars/2_statusbar_endboss/green/green60.png": "img/7_statusbars/2_statusbar_endboss/green/green60.png",
    "img/7_statusbars/2_statusbar_endboss/green/green80.png": "img/7_statusbars/2_statusbar_endboss/green/green80.png",
    "img/7_statusbars/2_statusbar_endboss/green/green100.png": "img/7_statusbars/2_statusbar_endboss/green/green100.png",

    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png": "img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png": "img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png": "img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png": "img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png": "img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png": "img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png",

    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png": "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png": "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png": "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png": "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png": "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png": "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",

    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png": "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png": "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png": "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png": "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",

    "img/6_salsa_bottle/salsa_bottle.png": "img/6_salsa_bottle/salsa_bottle.png",
    "img/6_salsa_bottle/salsa_bottle.png": "img/6_salsa_bottle/salsa_bottle.png",
    "img/8_coin/coin_1.png": "img/8_coin/coin_1.png",
    "img/8_coin/coin_2.png": "img/8_coin/coin_2.png",

    "img/10_controls/continue.png": "img/10_controls/continue.png",
    "img/10_controls/pause.png": "img/10_controls/pause.png",

    "audio/bg_music.wav": "audio/bg_music.wav",
    "audio/boss_dead.mp3": "audio/boss_dead.mp3",
    "audio/boss_intro_sound.mp3": "audio/boss_intro_sound.mp3",
    "audio/chicken_hurt.mp3": "audio/chicken_hurt.mp3",
    "audio/bottle_collect.wav": "audio/bottle_collect.wav",
    "audio/bottle_shatter.mp3": "audio/bottle_shatter.mp3",
    "audio/bottle_throw.mp3": "audio/bottle_throw.mp3",
    "audio/coin.mp3": "audio/coin.mp3",
    "audio/game_lost.mp3": "audio/game_lost.mp3",
    "audio/game_won.mp3": "audio/game_won.mp3",
    "audio/hurt.mp3": "audio/hurt.mp3",
    "audio/running.wav": "audio/running.wav",
    "audio/jump.wav": "audio/jump.wav",
    "audio/small_chicken_hurt.wav": "audio/small_chicken_hurt.wav",
    "audio/dead.wav": "audio/dead.wav",
}


