import { Character } from "./character.class.js";
import { initLevel1 } from "../levels/level1.js";
import { StatusBar } from "./status-bar.class.js";
import { BossHpBar } from "./boss-hp-bar.class.js";
import { ThrowableObject } from "./throwable-object.class.js";
import { AudioHub } from "./audio.hub.js";
import { IntervalHub } from "./interval-hub.class.js";
import * as CollisionLogic from "./world-collision.js";
import { COIN_BAR_IMAGES, DISC_BAR_IMAGES, HP_IMAGES } from "./hud-images.js";

/**
 * Represents the main game world, managing rendering, game loops, collisions, and entities.
 */
export class World {
    character;
    keyboard;
    level;
    canvas;
    ctx;
    camera_x = 0;
    statusBar = new StatusBar(HP_IMAGES, 100, 15, 200, 50);
    coinBar = new StatusBar(COIN_BAR_IMAGES, 0, 75, 160, 50);
    discBar = new StatusBar(DISC_BAR_IMAGES, 0, 135, 160, 50);
    bossHpBar = new BossHpBar();
    bossSpawned = false;
    throwableObjects = [];
    lastThrowTime = 0;
    audioHub = new AudioHub();
    isGameRunning = true;

    /**
     * Initializes the game world.
     * @param {HTMLCanvasElement} canvas - The canvas element.
     * @param {Object} keyboard - The keyboard handler.
     */
    constructor(canvas, keyboard) {
        this.initCanvasContext(canvas, keyboard);
        this.startCoreSystems();
        this.resetBarsToZero();
    }

    /**
     * Initializes canvas context and audio.
     * @param {HTMLCanvasElement} canvas - The canvas.
     * @param {Object} keyboard - The keyboard.
     */
    initCanvasContext(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.level = initLevel1();
        this.character = new Character(this);
        this.playBackgroundAudio();
    }

    /**
     * Plays background audio from start.
     */
    playBackgroundAudio() {
        let bgSound = this.audioHub.sounds["background"];
        if (bgSound?.file) bgSound.file.currentTime = 0;
        this.audioHub.play("background", 0.2);
    }

    /**
     * Starts core game systems like draw and run loops.
     */
    startCoreSystems() {
        this.draw();
        this.run();
        this.checkThrowObjects();
    }

    /**
     * Resets bar percentages to zero.
     */
    resetBarsToZero() {
        this.coinBar.setPercentage(0, "0");
        this.discBar.setPercentage(0, "0");
    }

    /**
     * Runs the main game loop interval.
     */
    run() {
        this.isGameRunning = true;
        IntervalHub.start(() => this.runLoopTick(), 1000 / 60);
    }

    /**
     * Executes one tick of the main game loop.
     */
    runLoopTick() {
        if (!this.isGameRunning) return;
        if (this.handleBossDefeatState()) return;
        this.checkCollisions();
        this.checkBossAwakening();
        this.checkCollectibles();
        this.handleBossBehavior();
    }

    /**
     * Handles boss defeat checks and state changes.
     * @returns {boolean} True if boss is defeated.
     */
    handleBossDefeatState() {
        if (!this.isBossDefeated()) return false;
        this.resetKeyboardStates();
        this.stopBossRelatedAudio();
        this.setWinCharacterState();
        return true;
    }

    /**
     * Checks if endboss is defeated.
     * @returns {boolean} True if defeated.
     */
    isBossDefeated() {
        let endboss = this.level.enemies.find((e) => this.isEndboss(e));
        return endboss && endboss.isDead();
    }

    /**
     * Resets all keyboard input flags.
     */
    resetKeyboardStates() {
        this.keyboard.LEFT = false;
        this.keyboard.RIGHT = false;
        this.keyboard.UP = false;
        this.keyboard.SPACE = false;
        this.keyboard.THROW = false;
    }

    /**
     * Sets character state to game won.
     */
    setWinCharacterState() {
        if (!this.character) return;
        this.character.isGameWon = true;
        if (typeof this.character.stopSnoring === "function") {
            this.character.stopSnoring();
        }
    }

    /**
     * Stops the entire game.
     */
    stopGame() {
        this.isGameRunning = false;
        IntervalHub.stopAll();
        this.stopBossRelatedAudio();
    }

    /**
     * Stops background and boss sounds.
     */
    stopBossRelatedAudio() {
        this.audioHub.stop("background");
        this.audioHub.stop("bossFightSound");
        this.audioHub.stop("bossLaufSound");
    }

    /**
     * Handles boss behavior updates.
     */
    handleBossBehavior() {
        this.level.enemies.forEach((enemy) => {
            if (this.isEndboss(enemy)) enemy.hunt(this.character);
        });
    }

    /**
     * Checks if the boss should awaken.
     */
    checkBossAwakening() {
        this.level.enemies.forEach((enemy) => {
            if (this.isEndboss(enemy) && !enemy.hasBeenSeen) {
                this.evaluateBossProximity(enemy);
            }
        });
    }

    /**
     * Evaluates distance to trigger boss awakening.
     * @param {Object} enemy - The enemy object.
     */
    evaluateBossProximity(enemy) {
        let distance = enemy.x - this.character.x;
        let isWithinRange =
            (distance < 500 && distance > -200) ||
            this.character.x >= this.level.level_end_x - 200;
        if (isWithinRange && !this.bossSpawned) {
            this.triggerBossAwakening(enemy);
        }
    }

    /**
     * Triggers the boss awakening sequence and sounds.
     * @param {Object} enemy - The enemy object.
     */
    triggerBossAwakening(enemy) {
        enemy.world = this;
        enemy.awakening();
        this.bossSpawned = true;
        this.audioHub.stop("background");
        this.audioHub.play("bossDetected", 0.4);
        this.audioHub.play("bossFightSound", 0.3);
        this.audioHub.play("bossLaufSound", 0.4);
    }

    /**
     * Checks collectibles interactions.
     */
    checkCollectibles() {
        this.checkCoinCollection();
        this.checkDiscCollection();
    }

    /**
     * Processes coin collections.
     */
    checkCoinCollection() {
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
     * Processes collectible disc collection.
     */
    checkDiscCollection() {
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
     * Starts the object throwing listener loop.
     */
    checkThrowObjects() {
        IntervalHub.start(() => this.throwLoopTick(), 100);
    }

    /**
     * Tick handler for throwing objects.
     */
    throwLoopTick() {
        if (!this.isGameRunning) return;
        let currentTime = new Date().getTime();
        let canThrow =
            this.keyboard.THROW && currentTime - this.lastThrowTime > 500;
        if (canThrow && this.character.discs && this.character.discs > 0) {
            this.executeThrowAction(currentTime);
        }
    }

    /**
     * Executes the throwing of a disc.
     * @param {number} currentTime - Current timestamp.
     */
    executeThrowAction(currentTime) {
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
     * Checks game collisions.
     */
    checkCollisions() {
        CollisionLogic.checkCollisions.call(this);
    }

    /**
     * Checks if an entity is an endboss.
     * @param {Object} entity - The entity.
     * @returns {boolean} True if endboss.
     */
    isEndboss(entity) {
        return CollisionLogic.isEndboss.call(this, entity);
    }

    /**
     * Main render draw loop.
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
     * Draws all world entities and background.
     */
    drawWorldObjects() {
        this.addObjectsToMap(this.level.backgroundObjects);
        this.ctx.fillStyle = "rgba(10, 10, 20, 0.4)";
        this.ctx.fillRect(
            -this.camera_x,
            0,
            this.canvas.width,
            this.canvas.height,
        );
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.collectibleDiscs);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.character);
    }

    /**
     * Draws user interface bars.
     */
    drawUIElements() {
        this.addToMap(this.statusBar);
        this.addToMap(this.coinBar);
        this.addToMap(this.discBar);
        if (this.bossSpawned) this.addToMap(this.bossHpBar);
    }

    /**
     * Adds a list of objects to the canvas map.
     * @param {Array} objects - Array of movable objects.
     */
    addObjectsToMap(objects) {
        if (!objects) return;
        objects.forEach((object) => {
            this.addToMap(object);
        });
    }

    /**
     * Draws an individual movable object, handling mirroring.
     * @param {Object} mo - Movable object.
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
