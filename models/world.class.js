import { BackgroundObject } from "./background-object.class.js";
import { Character } from "./character.class.js";
import { level1 } from "../levels/level1.js";
import { Level } from "../models/level.class.js";
import { HardDrive } from "./hard-drive.class.js";
import { MouseDrone } from "./mouse-drone.class.js";
import { Endboss } from "./endboss.class.js";
import { Cloud } from "./cloud.class.js";
import { Keyboard } from "./keyboard.class.js";

export class World {
    character;
    keyboard;
    level = level1;
    canvas;
    camera_x = 0;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.character = new Character(this);
        this.draw();
        this.checkCollisions();
    }

    checkCollisions() {
        setInterval(() => {
            this.level.enemies.forEach((enemy) => {
                if (this.character.isColliding(enemy)) {
                    console.log("collision with character", enemy);
                }
            });
        }, 200);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);

        this.addObjectsToMap(this.level.clouds);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);

        this.ctx.translate(-this.camera_x, 0);

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
            mo.draw(this.ctx);
            mo.drawFrame(this.ctx);
        }
    }
}
