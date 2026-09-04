import { Character } from "./character.class.js";
import { level1 } from "../levels/level1.js";
import { StatusBar } from "./status-bar.class.js";
import { BossHpBar } from "./boss-hp-bar.class.js";
import { ThrowableObject } from "./throwable-object.class.js";
import { ImageHub } from "./image.hub.js";
import { AudioHub } from "./audio.hub.js";

/**
 * Represents the main game world, managing rendering, game loops, collisions, and entities.
 */
export class World {
    character;
    keyboard;
    level = level1;
    canvas;
    ctx;
    camera_x = 0;
    imageHub = new ImageHub();
    statusBar = new StatusBar(this.imageHub.images_hp, 100, 15, 200, 50);
    coinBar = new StatusBar(this.imageHub.images_coinbar, 0, 75, 160, 50);
    discBar = new StatusBar(
        this.imageHub.images_disc || this.imageHub.images_discs,
        0,
        135,
        160,
        50,
    );
    bossHpBar = new BossHpBar();
    bossSpawned = false;
    throwableObjects = [];
    lastThrowTime = 0;
    audioHub = new AudioHub();

    /**
     * Initializes a new instance of the World class.
     * @param {HTMLCanvasElement} canvas - The HTML canvas element.
     * @param {Object} keyboard - The keyboard input controller.
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.audioHub.play("background", 0.2);
        this.character = new Character(this);
        this.draw();
        this.run();
        this.checkThrowObjects();

        this.coinBar.setPercentage(0, "0");
        this.discBar.setPercentage(0, "0");
    }

    /**
     * Starts the main game loop running at 60 FPS.
     */
    run() {
        setInterval(() => {
            let endboss = this.level.enemies.find((e) => this.isEndboss(e));
            if (endboss && endboss.isDead()) {
                this.keyboard.LEFT = false;
                this.keyboard.RIGHT = false;
                this.keyboard.UP = false;
                this.keyboard.SPACE = false;
                this.keyboard.THROW = false;
                return;
            }

            this.checkCollisions();
            this.checkBossAwakening();
            this.checkCollectibles();
            this.handleBossBehavior();
        }, 1000 / 60);
    }

    /**
     * Triggers the hunt behavior if the endboss is present in the level.
     */
    handleBossBehavior() {
        this.level.enemies.forEach((enemy) => {
            if (this.isEndboss(enemy)) {
                enemy.hunt(this.character);
            }
        });
    }

    /**
     * Checks if the character is close enough to wake up the endboss.
     */
    checkBossAwakening() {
        this.level.enemies.forEach((enemy) => {
            if (this.isEndboss(enemy) && this.shouldAwakenBoss(enemy)) {
                this.activateBoss(enemy);
            }
        });
    }

    /**
     * Determines whether the boss should trigger its awakening sequence.
     * @param {Object} enemy - The enemy object to evaluate.
     * @returns {boolean} True if the boss should wake up.
     */
    shouldAwakenBoss(enemy) {
        let distance = enemy.x - this.character.x;
        let isWithinRange =
            (distance < 500 && distance > -200) || this.character.x >= 2880;
        return isWithinRange && !enemy.hasBeenSeen;
    }

    /**
     * Activates the endboss, plays audio cues, and updates states.
     * @param {Object} enemy - The endboss enemy instance.
     */
    activateBoss(enemy) {
        enemy.world = this;
        enemy.awakening();
        this.bossSpawned = true;

        this.audioHub.stop("background");
        this.audioHub.stop("backgroundSound");
        this.audioHub.play("bossDetected", 0.4);
        this.audioHub.play("bossFightSound", 0.3);
        this.audioHub.play("bossLaufSound", 0.4);
    }

    /**
     * Checks and handles collisions between character and collectible items.
     */
    checkCollectibles() {
        this.checkCoinCollisions();
        this.checkDiscCollisions();
    }

    /**
     * Handles collection of coins.
     */
    checkCoinCollisions() {
        if (!this.level.coins) return;
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.character.coins = Math.min(
                    (this.character.coins || 0) + 1,
                    10,
                );
                this.audioHub.play("pickCoin", 0.5);
                this.coinBar.setPercentage(
                    this.character.coins * 10,
                    `${this.character.coins}`,
                );
                this.level.coins.splice(index, 1);
            }
        });
    }

    /**
     * Handles collection of collectible discs.
     */
    checkDiscCollisions() {
        if (!this.level.collectibleDiscs) return;
        this.level.collectibleDiscs.forEach((discItem, index) => {
            if (this.character.isColliding(discItem)) {
                this.character.discs = Math.min(
                    (this.character.discs || 0) + 1,
                    10,
                );
                this.audioHub.play("pickDisc", 0.5);
                this.discBar.setPercentage(
                    this.character.discs * 20,
                    `${this.character.discs}`,
                );
                this.level.collectibleDiscs.splice(index, 1);
            }
        });
    }

    /**
     * Listens for throw input and spawns throwable objects if available.
     */
    checkThrowObjects() {
        setInterval(() => {
            let currentTime = new Date().getTime();
            let canThrow =
                this.keyboard.THROW && currentTime - this.lastThrowTime > 500;

            if (canThrow && this.character.discs && this.character.discs > 0) {
                this.executeThrow(currentTime);
            }
        }, 100);
    }

    /**
     * Executes the throwing mechanism, decrementing ammo and instantiating the disc.
     * @param {number} currentTime - The current timestamp.
     */
    executeThrow(currentTime) {
        this.character.discs--;
        this.audioHub.play("characterDiscWerfen", 0.5);
        this.discBar.setPercentage(
            this.character.discs * 20,
            `${this.character.discs}`,
        );

        let discX = this.character.otherDirection
            ? this.character.x - 10
            : this.character.x + 50;
        let disc = new ThrowableObject(
            discX,
            this.character.y + 50,
            this.character.otherDirection,
        );

        this.throwableObjects.push(disc);
        this.lastThrowTime = currentTime;
    }

    /**
     * Checks all collisions between character, enemies, and thrown projectiles.
     */
    checkCollisions() {
        this.checkEnemyCollisions();
        this.checkProjectileCollisions();
    }

    /**
     * Checks collisions between the character and active enemies.
     */
    checkEnemyCollisions() {
        this.level.enemies.forEach((enemy, enemyIndex) => {
            if (this.isCharacterCollidingWith(enemy)) {
                this.handleEnemyCollisionResponse(enemy, enemyIndex);
            }
        });
    }

    /**
     * Evaluates bounding box overlap between character and an enemy.
     * @param {Object} enemy - The target enemy entity.
     * @returns {boolean} True if intersecting.
     */
    isCharacterCollidingWith(enemy) {
        let isCollidingX =
            this.character.x + this.character.width - 15 > enemy.x + 10 &&
            this.character.x + 15 < enemy.x + enemy.width - 10;

        let isCollidingY =
            this.character.y + this.character.height >= enemy.y &&
            this.character.y <= enemy.y + enemy.height;

        return isCollidingX && isCollidingY;
    }

    /**
     * Decides whether the character stomps an enemy or takes damage.
     * @param {Object} enemy - The enemy involved.
     * @param {number} enemyIndex - Index of the enemy in the level array.
     */
    handleEnemyCollisionResponse(enemy, enemyIndex) {
        let isEndboss = this.isEndboss(enemy);
        let characterBottom = this.character.y + this.character.height;
        let isFalling = this.character.speedY < 0;
        let isJumpingOnTop =
            !isEndboss && isFalling && characterBottom <= enemy.y + 30;

        if (isJumpingOnTop) {
            this.character.speedY = 22;
            this.character.isBouncing = true;

            setTimeout(() => {
                this.character.isBouncing = false;
            }, 300);

            this.audioHub.play("enemiesDead", 0.5);
            this.level.enemies.splice(enemyIndex, 1);
        } else if (!this.character.isHurt()) {
            this.character.hit();
            this.statusBar.setPercentage(this.character.energy);
        }
    }

    /**
     * Checks if thrown discs hit the active endboss.
     */
    checkProjectileCollisions() {
        for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
            let disc = this.throwableObjects[i];

            this.level.enemies.forEach((enemy) => {
                if (this.isValidBossHit(enemy, disc)) {
                    this.throwableObjects.splice(i, 1);
                    this.inflictBossDamage(enemy);
                }
            });
        }
    }

    /**
     * Validates if a throwable item can damage the endboss.
     * @param {Object} enemy - The enemy object.
     * @param {Object} disc - The throwable projectile.
     * @returns {boolean} True if valid hit.
     */
    isValidBossHit(enemy, disc) {
        return (
            this.isEndboss(enemy) &&
            enemy.isAwake &&
            !enemy.isDead() &&
            disc.isColliding(enemy)
        );
    }

    /**
     * Applies damage to the endboss and updates its health bar.
     * @param {Object} enemy - The endboss instance.
     */
    inflictBossDamage(enemy) {
        if (typeof enemy.hit === "function") {
            enemy.hit(20);
            this.bossHpBar.setPercentage(enemy.energy);
            this.audioHub.play("bossHurt", 0.5);
        }
    }

    /**
     * Utility method to check if an entity is the Endboss.
     * @param {Object} entity - The object to check.
     * @returns {boolean} True if constructor name matches Endboss.
     */
    isEndboss(entity) {
        return entity.constructor.name === "Endboss";
    }

    /**
     * Renders the entire world frame, including backgrounds, entities, and UI elements.
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        this.drawDarkOverlay();

        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.collectibleDiscs);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.character);

        this.ctx.translate(-this.camera_x, 0);

        this.drawUIElements();

        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    /**
     * Draws a subtle dark atmosphere overlay across the scrolling level.
     */
    drawDarkOverlay() {
        this.ctx.fillStyle = "rgba(10, 10, 20, 0.4)";
        this.ctx.fillRect(
            -this.camera_x,
            0,
            this.canvas.width,
            this.canvas.height,
        );
    }

    /**
     * Renders user interface elements fixed to the screen overlay.
     */
    drawUIElements() {
        this.addToMap(this.statusBar);
        this.addToMap(this.coinBar);
        this.addToMap(this.discBar);

        if (this.bossSpawned) {
            this.addToMap(this.bossHpBar);
        }
    }

    /**
     * Adds an array of game objects to the rendering pipeline.
     * @param {Array} objects - List of renderable objects.
     */
    addObjectsToMap(objects) {
        if (!objects) return;
        objects.forEach((object) => {
            this.addToMap(object);
        });
    }

    /**
     * Renders a single movable game object, handling horizontal mirroring if required.
     * @param {Object} mo - The movable object.
     */
    addToMap(mo) {
        if (mo.otherDirection) {
            this.ctx.save();
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(
                mo.img,
                -mo.x - mo.width,
                mo.y,
                mo.width,
                mo.height,
            );
            this.ctx.restore();
        } else {
            mo.draw(this.ctx);
        }
    }
}
