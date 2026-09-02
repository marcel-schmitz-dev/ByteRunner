import { Character } from "./character.class.js";
import { level1 } from "../levels/level1.js";
import { StatusBar } from "./status-bar.class.js";
import { CoinBar } from "./coin-bar.class.js";
import { DiscBar } from "./disc-bar.class.js";
import { ThrowableObject } from "./Throwable-object.class.js";

export class World {
    character;
    keyboard;
    level = level1;
    canvas;
    camera_x = 0;
    statusBar = new StatusBar();
    coinBar = new CoinBar();
    discBar = new DiscBar();
    throwableObjects = [];
    lastThrowTime = 0;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.character = new Character(this);
        this.draw();
        this.run();
        this.checkThrowObjects();
    }

    run() {
        setInterval(() => {
            this.checkCollisions();
        }, 200);
    }

    checkThrowObjects() {
        setInterval(() => {
            let currentTime = new Date().getTime();
            if (this.keyboard.THROW && currentTime - this.lastThrowTime > 500) {
                let disc = new ThrowableObject(
                    this.character.x + 50,
                    this.character.y + 50,
                );
                this.throwableObjects.push(disc);
                this.lastThrowTime = currentTime;
            }
        }, 100);
    }

    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy)) {
                this.character.hit();
                this.statusBar.setPercentage(this.character.energy);
            }
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);


        this.addObjectsToMap(this.level.backgroundObjects);

        this.ctx.fillStyle = "rgba(10, 10, 20, 0.4)";
        this.ctx.fillRect(
            -this.camera_x,
            0,
            this.canvas.width,
            this.canvas.height,
        );

        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusBar);
        this.addToMap(this.coinBar);
        this.addToMap(this.discBar);
        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.clouds);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);

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
        }
    }
}
