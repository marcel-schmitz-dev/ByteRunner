import { MovableObject } from "./movable-objects.class.js";

export class Character extends MovableObject {
    constructor() {
        super();
        this.loadImage("assets/img/character/walk/stehen.webp");
    }

    jump() {}
}
