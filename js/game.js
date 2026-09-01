import { World } from "../models/world.class.js";
import { Character } from "../models/character.class.js";
import { HardDrive } from "../models/hard-drive.class.js";
import { MouseDrone } from "../models/mouse-drone.class.js";
import { Boss } from "../models/boss.class.js";

let canvas;
let ctx;

let world = new World();

function init() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
}

init();
