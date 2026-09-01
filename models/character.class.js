import { MovableObject } from "./movable-objects.class.js";
import { ImageHub } from "./image.hub.js";

export class Character extends MovableObject {
    width = 100;
    height = 130;
    y = 300;
    speed = 5;

    imageHub = new ImageHub();
    currentImage = 0;
    world;

    constructor(world) {
        super();
        this.world = world;
        this.loadImage("assets/img/character/walk/stehen.webp");
        this.loadImages(this.imageHub.images_walking);
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (this.world && this.world.keyboard.RIGHT&&
                this.x > 0 &&
                this.x < this.world.level.level_end_x ) {
                this.x += this.speed;
                this.otherDirection = false;
            }

            if (
                this.world &&
                this.world.keyboard.LEFT 
            ) {
                this.x -= this.speed;
                this.otherDirection = true;
            }

            if (this.world) {
                this.world.camera_x = -this.x + 100;
            }
        }, 1000 / 60);

        setInterval(() => {
            if (
                this.world &&
                (this.world.keyboard.RIGHT || this.world.keyboard.LEFT)
            ) {
                let i = this.currentImage % this.imageHub.images_walking.length;
                let path = this.imageHub.images_walking[i];
                this.img = this.imageCache[path];
                this.currentImage++;
            }
        }, 1000 / 12);
    }

    jump() {}
}
