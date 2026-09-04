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

function updateMuteButtonUI(isMuted) {
    let btn = document.getElementById("mute-btn");
    if (!btn) return;
    let svg = document.getElementById("sound-icon");
    if (isMuted) {
        btn.classList.add("muted");
        if (svg) {
            svg.innerHTML = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
        }
    } else {
        btn.classList.remove("muted");
        if (svg) {
            svg.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
        }
    }
}

/**
 * Schaltet den Vollbildmodus für den Game-Container um.
 */
window.toggleFullscreen = function () {
    let container = document.getElementById("game-container");
    let btn = document.getElementById("fullscreen-btn");

    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        if (container.requestFullscreen) {
            container.requestFullscreen().catch((err) => {
                console.error("Error attempting to enable fullscreen:", err);
            });
        } else if (container.webkitRequestFullscreen) {
            container.webkitRequestFullscreen();
        }
        if (btn) btn.classList.add("active");
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
        if (btn) btn.classList.remove("active");
    }
};

document.addEventListener("fullscreenchange", () => {
    let btn = document.getElementById("fullscreen-btn");
    if (!btn) return;
    if (!document.fullscreenElement) {
        btn.classList.remove("active");
    } else {
        btn.classList.add("active");
    }
});

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
