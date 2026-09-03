import { MovableObject } from "./movable-objects.class.js";
import { ImageHub } from "./image.hub.js";

export class Character extends MovableObject {
    width = 100;
    height = 130;
    y = 300;
    speed = 5;
    coins = 0;
    discs = 0;

    imageHub = new ImageHub();
    currentImage = 0;
    world;

    constructor(world) {
        super();
        this.world = world;
        this.loadImage("assets/img/character/walk/stehen.webp");
        this.loadImages(this.imageHub.images_walking);
        this.loadImages(this.imageHub.images_jumping);
        this.loadImages(this.imageHub.images_hurt);
        this.loadImages(this.imageHub.images_dead);
        this.applyGravity();
        this.animate();
    }

    hit(damage = 5) {
        super.hit(damage);

        if (
            this.isDead() &&
            !this.isGameOverPlayed &&
            this.world &&
            this.world.audioHub
        ) {
            this.isGameOverPlayed = true;

            this.world.audioHub.play("gameOverSound", 0.8);
            this.world.audioHub.stop("background");
            this.world.audioHub.stop("characterRun");
        }
    }

    animate() {
        setInterval(() => {
            if (
                this.world &&
                this.world.keyboard.RIGHT &&
                this.x < this.world.level.level_end_x
            ) {
                this.x += this.speed;
                this.otherDirection = false;
            }

            if (this.world && this.world.keyboard.LEFT && this.x > 0) {
                this.x -= this.speed;
                this.otherDirection = true;
            }

            if (
                this.world.keyboard.UP &&
                !this.isAboveGround() &&
                this.speedY === 0
            ) {
                this.jump();
            }

            if (this.world) {
                this.world.camera_x = -this.x + 100;
            }
        }, 1000 / 60);

        setInterval(() => {
            if (this.isDead()) {
                if (this.deadAnimationStarted !== true) {
                    this.deadAnimationStarted = true;
                    this.currentImage = 0;
                }

                let i = Math.min(
                    this.currentImage,
                    this.imageHub.images_dead.length - 1,
                );
                let path = this.imageHub.images_dead[i];
                this.img = this.imageCache[path];

                if (this.currentImage < this.imageHub.images_dead.length - 1) {
                    this.currentImage++;
                }
            } else if (this.isHurt()) {
                let i = this.currentImage % this.imageHub.images_hurt.length;
                let path = this.imageHub.images_hurt[i];
                this.img = this.imageCache[path];
                this.currentImage++;
            } else if (this.isAboveGround()) {
                let i = Math.min(
                    this.currentImage,
                    this.imageHub.images_jumping.length - 1,
                );
                let path = this.imageHub.images_jumping[i];
                this.img = this.imageCache[path];
                this.currentImage++;
            } else {
                if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                    let i =
                        this.currentImage % this.imageHub.images_walking.length;
                    let path = this.imageHub.images_walking[i];
                    this.img = this.imageCache[path];
                    this.currentImage++;

                    if (
                        !this.isAboveGround() &&
                        this.world &&
                        this.world.audioHub
                    ) {
                        this.world.audioHub.play("characterRun", 0.2);
                    }
                } else {
                    this.loadImage("assets/img/character/walk/stehen.webp");
                    this.currentImage = 0;

                    if (this.world && this.world.audioHub) {
                        this.world.audioHub.stop("characterRun");
                    }
                }
            }
        }, 1000 / 12);
    }

    jump() {
        this.speedY = 25;

        if (this.world && this.world.audioHub) {
            this.world.audioHub.play("characterJump", 0.4);
        }
    }
}
