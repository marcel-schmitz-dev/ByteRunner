import { DrawableObject } from "../models/drawable-object.class.js";

/**
 * Represents a moving object in the game world with physics, health, and collision detection.
 */
export class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;

    /**
     * Applies gravity physics to the object over time.
     */
    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } else {
                this.resetGroundPosition();
            }
        }, 1000 / 25);
    }

    /**
     * Resets vertical speed and grounds the object at the default height.
     */
    resetGroundPosition() {
        this.speedY = 0;
        this.y = 300;
    }

    /**
     * Checks if the object is currently positioned above the ground.
     * @returns {boolean} True if y-coordinate is less than 300.
     */
    isAboveGround() {
        return this.y < 300;
    }

    /**
     * Cycles through and plays an animation frame from a given image array.
     * @param {string[]} images - Array of image paths.
     */
    playAnimation(images) {
        let index = this.currentImage % images.length;
        let path = images[index];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Checks for axis-aligned bounding box collision with another object.
     * @param {Object} mo - The other movable object.
     * @returns {boolean} True if colliding.
     */
    isColliding(mo) {
        return (
            this.x + this.width > mo.x &&
            this.x < mo.x + mo.width &&
            this.y + this.height > mo.y &&
            this.y < mo.y + mo.height
        );
    }

    /**
     * Inflicts damage to the object, reducing its energy.
     * @param {number} [damage=5] - The amount of damage taken.
     */
    hit(damage = 5) {
        if (this.isDead()) return;

        this.energy = Math.max(0, this.energy - damage);
        
        if (this.energy > 0) {
            this.lastHit = new Date().getTime();
        } else if (this.constructor.name === "Character") {
            this.currentImage = 0;
        }
    }

    /**
     * Checks if the object was recently hurt.
     * @returns {boolean} True if hit within the last 0.5 seconds and still alive.
     */
    isHurt() {
        let timePassed = (new Date().getTime() - this.lastHit) / 1000;
        return timePassed < 0.5 && this.energy > 0;
    }

    /**
     * Checks if the object's energy has depleted completely.
     * @returns {boolean} True if dead.
     */
    isDead() {
        return this.energy === 0;
    }

    /**
     * Moves the object to the right.
     */
    moveRight() {
        console.log("moving right");
    }

    /**
     * Moves the object to the left based on its current speed.
     */
    moveLeft() {
        this.x -= this.speed;
    }
}