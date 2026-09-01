import { MovableObject } from "./movable-objects.class.js";

export class Character extends MovableObject {
    constructor() {
        super().loadImage("assets/img/character/walk/stehen.webp");
    }

    jump() {}
}
