import { MovableObject } from "./movable-objects.class.js";

/**
 * Represents a background element in the game world.
 *
 * A background object inherits image-loading and movement functionality from
 * {@link MovableObject} and is displayed with a fixed size of 720 × 480 pixels.
 */
export class BackgroundObject extends MovableObject {
    /** @type {number} The width of the background object in pixels. */
    width = 720;

    /** @type {number} The height of the background object in pixels. */
    height = 480;

    /**
     * Creates a background object, loads its image, and sets its position.
     *
     * @param {string} imagePath - The path to the image to load.
     * @param {number} x - The horizontal position in pixels.
     * @param {number} y - The vertical position in pixels.
     */
    constructor(imagePath, x, y) {
        super().loadImage(imagePath);
        this.y = y;
        this.x = x;
    }
}
