import { MovableObject } from "./movable-objects.class.js";
import { ImageHub } from "./image.hub.js";

export class Boss extends MovableObject {
    height = 200;
    width = 150;

    speed = 3;

    imageHub = new ImageHub();
    currentImage = 0;

    constructor() {
        super();
        this.loadImage("assets/img/boss/bossTransformation5.png");
        this.loadImages(this.imageHub.images_boss_walk);
        this.animate();

        this.x = 400 + Math.random() * 800;
        this.speed = 0.15 + Math.random() * 0.25;
        this.y = 235;
    }

    animate() {
        this.moveLeft();

        setInterval(() => {
            let i = this.currentImage % this.imageHub.images_boss_walk.length;
            let path = this.imageHub.images_boss_walk[i];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, 1000 / 12);
    }

    moveLeft(){
        setInterval(() => {
            this.x -= 0.15;
        }, 1000 / 60);
    }
}
