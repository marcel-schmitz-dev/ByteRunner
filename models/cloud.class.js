import { MovableObject } from "./movable-objects.class.js";

export class Cloud extends MovableObject {
    width = 200;
    height = 300;
    
    constructor() {
        super();
        this.loadImage("assets/img/cloud/cloud.webp");

        this.x = Math.random() * 500;
        this.y = 50;
    }
}
