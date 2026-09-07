import { World } from "../models/world.class.js";
import { Keyboard } from "../models/keyboard.class.js";
import { AudioHub } from "../models/audio.hub.js";
import { IntervalHub } from "../models/interval-hub.class.js";

let canvas;
let world;
let keyboard = new Keyboard();
let isStarting = false;
let globalAudioHub = new AudioHub();

/**
 * Initializes canvas and starts the game world.
 */
function init() {
    canvas = document.getElementById("canvas");
    if (!canvas) return console.error("Canvas element not found!");
    world = new World(canvas, keyboard);
    applyMuteState(world);
    window.world = world;
    initTouchControls();
}

/**
 * Applies global mute state to a game world instance.
 * @param {World} gameWorld - The game world instance.
 */
function applyMuteState(gameWorld) {
    if (!globalAudioHub.isMuted) return;
    gameWorld.audioHub.isMuted = true;
    for (let key in gameWorld.audioHub.sounds) {
        let soundObj = gameWorld.audioHub.sounds[key];
        if (soundObj?.file) soundObj.file.muted = true;
    }
}

/**
 * Updates keyboard flag states based on event.
 * @param {KeyboardEvent} e - Keyboard event.
 * @param {boolean} isPressed - Press state.
 */
function updateKeyboardState(e, isPressed) {
    if (["Space", "Tab", "ArrowLeft", "ArrowRight", "KeyF"].includes(e.code)) {
        e.preventDefault();
    }

    if (e.code === "ArrowLeft") keyboard.LEFT = isPressed;
    if (e.code === "ArrowRight") keyboard.RIGHT = isPressed;
    if (e.code === "Space") {
        keyboard.SPACE = isPressed;
    }
    if (e.code === "KeyF") {
        keyboard.THROW = isPressed;
    }
}

// Registriere die Event-Listener für die Tastatur
window.addEventListener("keydown", (e) => updateKeyboardState(e, true));
window.addEventListener("keyup", (e) => updateKeyboardState(e, false));

/**
 * Initializes touch control button bindings using Pointer Events.
 */
function initTouchControls() {
    let buttons = [
        ["btn-left", "LEFT"],
        ["btn-right", "RIGHT"],
        ["btn-jump", "SPACE"],
        ["btn-throw", "THROW"],
    ];
    buttons.forEach(([id, key]) => bindSingleTouchButton(id, key));
}

/**
 * Binds pointer listeners to a single button element for fluid mobile control.
 * @param {string} id - Element ID.
 * @param {string} key - Keyboard property key.
 */
function bindSingleTouchButton(id, key) {
    let btn = document.getElementById(id);
    if (!btn) return;

    btn.addEventListener("contextmenu", (event) => event.preventDefault());

    ["pointerdown", "pointerup", "pointercancel", "pointerleave"].forEach(
        (eventType) => {
            btn.addEventListener(
                eventType,
                (e) => handlePointerAction(e, key, btn, eventType),
                { passive: false },
            );
        },
    );
}

/**
 * Handles individual pointer event actions.
 * @param {PointerEvent} e - Pointer event.
 * @param {string} key - Key name.
 * @param {HTMLElement} btn - Button element.
 * @param {string} eventType - Event type string.
 */
function handlePointerAction(e, key, btn, eventType) {
    e.preventDefault();
    let isDown = eventType === "pointerdown";
    keyboard[key] = isDown;
    btn.classList.toggle("active", isDown);
}

/**
 * Toggles global mute status.
 */
window.toggleMute = function () {
    let activeAudioHub = window.world?.audioHub || globalAudioHub;
    let isMuted = activeAudioHub.toggleMute();
    if (activeAudioHub !== globalAudioHub) {
        globalAudioHub.setMuted(isMuted);
    }
    updateMuteButtonUI(isMuted);
    if (!isMuted && window.world?.audioHub) {
        window.world.audioHub.play("background", 0.2);
    }
};

/**
 * Updates mute button UI elements and icons.
 * @param {boolean} isMuted - Mute status.
 */
function updateMuteButtonUI(isMuted) {
    let btn = document.getElementById("mute-btn");
    let svg = document.getElementById("sound-icon");
    if (!btn) return;
    btn.classList.toggle("muted", isMuted);
    if (svg) svg.innerHTML = getMuteSvgContent(isMuted);
}

updateMuteButtonUI(globalAudioHub.isMuted);

/**
 * Returns corresponding SVG content for mute button.
 * @param {boolean} isMuted - Mute status.
 * @returns {string} SVG inner HTML.
 */
function getMuteSvgContent(isMuted) {
    if (isMuted) {
        return '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
    }
    return '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
}

/**
 * Toggles fullscreen display mode.
 */
window.toggleFullscreen = function () {
    let container = document.getElementById("game-container");
    let btn = document.getElementById("fullscreen-btn");
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        requestFullscreenContainer(container, btn);
    } else {
        exitFullscreenContainer(btn);
    }
};

/**
 * Requests fullscreen entry.
 * @param {HTMLElement} container - Container element.
 * @param {HTMLElement} btn - Button element.
 */
function requestFullscreenContainer(container, btn) {
    if (container.requestFullscreen)
        container.requestFullscreen().catch((err) => console.error(err));
    else if (container.webkitRequestFullscreen)
        container.webkitRequestFullscreen();
    if (btn) btn.classList.add("active");
}

/**
 * Exits fullscreen mode.
 * @param {HTMLElement} btn - Button element.
 */
function exitFullscreenContainer(btn) {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    if (btn) btn.classList.remove("active");
}

document.addEventListener("fullscreenchange", () => {
    let btn = document.getElementById("fullscreen-btn");
    if (btn) btn.classList.toggle("active", !!document.fullscreenElement);
});

window.toggleModal = (modalId) =>
    document.getElementById(modalId)?.classList.toggle("hidden");
window.closeModal = (modalId) =>
    document.getElementById(modalId)?.classList.add("hidden");
window.closeModalOnOutsideClick = (event, modalId) => {
    if (event.target === document.getElementById(modalId))
        window.closeModal(modalId);
};

/**
 * Starts the game session with countdown.
 */
window.startGame = function () {
    if (isStarting) return;
    isStarting = true;
    let countdownDiv = prepareCountdownDisplay();
    executeCountdownAudioAndVisuals(countdownDiv);
};

/**
 * Prepares and returns the countdown display element.
 * @returns {HTMLElement} Countdown div element.
 */
function prepareCountdownDisplay() {
    let startScreen = document.getElementById("start-screen");
    let countdownDiv =
        document.getElementById("countdown-display") ||
        document.createElement("div");
    if (!countdownDiv.id) {
        countdownDiv.id = "countdown-display";
        applyCountdownStyles(countdownDiv);
        startScreen.appendChild(countdownDiv);
    }
    return countdownDiv;
}

/**
 * Applies styling to countdown element.
 * @param {HTMLElement} countdownDiv - Element.
 */
function applyCountdownStyles(countdownDiv) {
    Object.assign(countdownDiv.style, {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        fontSize: "80px",
        fontWeight: "bold",
        zIndex: "100",
        fontFamily: '"Orbitron", sans-serif',
        background: "linear-gradient(90deg, #00ffff, #ff0080)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        textShadow: "0 0 20px rgba(0, 255, 255, 0.4)",
    });
}

/**
 * Runs audio and visuals for countdown sequence.
 * @param {HTMLElement} countdownDiv - Element.
 */
function executeCountdownAudioAndVisuals(countdownDiv) {
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
 * Runs step-by-step text countdown visuals.
 * @param {HTMLElement} countdownDiv - Element.
 */
function runCountdownVisuals(countdownDiv) {
    let steps = ["3", "2", "1", "GO!"];
    let i = 0;
    countdownDiv.innerHTML = steps[i];
    let intervalId = IntervalHub.start(() => {
        i++;
        if (i < steps.length) countdownDiv.innerHTML = steps[i];
        else IntervalHub.stop(intervalId);
    }, 1000);
}

/**
 * Hides the start screen overlay and initializes init.
 */
function hideStartScreen() {
    let startScreen = document.getElementById("start-screen");
    if (startScreen) startScreen.style.display = "none";
    document.body.classList.add("game-active");
    isStarting = false;
    init();
}

window.restartGame = function () {
    hideScreensAndStopWorld();
    initNewWorldInstance();
};

window.returnToStartScreen = function () {
    stopActiveWorldAndAudio();
    resetUIReturnScreens();
    window.world = null;
    isStarting = false;
};

/**
 * Stops active world objects and sounds.
 */
function stopActiveWorldAndAudio() {
    if (window.world?.stopGame) window.world.stopGame();
    window.world?.audioHub?.stop("character_snoring");
    window.world?.character?.stopSnoring?.();
    stopAllHubSoundsLists();
}

/**
 * Stops all sounds across world and global sound hubs.
 */
function stopAllHubSoundsLists() {
    [window.world?.audioHub?.sounds, globalAudioHub.sounds].forEach(
        (sounds) => {
            if (sounds) {
                for (let key in sounds) {
                    let s = sounds[key]?.file;
                    if (s) {
                        s.pause();
                        s.currentTime = 0;
                    }
                }
            }
        },
    );
}

/**
 * Resets UI elements on return screen.
 */
function resetUIReturnScreens() {
    document.getElementById("game-over-screen").classList.add("hidden");
    document.getElementById("win-screen").classList.add("hidden");
    document.getElementById("countdown-display")?.remove();
    document.body.classList.remove("game-active");
    let startScreen = document.getElementById("start-screen");
    if (startScreen) startScreen.style.display = "";
}

/**
 * Hides overlay screens and stops current world.
 */
function hideScreensAndStopWorld() {
    document.getElementById("game-over-screen").classList.add("hidden");
    document.getElementById("win-screen").classList.add("hidden");
    if (window.world?.stopGame) window.world.stopGame();
}

/**
 * Instantiates a fresh game world instance.
 */
function initNewWorldInstance() {
    canvas = document.getElementById("canvas");
    if (!canvas) return console.error("Canvas element not found!");
    keyboard.reset();
    world = new World(canvas, keyboard);
    window.world = world;
    applyAudioStateToNewWorld(world);
}

/**
 * Applies correct mute or background audio state to new world.
 * @param {World} newWorld - New world instance.
 */
function applyAudioStateToNewWorld(newWorld) {
    if (globalAudioHub.isMuted) {
        newWorld.audioHub.isMuted = true;
        for (let key in newWorld.audioHub.sounds) {
            if (newWorld.audioHub.sounds[key]?.file)
                newWorld.audioHub.sounds[key].file.muted = true;
        }
    } else {
        let bg = newWorld.audioHub.sounds["background"]?.file;
        if (bg) bg.currentTime = 0;
        newWorld.audioHub.play("background", 0.2);
    }
}
