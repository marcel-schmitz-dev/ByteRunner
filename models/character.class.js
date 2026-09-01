import { MovableObject } from "./movable-objects.class.js";
import { ImageHub } from "./image.hub.js";

export class Character extends MovableObject {
    width = 100;
    height = 130;
    y = 300;
    speed = 5;

    imageHub = new ImageHub();
    currentImage = 0;

    constructor() {
        super();
        this.loadImage("assets/img/character/walk/stehen.webp");
        this.loadImages(this.imageHub.images_walking);
        this.animate();
    }

    animate() {
        setInterval(() => {
            let i = this.currentImage % this.imageHub.images_walking.length;
            let path = this.imageHub.images_walking[i];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, 1000 / 12);
    }

    jump() {}
}
