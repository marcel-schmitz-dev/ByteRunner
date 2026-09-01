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

        this.ctx.drawImage(
            this.character.img,
            this.character.x,
            this.character.y,
            this.character.height,
            this.character.width,
        );
        this.enemies.forEach((enemy) => {
            this.ctx.drawImage(
                enemy.img,
                enemy.x,
                enemy.y,
                enemy.height,
                enemy.width,
            );
        });

        this.clouds.forEach((cloud) => {
            this.ctx.drawImage(
                cloud.img,
                cloud.x,
                cloud.y,
                cloud.height,
                cloud.width,
            );
        });

        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }
}
