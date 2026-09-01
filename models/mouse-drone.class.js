import { MovableObject } from "./movable-objects.class.js";

export class MouseDrone extends MovableObject {
    constructor() {
        super();
        this.loadImage("assets/img/monster/mouseDrone0.png");

        this.x = 200 + Math.random() * 500;
    }
}
