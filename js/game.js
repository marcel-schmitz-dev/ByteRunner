import { World } from "../models/world.class.js";
import { Character } from "../models/character.class.js";
import { HardDrive } from "../models/hard-drive.class.js";
import { MouseDrone } from "../models/mouse-drone.class.js";
import { Endboss } from "../models/endboss.class.js";
import { Keyboard } from "../models/keyboard.class.js";

let canvas;
let world;
let keyboard = new Keyboard();

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
});

window.addEventListener("keyup", (e) => {
    if (e.code == "ArrowLeft" || e.code == "KeyA") keyboard.LEFT = false;
    if (e.code == "ArrowRight" || e.code == "KeyD") keyboard.RIGHT = false;
    if (e.code == "ArrowUp" || e.code == "KeyW") keyboard.UP = false;
    if (e.code == "ArrowDown" || e.code == "KeyS") keyboard.DOWN = false;
    if (e.code == "Space") keyboard.SPACE = false;
});

init();
