import { MovableObject } from "./movable-objects.class.js";
import { ImageHub } from "./image.hub.js";

export class MouseDrone extends MovableObject {
    height = 50;
    width = 50;

    imageHub = new ImageHub();
    currentImage = 0;

    constructor() {
        super();
        this.loadImage("assets/img/monster/mouseDrone0.webp");
        this.loadImages(this.imageHub.images_mouse_drone);
        this.animate();

        this.x = 450 + Math.random() * 800;
        this.speed = 0.15 + Math.random() * 0.25;
        this.y = 380;
    }

    animate() {
        this.moveLeft();

        setInterval(() => {
            let i = this.currentImage % this.imageHub.images_mouse_drone.length;
            let path = this.imageHub.images_mouse_drone[i];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, 1000 / 12);
    }

    moveLeft() {
        setInterval(() => {
            this.x -= 0.15;
        }, 1000 / 60);
    }
}
