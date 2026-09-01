import { MovableObject } from "./movable-objects.class.js";

export class Boss extends MovableObject {
    constructor() {
        super().loadImage("assets/img/character/walk/stehen.webp");
    }
}
