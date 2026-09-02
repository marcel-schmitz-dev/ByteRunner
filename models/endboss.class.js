import { MovableObject } from "./movable-objects.class.js";
import { ImageHub } from "./image.hub.js";

export class Endboss extends MovableObject {
    height = 350;
    width = 300;
    speed = 1.5;

    imageHub = new ImageHub();
    currentImage = 0;

    constructor(startX) {
        super();
        this.loadImage("assets/img/boss/bossTransformation5.webp");
        this.loadImages(this.imageHub.images_boss_walk);

        this.x = startX !== undefined ? startX : 2700;
        this.y = 80;

        this.animate();
    }

    animate() {
        this.moveLeft();

        setInterval(() => {
            let i = this.currentImage % this.imageHub.images_boss_walk.length;
            let path = this.imageHub.images_boss_walk[i];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, 1000 / 10);
    }

    moveLeft() {
        setInterval(() => {
            this.x -= this.speed;
        }, 1000 / 60);
    }
}
