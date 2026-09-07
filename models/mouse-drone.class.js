import { MovableObject } from "./movable-objects.class.js";
import { ImageHub } from "./image.hub.js";
import { IntervalHub } from "./interval-hub.class.js";

/**
 * Represents a flying mouse drone enemy in the game world.
 */
export class MouseDrone extends MovableObject {
    height = 50;
    width = 50;
    imageHub = new ImageHub();
    currentImage = 0;

    /**
     * Initializes a new instance of the MouseDrone class.
     */
    constructor(startX, speed = 0.2) {
        super();
        this.loadImage("assets/img/monster/mouseDrone0.webp");
        this.loadImages(this.imageHub.images_mouse_drone);
        this.x = startX;
        this.speed = speed;
        this.y = 380;
        this.animate();
    }

    /**
     * Starts the animation and movement loops for the mouse drone.
     */
    animate() {
        this.moveLeft();
        this.startAnimationLoop();
    }

    /**
     * Moves the drone continuously to the left.
     */
    moveLeft() {
        IntervalHub.start(() => {
            this.x -= this.speed;
        }, 1000 / 60);
    }

    /**
     * Cycles through animation frames for the drone's flight sequence.
     */
    startAnimationLoop() {
        IntervalHub.start(() => {
            let index = this.currentImage % this.imageHub.images_mouse_drone.length;
            let path = this.imageHub.images_mouse_drone[index];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, 1000 / 12);
    }
}
