import { MovableObject } from "./movable-objects.class.js";

export class Boss extends MovableObject {
    height = 120;
    width = 200;
    
    constructor() {
        super();
        this.loadImage("assets/img/boss/bossTransformation5.png");

        this.x = 200 + Math.random() * 500;
        this.y = 235;
    }
}
