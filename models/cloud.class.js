import { MovableObject } from "./movable-objects.class.js";

export class Cloud extends MovableObject {
    width = 300;
    height = 200;

    constructor(startX) {
        super();
        this.loadImage("assets/img/cloud/cloud.webp");

        this.x = startX !== undefined ? startX : Math.random() * 3200;
        this.y = 50;

        this.animate();
    }

    animate() {
        this.moveLeft();
    }

    moveLeft() {
        setInterval(() => {
            this.x -= 0.15;
        }, 1000 / 60);
    }
}
