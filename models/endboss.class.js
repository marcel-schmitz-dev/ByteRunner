import { MovableObject } from "./movable-objects.class.js";
import { ImageHub } from "./image.hub.js";

/**
 * Represents the final boss of the game.
 * The boss can awaken, move toward the character, and play transformation, walk, or death animations.
 * @extends MovableObject
 */
export class Endboss extends MovableObject {
    height = 350;
    width = 300;
    speed = 1.5;
    energy = 100;

    imageHub = new ImageHub();
    currentImage = 0;

    hasBeenSeen = false;
    isTransforming = false;
    isAwake = false;
    isDeadAnimationPlayed = false;
    world;

    /**
     * Creates a new final boss instance and loads its animation assets.
     * @param {number} [startX=3200] - Horizontal starting position of the boss.
     */
    constructor(startX) {
        super();
        this.initializeBossAssets(startX);
    }

    /**
     * Initializes images, start position, and coordinates.
     * @param {number} startX - Horizontal coordinate.
     */
    initializeBossAssets(startX) {
        this.loadImage("assets/img/boss/bossTransformation0.webp");
        this.loadImages(this.imageHub.images_boss_transformation);
        this.loadImages(this.imageHub.images_boss_walk);
        this.loadImages(this.imageHub.images_boss_dead);

        this.x = startX !== undefined ? startX : 3200;
        this.y = 80;
    }

    /**
     * Triggers the boss's transformation sequence once.
     */
    awakening() {
        if (this.hasBeenSeen) return;
        this.hasBeenSeen = true;
        this.isTransforming = true;
        this.runTransformationLoop();
    }

    /**
     * Executes the interval loop for the transformation animation sequence.
     */
    runTransformationLoop() {
        let transformationIndex = 0;
        let transformInterval = setInterval(() => {
            if (transformationIndex < this.imageHub.images_boss_transformation.length) {
                let path = this.imageHub.images_boss_transformation[transformationIndex];
                this.img = this.imageCache[path];
                transformationIndex++;
            } else {
                clearInterval(transformInterval);
                this.completeAwakening();
            }
        }, 150);
    }

    /**
     * Finalizes the awakening state and starts the animation loop.
     */
    completeAwakening() {
        this.isTransforming = false;
        this.isAwake = true;
        this.animate();
    }

    /**
     * Moves the awakened boss horizontally toward the playable character.
     * @param {MovableObject} character - Target object the boss follows.
     */
    hunt(character) {
        if (!this.isAwake || this.isDead()) return;

        if (this.x > character.x) {
            this.x -= this.speed;
            this.otherDirection = false;
        } else if (this.x < character.x) {
            this.x += this.speed;
            this.otherDirection = true;
        }
    }

    /**
     * Starts the cyclic update loop for boss animations and health checks.
     */
    animate() {
        setInterval(() => {
            if (this.isDead()) {
                this.handleBossDeath();
            } else if (this.isAwake) {
                this.handleBossWalking();
            }
        }, 1000 / 10);
    }

    /**
     * Manages the boss's death sequence and audio cues.
     */
    handleBossDeath() {
        if (this.isDeadAnimationPlayed) return;
        this.isDeadAnimationPlayed = true;
        this.playBossDeathAudio();
        this.runBossDeathAnimation();
    }

    /**
     * Triggers sound effects when the boss dies.
     */
    playBossDeathAudio() {
        if (this.world?.audioHub) {
            this.world.audioHub.play("bossDead", 1.0);
            this.world.audioHub.stop("bossLaufSound");
        }
    }

    /**
     * Plays the death animation frames sequentially.
     */
    runBossDeathAnimation() {
        let deadIndex = 0;
        let deadInterval = setInterval(() => {
            if (deadIndex < this.imageHub.images_boss_dead.length) {
                let path = this.imageHub.images_boss_dead[deadIndex];
                this.img = this.imageCache[path];
                deadIndex++;
            } else {
                clearInterval(deadInterval);
            }
        }, 150);
    }

    /**
     * Cycles through the walking animation frames when the boss is active.
     */
    handleBossWalking() {
        let index = this.currentImage % this.imageHub.images_boss_walk.length;
        let path = this.imageHub.images_boss_walk[index];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
}