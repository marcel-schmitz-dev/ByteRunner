import { MovableObject } from "./movable-objects.class.js";
import { ImageHub } from "./image.hub.js";
import { IntervalHub } from "./interval-hub.class.js";

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
    constructor(startX, speed = 0.2) {
        super();
        this.loadImage("assets/img/monster/hardDrive0.webp");
        this.loadImages(this.imageHub.images_hard_drive);
        this.x = startX;
        this.speed = speed;
        this.y = 350;
        this.animate();
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

        IntervalHub.start(() => {
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
        IntervalHub.start(() => {
            this.x -= this.speed;
        }, 1000 / 60);
    }
}
