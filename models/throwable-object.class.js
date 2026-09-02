import { MovableObject } from "./movable-objects.class.js";

export class ThrowableObject extends MovableObject {
    constructor(x, y) {
        super();
        this.loadImage("./assets/img/character/attack/disc.webp");
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 60;
        this.throw();
    }

    isAboveGround() {
        return true;
    }

    throw() {
        this.speedY = 35;
        this.applyGravity();

        setInterval(() => {
            this.x += 10;
        }, 25);
    }
}
