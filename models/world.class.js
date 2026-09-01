import { BackgroundObject } from "./background-object.class.js";
import { Character } from "./character.class.js";
import { HardDrive } from "./hard-drive.class.js";
import { MouseDrone } from "./mouse-drone.class.js";
import { Boss } from "./boss.class.js";
import { Cloud } from "./cloud.class.js";

export class World {
    character = new Character();
    enemies = [
        new MouseDrone(),
        new MouseDrone(),
        new MouseDrone(),
        new MouseDrone(),
        new MouseDrone(),
        new HardDrive(),
        new HardDrive(),
        new HardDrive(),
        new HardDrive(),
        new HardDrive(),
        new Boss(),
    ];

    backgroundObjects = [
        new BackgroundObject("assets/img/background/background.webp", 0, 0),
    ];
    clouds = [new Cloud(), new Cloud()];
    canvas;
    ctx;

    constructor(canvas) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 1. Hintergrund zuerst, damit er ganz hinten liegt
        this.addObjectsToMap(this.backgroundObjects);

        // 2. Wolken
        this.addObjectsToMap(this.clouds);

        // 3. Charakter kommt über den Hintergrund
        this.addToMap(this.character);

        // 4. Gegner zum Schluss
        this.addObjectsToMap(this.enemies);

        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    addObjectsToMap(objects) {
        objects.forEach((objekt) => {
            this.addToMap(objekt);
        });
    }

    addToMap(mo) {
        this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
    }
}
