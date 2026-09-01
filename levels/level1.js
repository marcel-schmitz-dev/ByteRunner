import { Level } from "../models/level.class.js";
import { BackgroundObject } from "../models/background-object.class.js";
import { MouseDrone } from "../models/mouse-drone.class.js";
import { HardDrive } from "../models/hard-drive.class.js";
import { Endboss } from "../models/endboss.class.js";
import { Cloud } from "../models/cloud.class.js";

export const level1 = new Level(
    [
        new BackgroundObject("assets/img/background/background0.webp", -720, 0),
        new BackgroundObject("assets/img/background/background.webp", 0, 0),
        new BackgroundObject("assets/img/background/background0.webp", 719, 0),
        new BackgroundObject("assets/img/background/background.webp", 1439, 0),
        new BackgroundObject("assets/img/background/background0.webp", 2159, 0),
        new BackgroundObject("assets/img/background/background.webp", 2879, 0),
        new BackgroundObject("assets/img/background/background0.webp", 3599, 0),
    ],
    [
        new MouseDrone(),
        new MouseDrone(),
        new MouseDrone(),
        new MouseDrone(),
        new MouseDrone(),
        new HardDrive(),
        new HardDrive(),
        new HardDrive(),
        new HardDrive(),
        new HardDrive(),
        new Endboss(2700),
    ],
    [
        new Cloud(500),
        new Cloud(1000),
        new Cloud(1500),
        new Cloud(2000),
        new Cloud(2500),
    ],
);
