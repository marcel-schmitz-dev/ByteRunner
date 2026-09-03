import { MovableObject } from "./movable-objects.class.js";

/**
 * Repräsentiert eine bewegliche Wolke im Spiel.
 *
 * @extends MovableObject
 */
export class Cloud extends MovableObject {
    width = 300;
    height = 200;

    /**
     * Erstellt eine neue Wolke und startet ihre Animation.
     *
     * @param {number} [startX] - Optionale horizontale Startposition. Wenn
     * keine Position angegeben wird, wird eine zufällige Position gewählt.
     */
    constructor(startX) {
        super();
        this.loadImage("assets/img/cloud/cloud.webp");

        this.x = startX !== undefined ? startX : Math.random() * 3200;
        this.y = 50;

        this.animate();
    }

    /**
     * Startet die kontinuierliche Bewegung der Wolke.
     *
     * @returns {void}
     */
    animate() {
        this.moveLeft();
    }

    /**
     * Bewegt die Wolke in einem festen Intervall nach links.
     *
     * @returns {void}
     */
    moveLeft() {
        setInterval(() => {
            this.x -= 0.15;
        }, 1000 / 60);
    }
}
