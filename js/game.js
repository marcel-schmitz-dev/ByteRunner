import { World } from "../models/world.class.js";
import { Keyboard } from "../models/keyboard.class.js";
import { AudioHub } from "../models/audio.hub.js";

let canvas;
let world;
let keyboard = new Keyboard();
let isStarting = false;
let globalAudioHub = new AudioHub();

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

    if (globalAudioHub.isMuted) {
        world.audioHub.isMuted = true;
        for (let key in world.audioHub.sounds) {
            let soundObj = world.audioHub.sounds[key];
            if (soundObj && soundObj.file) {
                soundObj.file.muted = true;
            }
        }
    }

    window.world = world;

    initTouchControls();
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

// Initialisiert den Mute-Button UI direkt beim Laden der Seite
document.addEventListener("DOMContentLoaded", () => {
    updateMuteButtonUI(globalAudioHub.isMuted);
});

/**
 * Initialisiert die Touch-Steuerung für mobile Geräte und Tablets.
 */
function initTouchControls() {
    const bindTouchButton = (elementId, keyName) => {
        const btn = document.getElementById(elementId);
        if (!btn) return;

        // Touch Start (Taste drücken)
        btn.addEventListener(
            "touchstart",
            (e) => {
                e.preventDefault();
                keyboard[keyName] = true;
                btn.classList.add("active");
            },
            { passive: false },
        );

        // Touch End / Cancel (Taste loslassen)
        btn.addEventListener(
            "touchend",
            (e) => {
                e.preventDefault();
                keyboard[keyName] = false;
                btn.classList.remove("active");
            },
            { passive: false },
        );

        btn.addEventListener(
            "touchcancel",
            (e) => {
                e.preventDefault();
                keyboard[keyName] = false;
                btn.classList.remove("active");
            },
            { passive: false },
        );
    };

    // Verknüpfe die HTML-Buttons mit den Keyboard-Properties
    bindTouchButton("btn-left", "LEFT");
    bindTouchButton("btn-right", "RIGHT");
    bindTouchButton("btn-jump", "UP"); // Springen (wie Pfeil Oben / W)
    bindTouchButton("btn-throw", "THROW"); // Werfen (wie Taste L)
}

/**
 * Toggles global audio mute state and updates the UI button.
 */
window.toggleMute = function () {
    let isMuted;
    if (window.world && window.world.audioHub) {
        isMuted = window.world.audioHub.toggleMute();
    } else {
        isMuted = globalAudioHub.toggleMute();
    }
    updateMuteButtonUI(isMuted);
};

/**
 * Updates the visual styling and text of the mute button.
 * @param {boolean} isMuted - The current mute status.
 */
function updateMuteButtonUI(isMuted) {
    let btn = document.getElementById("mute-btn");
    if (!btn) return;
    if (isMuted) {
        btn.innerHTML = "SOUND: OFF";
        btn.classList.add("muted");
    } else {
        btn.innerHTML = "SOUND: ON";
        btn.classList.remove("muted");
    }
}

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
 * Closes a specific modal by its ID.
 * @param {string} modalId - The ID of the modal element.
 */
window.closeModal = function (modalId) {
    let modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add("hidden");
    }
};

/**
 * Closes the modal if clicked on the outer background overlay.
 * @param {MouseEvent} event - The click event.
 * @param {string} modalId - The ID of the modal element.
 */
window.closeModalOnOutsideClick = function (event, modalId) {
    let modal = document.getElementById(modalId);
    if (event.target === modal) {
        closeModal(modalId);
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
    let sound = globalAudioHub.sounds["startSoundCountdown"];
    if (!sound?.file || globalAudioHub.isMuted) {
        runCountdownVisuals(countdownDiv);
        setTimeout(hideStartScreen, 4000);
        return;
    }
    sound.file.volume = 0.5;
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
