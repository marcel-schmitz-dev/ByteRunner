import { MovableObject } from "./movable-objects.class.js";
import { ImageHub } from "./image.hub.js";

export class HardDrive extends MovableObject {
    width = 50;
    height = 80;

    speed = 3;

    imageHub = new ImageHub();
    currentImage = 0;

    constructor() {
        super();
        this.loadImage("assets/img/monster/hardDrive0.webp");
        this.loadImages(this.imageHub.images_hard_drive);
        this.animate();

        this.x = 500 + Math.random() * 2000;
        this.speed = 0.15 + Math.random() * 0.25;
        this.y = 350;
    }

    animate() {
        this.moveLeft();

        setInterval(() => {
            let i = this.currentImage % this.imageHub.images_hard_drive.length;
            let path = this.imageHub.images_hard_drive[i];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, 1000 / 10);
    }

    moveLeft() {
        setInterval(() => {
            this.x -= 0.15;
        }, 1000 / 60);
    }
}
