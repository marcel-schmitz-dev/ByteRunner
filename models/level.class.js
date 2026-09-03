/**
 * Represents a game level and the objects it contains.
 *
 * @class
 */
export class Level {
    /** @type {Array} Enemies placed in the level. */
    enemies;

    /** @type {Array} Clouds displayed in the level background. */
    clouds;

    /** @type {Array} Background objects displayed in the level. */
    backgroundObjects;

    /** @type {Array} Coins available for collection in the level. */
    coins;

    /** @type {Array} Collectible discs available in the level. */
    collectibleDiscs;

    /** @type {number} Horizontal position marking the end of the level. */
    level_end_x = 3000;

    /**
     * Creates a level with its background, entities, and collectibles.
     *
     * @param {Array} backgroundObjects - Background objects displayed in the level.
     * @param {Array} enemies - Enemies placed in the level.
     * @param {Array} clouds - Clouds displayed in the level background.
     * @param {Array} [coins=[]] - Coins available for collection in the level.
     * @param {Array} [collectibleDiscs=[]] - Collectible discs available in the level.
     */
    constructor(
        backgroundObjects,
        enemies,
        clouds,
        coins = [],
        collectibleDiscs = [],
    ) {
        this.backgroundObjects = backgroundObjects;
        this.enemies = enemies;
        this.clouds = clouds;
        this.coins = coins;
        this.collectibleDiscs = collectibleDiscs;
    }
}
