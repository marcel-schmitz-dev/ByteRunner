import { DrawableObject } from "./drawable-object.class.js";
import { ImageHub } from "./image.hub.js";

/**
 * Repräsentiert die Lebensanzeige des Bossgegners.
 *
 * Die Anzeige verwendet abhängig vom aktuellen Lebensprozentsatz ein
 * passendes Bild aus dem Bild-Cache und wird an einer festen Position im
 * Spielfeld dargestellt.
 */
export class BossHpBar extends DrawableObject {
    imageHub = new ImageHub();
    percentage = 100;
    otherDirection = false;

    /**
     * Erstellt eine neue Boss-Lebensanzeige und initialisiert sie mit voller
     * Lebensenergie.
     */
    constructor() {
        super();
        this.loadImages(this.imageHub.images_boss_hp);
        this.x = 235;
        this.y = 15;
        this.width = 250;
        this.height = 50;
        this.setPercentage(100);
    }

    /**
     * Aktualisiert den dargestellten Lebensprozentsatz.
     *
     * Der Wert wird gespeichert und anschließend auf das Bild abgebildet,
     * dessen Schwellenwert dem aktuellen Prozentsatz entspricht.
     *
     * @param {number} percentage Der aktuelle Lebensprozentsatz des Bosses.
     * Werte ab 100 werden als volle Lebensanzeige dargestellt; Werte unter 20
     * werden als kritisch niedrige Lebensanzeige dargestellt.
     * @returns {void}
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let imagePath = this.imageHub.images_boss_hp[this.resolveImageIndex()];
        this.img = this.imageCache[imagePath];
    }

    /**
     * Ermittelt anhand des Lebensprozentsatzes den Index des darzustellenden
     * Lebensanzeigenbildes.
     *
     * @returns {number} Der Bildindex im Array
     * {@link ImageHub#images_boss_hp} im Bereich von 0 bis 5.
     */
    resolveImageIndex() {
        if (this.percentage >= 100) return 5;
        if (this.percentage >= 80) return 4;
        if (this.percentage >= 60) return 3;
        if (this.percentage >= 40) return 2;
        if (this.percentage >= 20) return 1;
        return 0;
    }
}
