import { BackgroundObject } from "./background-object.class.js";
import { Character } from "./character.class.js";
import { HardDrive } from "./hard-drive.class.js";
import { MouseDrone } from "./mouse-drone.class.js";
import { Boss } from "./boss.class.js";
import { Cloud } from "./cloud.class.js";
import { Keyboard } from "./keyboard.class.js";

export class World {
    character;
    keyboard;

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

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;

        this.character = new Character(this);

        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.addObjectsToMap(this.backgroundObjects);

        this.addObjectsToMap(this.clouds);

        this.addToMap(this.character);

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
        if (mo.otherDirection) {
            this.ctx.save();
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(
                mo.img,
                -mo.x - mo.width,
                mo.y,
                mo.width,
                mo.height,
            );
            this.ctx.restore();
        } else {
            this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
        }
    }
}
