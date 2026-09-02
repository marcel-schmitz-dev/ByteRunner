import { MovableObject } from "./movable-objects.class.js";

export class ThrowableObject extends MovableObject {
    constructor(x, y, otherDirection) {
        super();
        this.loadImage("./assets/img/character/attack/disc.webp");
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 60;
        this.otherDirection = otherDirection;
        this.throw(otherDirection);
    }

    isAboveGround() {
        return true;
    }

    throw(otherDirection) {
        this.speedY = 35;
        this.applyGravity();

        setInterval(() => {
            if (otherDirection) {
                this.x -= 10; 
            } else {
                this.x += 10;
            }
        }, 25);
    }
}
