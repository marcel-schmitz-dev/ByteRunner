import { MovableObject } from "./movable-objects.class.js";

export class HardDrive extends MovableObject {
    constructor() {
        super();
        this.loadImage("assets/img/monster/hardDrive0.png");

        this.x = 200 + Math.random() * 500;
    }
}
