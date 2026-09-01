import { MovableObject } from "./movable-objects.class.js";

export class Boss extends MovableObject {
    constructor() {
        super();
        this.loadImage("assets/img/boss/bossTransformation5.png");
    }
}
