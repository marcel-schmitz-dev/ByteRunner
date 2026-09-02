import { Level } from "../models/level.class.js";
import { BackgroundObject } from "../models/background-object.class.js";
import { MouseDrone } from "../models/mouse-drone.class.js";
import { HardDrive } from "../models/hard-drive.class.js";
import { Endboss } from "../models/endboss.class.js";
import { Cloud } from "../models/cloud.class.js";
import { MovableObject } from "../models/movable-objects.class.js";

class CollectibleDisc extends MovableObject {
    height = 40;
    width = 40;

    constructor(x, y) {
        super();
        this.loadImage("assets/img/character/attack/disc.webp");
        this.x = x;
        this.y = y;
    }
}

class CoinItem extends MovableObject {
    height = 40;
    width = 40;

    constructor(x, y) {
        super();
        this.loadImage("assets/img/coin/coin0.webp");
        this.x = x;
        this.y = y;
    }
}

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
    [
        new CoinItem(250, 340),
        new CoinItem(500, 300),
        new CoinItem(750, 350),
        new CoinItem(1000, 300),
        new CoinItem(1250, 340),
        new CoinItem(1500, 300),
        new CoinItem(1750, 350),
        new CoinItem(2000, 300),
        new CoinItem(2200, 340),
        new CoinItem(2400, 300),
    ],
    [
        new CollectibleDisc(350, 340),
        new CollectibleDisc(650, 340),
        new CollectibleDisc(950, 340),
        new CollectibleDisc(1150, 340),
        new CollectibleDisc(1400, 340),
        new CollectibleDisc(1650, 340),
        new CollectibleDisc(1900, 340),
        new CollectibleDisc(2100, 340),
        new CollectibleDisc(2300, 340),
        new CollectibleDisc(2450, 340),
    ],
);
