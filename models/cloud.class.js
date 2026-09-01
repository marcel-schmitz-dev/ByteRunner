import { MovableObject } from "./movable-objects.class.js";

export class Cloud extends MovableObject {
    width = 300;
    height = 200;

    constructor(startX) {
        super();
        this.loadImage("assets/img/cloud/cloud.webp");

        // Nutze den übergebenen Wert oder fallback auf Zufall, falls leer
        this.x = startX !== undefined ? startX : Math.random() * 2500;
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
