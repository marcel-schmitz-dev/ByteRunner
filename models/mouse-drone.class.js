import { MovableObject } from "./movable-objects.class.js";

export class MouseDrone extends MovableObject {
    height = 50;
    width = 50;
    
    constructor() {
        super();
        this.loadImage("assets/img/monster/mouseDrone0.png");

        this.x = 200 + Math.random() * 500;
        this.y = 380;
    }
}
