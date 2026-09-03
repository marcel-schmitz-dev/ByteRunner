import { MovableObject } from "./movable-objects.class.js";
import { ImageHub } from "./image.hub.js";

/**
 * Repräsentiert ein sich bewegendes Hard-Drive-Monster im Spiel.
 *
 * Das Monster animiert seine Darstellung und bewegt sich kontinuierlich
 * von rechts nach links über das Spielfeld.
 *
 * @extends MovableObject
 */
export class HardDrive extends MovableObject {
    width = 50;
    height = 80;

    speed = 3;

    imageHub = new ImageHub();
    currentImage = 0;

    /**
     * Erstellt ein neues Hard-Drive-Monster und initialisiert dessen
     * Darstellung, Position und Bewegungsgeschwindigkeit.
     */
    constructor() {
        super();
        this.loadImage("assets/img/monster/hardDrive0.webp");
        this.loadImages(this.imageHub.images_hard_drive);
        this.animate();

        this.x = 500 + Math.random() * 2000;
        this.speed = 0.15 + Math.random() * 0.25;
        this.y = 350;
    }

    /**
     * Startet die Animation des Monsters und aktualisiert regelmäßig dessen
     * Animationsbild.
     *
     * Zusätzlich wird die kontinuierliche Bewegung nach links gestartet.
     * Die verwendeten Intervalle bleiben während der Lebensdauer des Objekts
     * aktiv.
     *
     * @returns {void}
     */
    animate() {
        this.moveLeft();

        setInterval(() => {
            let i = this.currentImage % this.imageHub.images_hard_drive.length;
            let path = this.imageHub.images_hard_drive[i];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, 1000 / 10);
    }

    /**
     * Bewegt das Monster kontinuierlich mit gleichmäßigen Zeitabständen nach
     * links.
     *
     * @returns {void}
     */
    moveLeft() {
        setInterval(() => {
            this.x -= 0.15;
        }, 1000 / 60);
    }
}
