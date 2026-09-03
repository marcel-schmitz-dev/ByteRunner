/**
 * Verwaltet den aktuellen Zustand der für das Spiel relevanten
 * Tastatureingaben.
 */
export class Keyboard {
    /**
     * Erstellt eine neue Tastatur-Zustandsinstanz.
     *
     * Alle Tasten befinden sich beim Erstellen standardmäßig im nicht
     * gedrückten Zustand.
     */
    constructor() {
        // Die Standardwerte werden über die Klassenfelder gesetzt.
    }

    /**
     * Gibt an, ob die linke Bewegungstaste gedrückt ist.
     * @type {boolean}
     */
    LEFT = false;

    /**
     * Gibt an, ob die rechte Bewegungstaste gedrückt ist.
     * @type {boolean}
     */
    RIGHT = false;

    /**
     * Gibt an, ob die Aufwärtsbewegungstaste gedrückt ist.
     * @type {boolean}
     */
    UP = false;

    /**
     * Gibt an, ob die Abwärtsbewegungstaste gedrückt ist.
     * @type {boolean}
     */
    DOWN = false;

    /**
     * Gibt an, ob die Leertaste gedrückt ist.
     * @type {boolean}
     */
    SPACE = false;

    /**
     * Gibt an, ob die Taste „L“ gedrückt ist.
     * @type {boolean}
     */
    L = false;
}
