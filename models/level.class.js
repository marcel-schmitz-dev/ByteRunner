export class Level {
    enemies;
    clouds;
    backgroundObjects;
    coins;
    collectibleDiscs;
    
    level_end_x = 3000;

    constructor(backgroundObjects, enemies, clouds, coins = [], collectibleDiscs = []) {
        this.backgroundObjects = backgroundObjects;
        this.enemies = enemies;
        this.clouds = clouds;
        this.coins = coins;
        this.collectibleDiscs = collectibleDiscs;
    }
}