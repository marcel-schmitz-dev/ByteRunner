import { Character } from "./character.class.js";
import { level1 } from "../levels/level1.js";
import { StatusBar } from "./status-bar.class.js";
import { BossHpBar } from "./boss-hp-bar.class.js";
import { ThrowableObject } from "./throwable-object.class.js";
import { ImageHub } from "./image.hub.js";

export class World {
    character;
    keyboard;
    level = level1;
    canvas;
    camera_x = 0;
    imageHub = new ImageHub();
    statusBar = new StatusBar(this.imageHub.images_hp, 100, 15, 200, 50);
    coinBar = new StatusBar(
        this.imageHub.images_coin || this.imageHub.images_coins,
        0,
        75,
        160,
        50,
    );
    discBar = new StatusBar(
        this.imageHub.images_disc || this.imageHub.images_discs,
        0,
        135,
        160,
        50,
    );
    bossHpBar = new BossHpBar();
    bossSpawned = false;
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

        this.coinBar.setPercentage(0, "0");
        this.discBar.setPercentage(0, "0");
    }

    run() {
        setInterval(() => {
            this.checkCollisions();
            this.checkBossAwakening();
            this.checkCollectibles();

            this.level.enemies.forEach((enemy) => {
                if (enemy.constructor.name === "Endboss") {
                    enemy.hunt(this.character);
                }
            });
        }, 1000 / 60);
    }

    checkBossAwakening() {
        this.level.enemies.forEach((enemy) => {
            if (enemy.constructor.name === "Endboss") {
                let distance = enemy.x - this.character.x;
                if (distance < 500 && distance > -200 && !enemy.hasBeenSeen) {
                    enemy.awakening();
                    this.bossSpawned = true;
                }
            }
        });
    }

    checkCollectibles() {
        if (this.level.coins) {
            this.level.coins.forEach((coin, index) => {
                if (this.character.isColliding(coin)) {
                    this.character.coins = (this.character.coins || 0) + 1;
                    if (this.character.coins > 10) this.character.coins = 10;
                    
                    let coinPercentage = this.character.coins * 10;
                    this.coinBar.setPercentage(coinPercentage, `${this.character.coins}`);
                    
                    this.level.coins.splice(index, 1);
                }
            });
        }

        if (this.level.collectibleDiscs) {
            this.level.collectibleDiscs.forEach((discItem, index) => {
                if (this.character.isColliding(discItem)) {
                    this.character.discs = (this.character.discs || 0) + 1;
                    if (this.character.discs > 10) this.character.discs = 10;
                    
                    let discPercentage = this.character.discs * 20;
                    this.discBar.setPercentage(discPercentage, `${this.character.discs}`);
                    
                    this.level.collectibleDiscs.splice(index, 1);
                }
            });
        }
    }

    checkThrowObjects() {
        setInterval(() => {
            let currentTime = new Date().getTime();
            if (this.keyboard.THROW && currentTime - this.lastThrowTime > 500) {
                let discX = this.character.otherDirection
                    ? this.character.x - 10
                    : this.character.x + 50;
                let disc = new ThrowableObject(
                    discX,
                    this.character.y + 50,
                    this.character.otherDirection,
                );
                this.throwableObjects.push(disc);
                this.lastThrowTime = currentTime;
            }
        }, 100);
    }

    checkCollisions() {
        this.level.enemies.forEach((enemy, enemyIndex) => {
            let isCollidingX =
                this.character.x + this.character.width - 15 > enemy.x + 10 &&
                this.character.x + 15 < enemy.x + enemy.width - 10;

            let isCollidingY =
                this.character.y + this.character.height >= enemy.y &&
                this.character.y <= enemy.y + enemy.height;

            if (isCollidingX && isCollidingY) {
                let isEndboss = enemy.constructor.name === "Endboss";
                let characterBottom = this.character.y + this.character.height;
                let enemyTop = enemy.y;
                let isFalling = this.character.speedY < 0;
                let isJumpingOnTop =
                    !isEndboss && isFalling && characterBottom <= enemyTop + 30;

                if (isJumpingOnTop) {
                    this.character.speedY = 22;
                    this.level.enemies.splice(enemyIndex, 1);
                } else {
                    if (!this.character.isHurt()) {
                        this.character.hit();
                        this.statusBar.setPercentage(this.character.energy);
                    }
                }
            }
        });

        for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
            let disc = this.throwableObjects[i];

            this.level.enemies.forEach((enemy) => {
                let isEndboss = enemy.constructor.name === "Endboss";

                if (
                    isEndboss &&
                    enemy.isAwake &&
                    !enemy.isDead() &&
                    disc.isColliding(enemy)
                ) {
                    this.throwableObjects.splice(i, 1);

                    if (typeof enemy.hit === "function") {
                        enemy.hit(20);
                        this.bossHpBar.setPercentage(enemy.energy);
                    }
                }
            });
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0); // Kamera-Verschiebung beginnt

        this.addObjectsToMap(this.level.backgroundObjects);

        this.ctx.fillStyle = "rgba(10, 10, 20, 0.4)";
        this.ctx.fillRect(
            -this.camera_x,
            0,
            this.canvas.width,
            this.canvas.height,
        );

        // --- WELT-OBJEKTE (bewegen sich mit der Kamera) ---
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.coins);                  // Hierher verschoben!
        this.addObjectsToMap(this.level.collectibleDiscs);       // Hierher verschoben!
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.character);

        this.ctx.translate(-this.camera_x, 0); // Kamera-Verschiebung für die Welt aufheben

        // --- HUD / UI-ELEMENTE (bleiben fest an Ort und Stelle auf dem Bildschirm) ---
        this.addToMap(this.statusBar);
        this.addToMap(this.coinBar);
        this.addToMap(this.discBar);

        if (this.bossSpawned) {
            this.addToMap(this.bossHpBar);
        }

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
