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
    isGameWon = false;

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
        this.lastActionTime = new Date().getTime();
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
        if (this.isDead() && !this.isGameOverPlayed) {
            this.triggerGameOverAudioAndState();
        }
    }

    /**
     * Triggers game over sound and stops background/running audio.
     */
    triggerGameOverAudioAndState() {
        this.isGameOverPlayed = true;
        this.stopSnoring();
        if (this.world?.audioHub) {
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
        this.handleRightMovement();
        this.handleLeftMovement();
    }

    /**
     * Moves the character to the right if input and boundaries allow.
     */
    handleRightMovement() {
        if (
            this.world?.keyboard.RIGHT &&
            this.x < this.world.level.level_end_x
        ) {
            this.x += this.speed;
            this.otherDirection = false;
            this.lastActionTime = new Date().getTime();
        }
    }

    /**
     * Moves the character to the left if input and boundaries allow.
     */
    handleLeftMovement() {
        if (this.world?.keyboard.LEFT && this.x > 0) {
            this.x -= this.speed;
            this.otherDirection = true;
            this.lastActionTime = new Date().getTime();
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
        this.renderDeadFrame();
        return true;
    }

    /**
     * Renders the current frame of the death sequence.
     */
    renderDeadFrame() {
        let index = Math.min(
            this.currentImage,
            this.imageHub.images_dead.length - 1,
        );
        this.img = this.imageCache[this.imageHub.images_dead[index]];
        if (this.currentImage < this.imageHub.images_dead.length - 1) {
            this.currentImage++;
        }
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
            this.playWalkingState();
        } else {
            this.handleIdleState();
        }
    }

    /**
     * Updates image and sound when character is walking.
     */
    playWalkingState() {
        this.resetIdleState();
        let index = this.currentImage % this.imageHub.images_walking.length;
        this.img = this.imageCache[this.imageHub.images_walking[index]];
        this.currentImage++;
        this.handleRunningAudio(true);
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
     * Stops the snoring audio effect.
     */
    stopSnoring() {
        this.isSnoringSoundActive = false;
        if (this.world?.audioHub) {
            this.world.audioHub.stop("character_snoring");
        }
    }

    /**
     * Handles audio state during movement.
     * @param {boolean} isMoving - Whether the character is moving.
     */
    handleRunningAudio(isMoving) {
        if (this.canPlayRunSound(isMoving)) {
            this.world.audioHub.play("characterRun", 0.6);
            this.isRunningSoundActive = true;
        } else if (!isMoving) {
            this.world?.audioHub?.stop("characterRun");
            this.isRunningSoundActive = false;
        }
    }

    /**
     * Checks conditions for playing running audio.
     * @param {boolean} isMoving - Movement flag.
     * @returns {boolean} True if audio should play.
     */
    canPlayRunSound(isMoving) {
        return (
            !this.isAboveGround() &&
            this.speedY === 0 &&
            this.world?.audioHub &&
            isMoving &&
            !this.isRunningSoundActive
        );
    }

    /**
     * Manages idle and long idle animations based on inactivity duration.
     */
    handleIdleState() {
        this.stopRunningAudioOnIdle();
        this.idleTime += 1000 / 12;
        this.evaluateIdleDuration();
    }

    /**
     * Stops running audio when entering idle state.
     */
    stopRunningAudioOnIdle() {
        this.world?.audioHub?.stop("characterRun");
        this.isRunningSoundActive = false;
    }

    /**
     * Checks if the game has been won or the boss has been defeated.
     * @returns {boolean} True if the game is won.
     */
    hasGameEnded() {
        let bossDefeated =
            this.world &&
            typeof this.world.isBossDefeated === "function" &&
            this.world.isBossDefeated();
        return this.isGameWon || bossDefeated;
    }

    /**
     * Evaluates idle duration and triggers corresponding idle/sleep animation.
     */
    evaluateIdleDuration() {
        if (this.hasGameEnded()) {
            this.stopSnoring();
            this.resetToStandingPose();
            return;
        }
        this.handleIdleAnimationsByTime();
    }

    /**
     * Selects and plays idle animations based on accumulated idle time.
     */
    handleIdleAnimationsByTime() {
        if (this.idleTime > 3000) {
            this.playLongIdleAnimation();
        } else if (this.idleTime > 1000) {
            this.stopSnoring();
            this.playIdleAnimation();
        } else {
            this.resetToStandingPose();
        }
    }

    /**
     * Resets character to standard standing posture.
     */
    resetToStandingPose() {
        this.stopSnoring();
        this.loadImage("assets/img/character/walk/stehen.webp");
        this.currentImage = 0;
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
     * Plays the long idle animation sequence and triggers snoring audio at the end frame.
     */
    playLongIdleAnimation() {
        let maxIndex = this.imageHub.images_long_idle.length - 1;
        let calculatedIndex = Math.floor((this.idleTime - 3000) / 200);
        let index = Math.min(calculatedIndex, maxIndex);

        this.img = this.imageCache[this.imageHub.images_long_idle[index]];

        if (index === maxIndex) {
            this.startSnoringAudioIfNeeded();
        }
    }

    /**
     * Starts snoring audio if not already active.
     */
    startSnoringAudioIfNeeded() {
        if (this.world?.audioHub && !this.isSnoringSoundActive) {
            this.world.audioHub.play("character_snoring", 0.5);
            this.isSnoringSoundActive = true;
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
