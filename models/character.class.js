import { MovableObject } from "./movable-objects.class.js";
import { ImageHub } from "./image.hub.js";

/**
 * Represents the playable character, controlling movement, animations, jumping behavior, and audio effects.
 * @extends MovableObject
 */
export class Character extends MovableObject {
    width = 100;
    height = 130;
    y = 300;
    speed = 5;
    coins = 0;
    discs = 0;

    imageHub = new ImageHub();
    currentImage = 0;
    world;
    deadAnimationStarted = false;
    isGameOverPlayed = false;
    isBouncing = false;
    idleTime = 0;
    isSnoringSoundActive = false;

    /**
     * Creates a new character instance and initializes its resources, gravity, and animation loops.
     * @param {Object} world - The game world the character interacts with.
     */
    constructor(world) {
        super();
        this.world = world;
        this.loadCharacterImages();
        this.applyGravity();
        this.animate();
    }

    /**
     * Loads all necessary image assets for the character.
     */
    loadCharacterImages() {
        this.loadImage("assets/img/character/walk/stehen.webp");
        this.loadImages(this.imageHub.images_walking);
        this.loadImages(this.imageHub.images_jumping);
        this.loadImages(this.imageHub.images_hurt);
        this.loadImages(this.imageHub.images_dead);
        this.loadImages(this.imageHub.images_idle);
        this.loadImages(this.imageHub.images_long_idle);
    }

    /**
     * Processes a hit and triggers the one-time game-over audio playback upon death.
     * @param {number} [damage=5] - The amount of damage points to deduct.
     */
    hit(damage = 5) {
        super.hit(damage);
        if (this.isDead() && !this.isGameOverPlayed && this.world?.audioHub) {
            this.isGameOverPlayed = true;
            this.stopSnoring();
            this.world.audioHub.play("gameOverSound", 0.8);
            this.world.audioHub.stop("background");
            this.world.audioHub.stop("characterRun");
        }
    }

    /**
     * Starts the movement and animation intervals for the character.
     */
    animate() {
        this.startMovementInterval();
        this.startAnimationInterval();
    }

    /**
     * Handles keyboard inputs for moving left, right, jumping, and camera tracking.
     */
    startMovementInterval() {
        setInterval(() => {
            this.handleHorizontalMovement();
            this.handleVerticalMovement();
            this.updateCameraPosition();
        }, 1000 / 60);
    }

    /**
     * Processes left and right movement flags based on keyboard input.
     */
    handleHorizontalMovement() {
        if (
            this.world?.keyboard.RIGHT &&
            this.x < this.world.level.level_end_x
        ) {
            this.x += this.speed;
            this.otherDirection = false;
        }
        if (this.world?.keyboard.LEFT && this.x > 0) {
            this.x -= this.speed;
            this.otherDirection = true;
        }
    }

    /**
     * Triggers a jump if the up key is pressed and the character is grounded.
     */
    handleVerticalMovement() {
        if (
            this.world?.keyboard.UP &&
            !this.isAboveGround() &&
            this.speedY === 0
        ) {
            this.jump();
        }
    }

    /**
     * Updates the camera position relative to the character's coordinate.
     */
    updateCameraPosition() {
        if (this.world) {
            this.world.camera_x = -this.x + 100;
        }
    }

    /**
     * Cycles through animation frames depending on the current character state.
     */
    startAnimationInterval() {
        setInterval(() => {
            if (this.handleDeadAnimation()) return;
            if (this.handleHurtAnimation()) return;
            if (this.handleJumpingAnimation()) return;
            this.handleWalkingOrIdleAnimation();
        }, 1000 / 12);
    }

    /**
     * Manages the death animation state.
     * @returns {boolean} True if character is dead.
     */
    handleDeadAnimation() {
        if (!this.isDead()) return false;
        this.stopSnoring();
        if (!this.deadAnimationStarted) {
            this.deadAnimationStarted = true;
            this.currentImage = 0;
            this.scheduleGameOverScreen();
        }
        let index = Math.min(
            this.currentImage,
            this.imageHub.images_dead.length - 1,
        );
        this.img = this.imageCache[this.imageHub.images_dead[index]];
        if (this.currentImage < this.imageHub.images_dead.length - 1) {
            this.currentImage++;
        }
        return true;
    }

    /**
     * Schedules the display of the game over screen after the death animation completes.
     */
    scheduleGameOverScreen() {
        let animationDuration = this.imageHub.images_dead.length * (1000 / 12);
        let viewingBuffer = 1000;

        setTimeout(() => {
            let gameOverScreen = document.getElementById("game-over-screen");
            if (gameOverScreen) {
                gameOverScreen.classList.remove("hidden");
            }
        }, animationDuration + viewingBuffer);
    }

    /**
     * Manages the hurt animation state.
     * @returns {boolean} True if character is hurt.
     */
    handleHurtAnimation() {
        if (!this.isHurt()) return false;
        this.stopSnoring();
        let index = this.currentImage % this.imageHub.images_hurt.length;
        this.img = this.imageCache[this.imageHub.images_hurt[index]];
        this.currentImage++;
        return true;
    }

    /**
     * Manages the jumping animation state.
     * @returns {boolean} True if character is above ground.
     */
    handleJumpingAnimation() {
        if (!this.isAboveGround()) return false;
        this.stopSnoring();
        let index = Math.min(
            this.currentImage,
            this.imageHub.images_jumping.length - 1,
        );
        this.img = this.imageCache[this.imageHub.images_jumping[index]];
        this.currentImage++;
        return true;
    }

    /**
     * Manages walking states, normal idle stance, and transitions to long idle animations.
     */
    handleWalkingOrIdleAnimation() {
        if (this.world?.keyboard.RIGHT || this.world?.keyboard.LEFT) {
            this.resetIdleState();
            let index = this.currentImage % this.imageHub.images_walking.length;
            this.img = this.imageCache[this.imageHub.images_walking[index]];
            this.currentImage++;
            this.handleRunningAudio(true);
        } else {
            this.handleIdleState();
        }
    }

    /**
     * Resets the idle timer and stops running audio.
     */
    resetIdleState() {
        this.idleTime = 0;
        this.world?.audioHub?.stop("characterRun");
        this.isRunningSoundActive = false;
        this.stopSnoring();
    }

    /**
     * Stops the snoring sound if active.
     */
    stopSnoring() {
        if (this.isSnoringSoundActive && this.world?.audioHub) {
            this.world.audioHub.stop("character_snoring");
            this.isSnoringSoundActive = false;
        }
    }

    /**
     * Handles audio state during movement.
     * @param {boolean} isMoving - Whether the character is moving.
     */
    handleRunningAudio(isMoving) {
        if (
            !this.isAboveGround() &&
            this.speedY === 0 &&
            this.world?.audioHub &&
            isMoving
        ) {
            if (!this.isRunningSoundActive) {
                this.world.audioHub.play("characterRun", 0.6);
                this.isRunningSoundActive = true;
            }
        } else {
            this.world?.audioHub?.stop("characterRun");
            this.isRunningSoundActive = false;
        }
    }

    /**
     * Manages idle and long idle animations based on inactivity duration.
     */
    handleIdleState() {
        this.world?.audioHub?.stop("characterRun");
        this.isRunningSoundActive = false;
        this.idleTime += 1000 / 12;

        if (this.idleTime > 3000) {
            this.playLongIdleAnimation();
        } else if (this.idleTime > 1000) {
            this.stopSnoring();
            this.playIdleAnimation();
        } else {
            this.stopSnoring();
            this.loadImage("assets/img/character/walk/stehen.webp");
            this.currentImage = 0;
        }
    }

    /**
     * Plays the standard idle animation sequence.
     */
    playIdleAnimation() {
        let index =
            Math.floor(this.idleTime / 200) % this.imageHub.images_idle.length;
        this.img = this.imageCache[this.imageHub.images_idle[index]];
    }

    /**
     * Plays the long idle animation sequence and stays on the last frame until movement resumes.
     */
    playLongIdleAnimation() {
        let maxIndex = this.imageHub.images_long_idle.length - 1;
        let calculatedIndex = Math.floor((this.idleTime - 3000) / 200);
        let index = Math.min(calculatedIndex, maxIndex);

        this.img = this.imageCache[this.imageHub.images_long_idle[index]];

        if (index === maxIndex) {
            if (this.world?.audioHub && !this.isSnoringSoundActive) {
                this.world.audioHub.play("character_snoring", 0.5);
                this.isSnoringSoundActive = true;
            }
        }
    }

    /**
     * Makes the character jump and plays the jump sound effect.
     */
    jump() {
        this.speedY = 25;
        this.stopSnoring();
        if (this.world?.audioHub) {
            this.world.audioHub.play("characterJump", 0.4);
        }
    }
}
