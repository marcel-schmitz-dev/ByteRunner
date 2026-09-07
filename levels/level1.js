import { Level } from "../models/level.class.js";
import { BackgroundObject } from "../models/background-object.class.js";
import { MouseDrone } from "../models/mouse-drone.class.js";
import { HardDrive } from "../models/hard-drive.class.js";
import { Endboss } from "../models/endboss.class.js";
import { Cloud } from "../models/cloud.class.js";
import { MovableObject } from "../models/movable-objects.class.js";
import { DrawableObject } from "../models/drawable-object.class.js";
import { ImageHub } from "../models/image.hub.js";

/**
 * Represents a collectible data disc item in the level.
 * @extends MovableObject
 */
class CollectibleDisc extends MovableObject {
    height = 40;
    width = 40;

    /**
     * Creates a collectible disc instance at given coordinates.
     * @param {number} x - Horizontal position.
     * @param {number} y - Vertical position.
     */
    constructor(x, y) {
        super();
        this.initDiscAsset(x, y);
    }

    /**
     * Loads the disc image and sets position.
     * @param {number} x - Horizontal position.
     * @param {number} y - Vertical position.
     */
    initDiscAsset(x, y) {
        this.loadImage("assets/img/character/attack/disc.webp");
        this.x = x;
        this.y = y;
    }
}

/**
 * Represents a collectible coin item in the level.
 * @extends DrawableObject
 */
export class Coin extends DrawableObject {
    imageHub = new ImageHub();
    height = 40;
    width = 40;

    /**
     * Creates a coin instance, loads its animation frames, and starts animation.
     * @param {number} x - Horizontal position.
     * @param {number} y - Vertical position.
     */
    constructor(x, y) {
        super();
        this.initCoinAssets(x, y);
        this.animate();
    }

    /**
     * Loads coin images and coordinates.
     * @param {number} x - Horizontal position.
     * @param {number} y - Vertical position.
     */
    initCoinAssets(x, y) {
        this.loadImage("assets/img/coin/coin0.webp");
        this.loadImages(this.imageHub.images_coin);
        this.x = x;
        this.y = y;
    }

    /**
     * Starts the animation loop for the coin.
     */
    animate() {
        setInterval(() => {
            let i = this.currentImage % this.imageHub.images_coin.length;
            let path = this.imageHub.images_coin[i];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, 200);
    }
}

/**
 * Initializes and returns a fresh level instance.
 * @returns {Level} A new level instance.
 */
export function initLevel1() {
    return new Level(
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
            new MouseDrone(),
            new MouseDrone(),
            new HardDrive(),
            new HardDrive(),
            new HardDrive(),
            new HardDrive(),
            new HardDrive(),
            new HardDrive(),
            new HardDrive(),
            new Endboss(3200),
        ],
        [
            new Cloud(500),
            new Cloud(1000),
            new Cloud(1500),
            new Cloud(2000),
            new Cloud(2500),
            new Cloud(3000),
            new Cloud(3500),
        ],
        [
            new Coin(250, 340),
            new Coin(500, 300),
            new Coin(750, 350),
            new Coin(1000, 300),
            new Coin(1250, 340),
            new Coin(1500, 300),
            new Coin(1750, 350),
            new Coin(2000, 300),
            new Coin(2200, 340),
            new Coin(2400, 300),
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
        ]
    );
}