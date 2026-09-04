import { Character } from "./character.class.js";
import { level1 } from "../levels/level1.js";
import { StatusBar } from "./status-bar.class.js";
import { BossHpBar } from "./boss-hp-bar.class.js";
import { ThrowableObject } from "./throwable-object.class.js";
import { ImageHub } from "./image.hub.js";
import { AudioHub } from "./audio.hub.js";
import * as CollisionLogic from "./world-collision.js";

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
    intervalIds = [];
    isGameRunning = true;

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
        this.isGameRunning = true;
        let id = setInterval(() => this.runLoopTick(), 1000 / 60);
        this.intervalIds.push(id);
    }

    /**
     * Executes one tick of the main game loop.
     */
    runLoopTick() {
        if (!this.isGameRunning) return;
        let endboss = this.level.enemies.find((e) => this.isEndboss(e));
        if (endboss && endboss.isDead()) {
            this.resetKeyboardStates();
            return;
        }
        this.checkCollisions();
        this.checkBossAwakening();
        this.checkCollectibles();
        this.handleBossBehavior();
    }

    /**
     * Resets all movement and action flags in the keyboard state.
     */
    resetKeyboardStates() {
        this.keyboard.LEFT = false;
        this.keyboard.RIGHT = false;
        this.keyboard.UP = false;
        this.keyboard.SPACE = false;
        this.keyboard.THROW = false;
    }

    /**
     * Stops all active intervals, sounds, and rendering loops for a clean restart.
     */
    stopGame() {
        this.isGameRunning = false;
        this.intervalIds.forEach((id) => clearInterval(id));
        this.intervalIds = [];
        this.audioHub.stop("background");
        this.audioHub.stop("bossFightSound");
        this.audioHub.stop("bossLaufSound");
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
        if (this.bossSpawned) return;
        
        enemy.world = this;
        enemy.awakening();
        this.bossSpawned = true;

        this.audioHub.stop("background");
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
        let id = setInterval(() => this.throwLoopTick(), 100);
        this.intervalIds.push(id);
    }

    /**
     * Executes the throw check on a loop interval tick.
     */
    throwLoopTick() {
        if (!this.isGameRunning) return;
        let currentTime = new Date().getTime();
        let canThrow =
            this.keyboard.THROW && currentTime - this.lastThrowTime > 500;

        if (canThrow && this.character.discs && this.character.discs > 0) {
            this.executeThrow(currentTime);
        }
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

    // Mapping der ausgelagerten Kollisions-Methoden
    checkCollisions() { CollisionLogic.checkCollisions.call(this); }
    checkEnemyCollisions() { CollisionLogic.checkEnemyCollisions.call(this); }
    isCharacterCollidingWith(enemy) { return CollisionLogic.isCharacterCollidingWith.call(this, enemy); }
    handleEnemyCollisionResponse(enemy, enemyIndex) { CollisionLogic.handleEnemyCollisionResponse.call(this, enemy, enemyIndex); }
    checkProjectileCollisions() { CollisionLogic.checkProjectileCollisions.call(this); }
    isEndboss(entity) { return CollisionLogic.isEndboss.call(this, entity); }

    /**
     * Renders the entire world frame, including backgrounds, entities, and UI elements.
     */
    draw() {
        if (!this.isGameRunning) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);

        this.drawWorldObjects();

        this.ctx.translate(-this.camera_x, 0);
        this.drawUIElements();

        let self = this;
        requestAnimationFrame(() => {
            self.draw();
        });
    }

    /**
     * Renders background, clouds, collectibles, enemies, and character with camera offset.
     */
    drawWorldObjects() {
        this.addObjectsToMap(this.level.backgroundObjects);
        this.drawDarkOverlay();
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.collectibleDiscs);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.character);
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