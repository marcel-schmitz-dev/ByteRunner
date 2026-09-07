import { Level } from "../models/level.class.js";
import { BackgroundObject } from "../models/background-object.class.js";
import { MouseDrone } from "../models/mouse-drone.class.js";
import { HardDrive } from "../models/hard-drive.class.js";
import { Endboss } from "../models/endboss.class.js";
import { Cloud } from "../models/cloud.class.js";
import { MovableObject } from "../models/movable-objects.class.js";
import { DrawableObject } from "../models/drawable-object.class.js";
import { ImageHub } from "../models/image.hub.js";
import { IntervalHub } from "../models/interval-hub.class.js";

const BACKGROUND_IMAGE_PATHS = [
    "assets/img/background/background0.webp",
    "assets/img/background/background.webp",
    "assets/img/background/background0.webp",
    "assets/img/background/background.webp",
    "assets/img/background/background.webp",
    "assets/img/background/background0.webp",
    "assets/img/background/background.webp",
    "assets/img/background/background0.webp",
];

const ENEMY_SPAWNS = [
    [MouseDrone, 500],
    [HardDrive, 700],
    [MouseDrone, 900],
    [HardDrive, 1100],
    [MouseDrone, 1300],
    [HardDrive, 1500],
    [MouseDrone, 1700],
    [HardDrive, 1900],
    [MouseDrone, 2100],
    [HardDrive, 2300],
    [MouseDrone, 2500],
    [HardDrive, 2700],
    [MouseDrone, 2900],
    [HardDrive, 3050],
    [Endboss, 4000],
];

const CLOUD_POSITIONS = [500, 1000, 1500, 2000, 2500, 3000, 3500];
const COIN_POSITIONS = [
    [250, 340], [500, 300], [750, 350], [1000, 300], [1250, 340],
    [1500, 300], [1750, 350], [2000, 300], [2200, 340], [2400, 300],
];
const DISC_POSITIONS = [
    [350, 340], [650, 340], [950, 340], [1150, 340], [1400, 340],
    [1650, 340], [1900, 340], [2100, 340], [2300, 340], [2450, 340],
];

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
        IntervalHub.start(() => {
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
    BackgroundObject.resetPositions();
    return new Level(
        createBackgrounds(),
        createEnemies(),
        createClouds(),
        createCoins(),
        createDiscs(),
    );
}

/** @returns {BackgroundObject[]} Background objects for the level. */
function createBackgrounds() {
    return BACKGROUND_IMAGE_PATHS.map((imagePath) => new BackgroundObject(imagePath));
}

/** @returns {MovableObject[]} Enemies for the level. */
function createEnemies() {
    return ENEMY_SPAWNS.map(([EnemyType, position]) => new EnemyType(position));
}

/** @returns {Cloud[]} Clouds for the level. */
function createClouds() {
    return CLOUD_POSITIONS.map((position) => new Cloud(position));
}

/** @returns {Coin[]} Coins for the level. */
function createCoins() {
    return COIN_POSITIONS.map(([x, y]) => new Coin(x, y));
}

/** @returns {CollectibleDisc[]} Collectible discs for the level. */
function createDiscs() {
    return DISC_POSITIONS.map(([x, y]) => new CollectibleDisc(x, y));
}
