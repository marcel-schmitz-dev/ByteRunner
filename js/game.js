import { World } from "../models/world.class.js";
import { Keyboard } from "../models/keyboard.class.js";
import { AudioHub } from "../models/audio.hub.js";

let canvas;
let world;
let keyboard = new Keyboard();
let isStarting = false;

/**
 * Initializes the canvas element and starts the game world instance.
 */
function init() {
    canvas = document.getElementById("canvas");
    if (!canvas) {
        console.error("Canvas element not found!");
        return;
    }
    world = new World(canvas, keyboard);
    window.world = world;
}

/**
 * Handles keydown events to update the keyboard input state.
 * @param {KeyboardEvent} e - The keyboard event.
 */
function handleKeyDown(e) {
    if (e.code == "ArrowLeft" || e.code == "KeyA") keyboard.LEFT = true;
    if (e.code == "ArrowRight" || e.code == "KeyD") keyboard.RIGHT = true;
    if (e.code == "ArrowUp" || e.code == "KeyW") keyboard.UP = true;
    if (e.code == "ArrowDown" || e.code == "KeyS") keyboard.DOWN = true;
    if (e.code == "Space") keyboard.SPACE = true;
    if (e.code == "KeyL") keyboard.THROW = true;
}

/**
 * Handles keyup events to reset the keyboard input state.
 * @param {KeyboardEvent} e - The keyboard event.
 */
function handleKeyUp(e) {
    if (e.code == "ArrowLeft" || e.code == "KeyA") keyboard.LEFT = false;
    if (e.code == "ArrowRight" || e.code == "KeyD") keyboard.RIGHT = false;
    if (e.code == "ArrowUp" || e.code == "KeyW") keyboard.UP = false;
    if (e.code == "ArrowDown" || e.code == "KeyS") keyboard.DOWN = false;
    if (e.code == "Space") keyboard.SPACE = false;
    if (e.code == "KeyL") keyboard.THROW = false;
}

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);

/**
 * Toggles the visibility of a modal element by its ID.
 * @param {string} modalId - The ID of the modal element.
 */
window.toggleModal = function (modalId) {
    let modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.toggle("hidden");
    }
};

/**
 * Hides the start screen and initializes the game session.
 */
function hideStartScreen() {
    let startScreen = document.getElementById("start-screen");
    if (startScreen) {
        startScreen.style.display = "none";
    }
    init();
}

/**
 * Applies inline Cyberpunk styling to the countdown element.
 * @param {HTMLElement} div - The countdown display element.
 */
function applyCountdownStyles(div) {
    div.style.position = "absolute";
    div.style.top = "50%";
    div.style.left = "50%";
    div.style.transform = "translate(-50%, -50%)";
    div.style.fontSize = "80px";
    div.style.fontWeight = "bold";
    div.style.zIndex = "100";
    div.style.fontFamily = '"Orbitron", sans-serif';
    div.style.background = "linear-gradient(90deg, #00ffff, #ff0080)";
    div.style.webkitBackgroundClip = "text";
    div.style.webkitTextFillColor = "transparent";
    div.style.textShadow = "0 0 20px rgba(0, 255, 255, 0.4)";
}

/**
 * Creates and appends the countdown display element to the start screen.
 * @returns {HTMLElement} The created countdown DOM element.
 */
function createCountdownDisplay() {
    let startScreen = document.getElementById("start-screen");
    let countdownDiv = document.createElement("div");
    countdownDiv.id = "countdown-display";
    applyCountdownStyles(countdownDiv);
    startScreen.appendChild(countdownDiv);
    return countdownDiv;
}

/**
 * Runs the visual countdown steps ("3", "2", "1", "GO!").
 * @param {HTMLElement} countdownDiv - The element displaying the countdown.
 */
function runCountdownVisuals(countdownDiv) {
    let steps = ["3", "2", "1", "GO!"];
    let stepIndex = 0;
    countdownDiv.innerHTML = steps[stepIndex];

    let countInterval = setInterval(() => {
        stepIndex++;
        if (stepIndex < steps.length) {
            countdownDiv.innerHTML = steps[stepIndex];
        } else {
            clearInterval(countInterval);
        }
    }, 1000);
}

/**
 * Sets up audio playback and schedules visuals with the 350ms sync delay.
 * @param {HTMLElement} countdownDiv - The countdown element.
 */
function setupAudioPlayback(countdownDiv) {
    let sound = new AudioHub().sounds["startSoundCountdown"];
    if (!sound?.file) {
        runCountdownVisuals(countdownDiv);
        setTimeout(hideStartScreen, 4000);
        return;
    }
    sound.file.volume = 0.6;
    sound.file.currentTime = 0;
    sound.file.onended = hideStartScreen;
    sound.file.play().catch(() => hideStartScreen());
    setTimeout(() => runCountdownVisuals(countdownDiv), 350);
}

/**
 * Initiates the game start sequence, hiding the button and starting audio/visual sync.
 */
window.startGame = function () {
    if (isStarting) return;
    isStarting = true;

    let startBtn = document.getElementById("start-btn");
    if (startBtn) startBtn.style.display = "none";

    let countdownDiv =
        document.getElementById("countdown-display") ||
        createCountdownDisplay();
    setupAudioPlayback(countdownDiv);
};

/**
 * Reloads the current page to restart the game session.
 */
window.restartGame = function () {
    location.reload();
};
