export class Level {
    enemies;
    clouds;
    backgroundObjects;
    
    level_end_x = 3000;

    constructor(backgroundObjects, enemies, clouds) {
        this.backgroundObjects = backgroundObjects;
        this.enemies = enemies;
        this.clouds = clouds;
    }
}
