import { World } from "../models/world.class.js";
import { Character } from "../models/character.class.js";
import { HardDrive } from "../models/hard-drive.class.js";
import { MouseDrone } from "../models/mouse-drone.class.js";
import { Boss } from "../models/boss.class.js";

let canvas;
let world;

function init() {
    canvas = document.getElementById("canvas");

    if (!canvas) {
        console.error("Canvas element not found!");
        return;
    }

    world = new World(canvas);
    window.world = world;
}

init();
