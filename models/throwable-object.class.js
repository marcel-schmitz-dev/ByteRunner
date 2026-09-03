import { MovableObject } from "./movable-objects.class.js";

/**
 * Represents a throwable projectile (like a disc) thrown by the character.
 */
export class ThrowableObject extends MovableObject {
    height = 60;
    width = 60;

    /**
     * Initializes a new instance of the ThrowableObject class.
     * @param {number} x - The starting X-coordinate.
     * @param {number} y - The starting Y-coordinate.
     * @param {boolean} otherDirection - Direction flag indicating if it moves left or right.
     */
    constructor(x, y, otherDirection) {
        super();
        this.initializeProjectile(x, y, otherDirection);
    }

    /**
     * Sets position, appearance, and triggers the throw mechanics.
     * @param {number} x - X-coordinate.
     * @param {number} y - Y-coordinate.
     * @param {boolean} otherDirection - Movement direction flag.
     */
    initializeProjectile(x, y, otherDirection) {
        this.loadImage("./assets/img/character/attack/disc.webp");
        this.x = x;
        this.y = y;
        this.otherDirection = otherDirection;
        this.throw(otherDirection);
    }

    /**
     * Overrides gravity condition to ensure the throwable object stays active in flight.
     * @returns {boolean} Always true.
     */
    isAboveGround() {
        return true;
    }

    /**
     * Initializes the throwing physics and continuous horizontal movement.
     * @param {boolean} otherDirection - Flag determining horizontal trajectory.
     */
    throw(otherDirection) {
        this.speedY = 35;
        this.applyGravity();
        this.startHorizontalMovement(otherDirection);
    }

    /**
     * Moves the projectile horizontally depending on the throw direction.
     * @param {boolean} otherDirection - True for moving left, false for right.
     */
    startHorizontalMovement(otherDirection) {
        setInterval(() => {
            if (otherDirection) {
                this.x -= 10;
            } else {
                this.x += 10;
            }
        }, 25);
    }
}