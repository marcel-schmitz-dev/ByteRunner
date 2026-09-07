/**
 * Verwaltet den aktuellen Zustand der für das Spiel relevanten
 * Tastatureingaben.
 */
export class Keyboard {
    constructor() {}

    LEFT = false;
    RIGHT = false;
    UP = false;
    DOWN = false;
    SPACE = false;
    THROW = false;

    /**
     * Setzt alle Tastenzustände auf den Standardwert (false) zurück.
     */
    reset() {
        this.LEFT = false;
        this.RIGHT = false;
        this.UP = false;
        this.DOWN = false;
        this.SPACE = false;
        this.THROW = false;
    }
}