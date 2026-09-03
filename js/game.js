import { World } from "../models/world.class.js";
import { Keyboard } from "../models/keyboard.class.js";
import { AudioHub } from "../models/audio.hub.js";

let canvas;
let world;
let keyboard = new Keyboard();
let isStarting = false;

function init() {
    canvas = document.getElementById("canvas");

    if (!canvas) {
        console.error("Canvas element not found!");
        return;
    }

    world = new World(canvas, keyboard);
    window.world = world;
}

window.addEventListener("keydown", (e) => {
    if (e.code == "ArrowLeft" || e.code == "KeyA") keyboard.LEFT = true;
    if (e.code == "ArrowRight" || e.code == "KeyD") keyboard.RIGHT = true;
    if (e.code == "ArrowUp" || e.code == "KeyW") keyboard.UP = true;
    if (e.code == "ArrowDown" || e.code == "KeyS") keyboard.DOWN = true;
    if (e.code == "Space") keyboard.SPACE = true;
    if (e.code == "KeyL") keyboard.THROW = true;
});

window.addEventListener("keyup", (e) => {
    if (e.code == "ArrowLeft" || e.code == "KeyA") keyboard.LEFT = false;
    if (e.code == "ArrowRight" || e.code == "KeyD") keyboard.RIGHT = false;
    if (e.code == "ArrowUp" || e.code == "KeyW") keyboard.UP = false;
    if (e.code == "ArrowDown" || e.code == "KeyS") keyboard.DOWN = false;
    if (e.code == "Space") keyboard.SPACE = false;
    if (e.code == "KeyL") keyboard.THROW = false;
});

window.toggleModal = function (modalId) {
    let modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.toggle("hidden");
    }
};

window.startGame = function () {
    if (isStarting) return;
    isStarting = true;

    let startScreen = document.getElementById("start-screen");

    let startBtn = document.getElementById("start-btn");
    if (startBtn) startBtn.style.display = "none";

    let countdownDiv = document.getElementById("countdown-display");
    if (!countdownDiv) {
        countdownDiv = document.createElement("div");
        countdownDiv.id = "countdown-display";
        countdownDiv.style.position = "absolute";
        countdownDiv.style.top = "50%";
        countdownDiv.style.left = "50%";
        countdownDiv.style.transform = "translate(-50%, -50%)";
        countdownDiv.style.fontSize = "90px";
        countdownDiv.style.fontWeight = "bold";
        countdownDiv.style.zIndex = "100";

        countdownDiv.style.fontFamily = '"Courier New", Courier, monospace';
        countdownDiv.style.background =
            "linear-gradient(90deg, #00ffff, #ff0080)";
        countdownDiv.style.webkitBackgroundClip = "text";
        countdownDiv.style.webkitTextFillColor = "transparent";
        countdownDiv.style.textShadow = "0 0 20px rgba(0, 255, 255, 0.4)";

        startScreen.appendChild(countdownDiv);
    }

    let steps = ["3", "2", "1", "GO!"];
    let stepIndex = 0;

    let tempAudioHub = new AudioHub();
    let countdownSound = tempAudioHub.sounds["startSoundCountdown"];

    function startCountdownVisuals() {
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

    if (countdownSound) {
        countdownSound.volume = 0.6;
        countdownSound.currentTime = 0;

        countdownSound.onended = function () {
            if (startScreen) {
                startScreen.style.display = "none";
            }
            init();
        };

        countdownSound.play().catch((e) => {
            console.log("Audio play blocked, starting game directly:", e);
            if (startScreen) {
                startScreen.style.display = "none";
            }
            init();
        });

        setTimeout(() => {
            startCountdownVisuals();
        }, 350);
    } else {
        startCountdownVisuals();
        setTimeout(() => {
            if (startScreen) {
                startScreen.style.display = "none";
            }
            init();
        }, 4000);
    }
};
