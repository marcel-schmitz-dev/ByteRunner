import { MovableObject } from "./movable-objects.class.js";

export class HardDrive extends MovableObject {
    width = 80;
    height = 50;

    constructor() {
        super();
        this.loadImage("assets/img/monster/hardDrive0.png");

        this.x = 200 + Math.random() * 500;
        this.y = 350;
    }
}
