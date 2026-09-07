import { MovableObject } from "./movable-objects.class.js";
import { ImageHub } from "./image.hub.js";
import { IntervalHub } from "./interval-hub.class.js";

/**
 * Represents the final boss of the game.
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
     * Creates a new final boss instance.
     * @param {number} [startX=3200] - Horizontal starting position.
     */
    constructor(startX) {
        super();
        this.initializeBossAssets(startX);
    }

    /**
     * Initializes images and start position.
     * @param {number} startX - Horizontal coordinate.
     */
    initializeBossAssets(startX) {
        this.loadImage("assets/img/boss/bossTransformation0.webp");
        this.loadBossImages();
        this.x = startX !== undefined ? startX : 3200;
        this.y = 80;
    }

    /**
     * Loads all asset image arrays for animations.
     */
    loadBossImages() {
        this.loadImages(this.imageHub.images_boss_transformation);
        this.loadImages(this.imageHub.images_boss_walk);
        this.loadImages(this.imageHub.images_boss_hurt);
        this.loadImages(this.imageHub.images_boss_dead);
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
     * Executes the transformation interval loop.
     */
    runTransformationLoop() {
        let index = 0;
        let intervalId = IntervalHub.start(() => {
            let images = this.imageHub.images_boss_transformation;
            if (index < images.length) {
                this.img = this.imageCache[images[index]];
                index++;
            } else {
                IntervalHub.stop(intervalId);
                this.completeAwakening();
            }
        }, 250);
    }

    /**
     * Finalizes the awakening state.
     */
    completeAwakening() {
        this.isTransforming = false;
        this.isAwake = true;
        this.animate();
    }

    /**
     * Moves the boss horizontally toward the character.
     * @param {MovableObject} character - Target object.
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
     * Starts the cyclic update loop for animations.
     */
    animate() {
        IntervalHub.start(() => {
            if (this.isDead()) {
                this.handleBossDeath();
            } else if (this.isHurt()) {
                this.handleBossHurt();
            } else if (this.isAwake) {
                this.handleBossWalking();
            }
        }, 1000 / 10);
    }

    /**
     * Displays the hurt image.
     */
    handleBossHurt() {
        let path = this.imageHub.images_boss_hurt[0];
        this.img = this.imageCache[path];
    }

    /**
     * Manages the death sequence and audio cues.
     */
    handleBossDeath() {
        if (this.isDeadAnimationPlayed) return;
        this.isDeadAnimationPlayed = true;
        this.playBossDeathAudio();
        this.runBossDeathAnimation();
        this.scheduleWinScreenDisplay();
    }

    /**
     * Triggers sound effects when the boss dies.
     */
    playBossDeathAudio() {
        if (!this.world?.audioHub) return;
        this.world.audioHub.play("bossDead", 1.0);
        this.world.audioHub.stop("bossLaufSound");
    }

    /**
     * Plays the death animation frames sequentially.
     */
    runBossDeathAnimation() {
        let index = 0;
        let intervalId = IntervalHub.start(() => {
            let images = this.imageHub.images_boss_dead;
            if (index < images.length) {
                this.img = this.imageCache[images[index]];
                index++;
            } else {
                IntervalHub.stop(intervalId);
            }
        }, 150);
    }

    /**
     * Schedules the win screen and audio sequence.
     */
    scheduleWinScreenDisplay() {
        let duration = this.imageHub.images_boss_dead.length * 150;
        setTimeout(() => {
            this.executeWinSequence();
        }, duration);
    }

    /**
     * Executes the win sound playback and screen display.
     */
    executeWinSequence() {
        let winScreen = document.getElementById("win-screen");
        let audioHub = this.world?.audioHub;
        if (audioHub && !audioHub.isMuted) {
            let soundObj = audioHub.sounds["youWin"];
            if (soundObj?.file) {
                this.playWinSoundFile(soundObj.file, winScreen);
                return;
            }
        }
        if (winScreen) winScreen.classList.remove("hidden");
    }

    /**
     * Plays the win sound file and handles its completion event.
     * @param {HTMLAudioElement} audioFile - Sound file element.
     * @param {HTMLElement} winScreen - Win screen DOM element.
     */
    playWinSoundFile(audioFile, winScreen) {
        audioFile.currentTime = 0;
        audioFile.volume = 1.0;
        audioFile.onended = () => {
            if (winScreen) winScreen.classList.remove("hidden");
        };
        audioFile.play().catch(() => {
            if (winScreen) winScreen.classList.remove("hidden");
        });
    }

    /**
     * Cycles through the walking animation frames.
     */
    handleBossWalking() {
        let length = this.imageHub.images_boss_walk.length;
        let index = this.currentImage % length;
        let path = this.imageHub.images_boss_walk[index];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
}
