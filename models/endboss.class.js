import { MovableObject } from "./movable-objects.class.js";
import { ImageHub } from "./image.hub.js";

export class Endboss extends MovableObject {
    height = 350;
    width = 300;
    speed = 1.5;
    energy = 100;

    imageHub = new ImageHub();
    currentImage = 0;

    hasBeenSeen = false;
    isTransforming = false;
    isAwake = false;
    isDeadAnimationPlayed = false;

    constructor(startX) {
        super();
        this.loadImage("assets/img/boss/bossTransformation0.webp");
        this.loadImages(this.imageHub.images_boss_transformation);
        this.loadImages(this.imageHub.images_boss_walk);
        this.loadImages(this.imageHub.images_boss_dead);

        this.x = startX !== undefined ? startX : 2700;
        this.y = 80;
    }

    awakening() {
        if (this.hasBeenSeen) return;
        this.hasBeenSeen = true;
        this.isTransforming = true;

        let transformationIndex = 0;
        let transformInterval = setInterval(() => {
            if (
                transformationIndex <
                this.imageHub.images_boss_transformation.length
            ) {
                let path =
                    this.imageHub.images_boss_transformation[
                        transformationIndex
                    ];
                this.img = this.imageCache[path];
                transformationIndex++;
            } else {
                clearInterval(transformInterval);
                this.isTransforming = false;
                this.isAwake = true;
                this.animate();
            }
        }, 150);
    }

    hunt(character) {
        if (!this.isAwake || this.isDead()) return;

        if (this.x > character.x) {
            this.x -= this.speed;
            this.otherDirection = false;
        } else if (this.x < character.x) {
            this.x += this.speed;
            this.otherDirection = true;
        }
    }

    animate() {
        setInterval(() => {
            if (this.isDead()) {
                if (!this.isDeadAnimationPlayed) {
                    let deadIndex = 0;
                    let deadInterval = setInterval(() => {
                        if (deadIndex < this.imageHub.images_boss_dead.length) {
                            let path =
                                this.imageHub.images_boss_dead[deadIndex];
                            this.img = this.imageCache[path];
                            deadIndex++;
                        } else {
                            clearInterval(deadInterval);
                            this.isDeadAnimationPlayed = true;
                        }
                    }, 150);
                }
            } else if (this.isAwake) {
                let i =
                    this.currentImage % this.imageHub.images_boss_walk.length;
                let path = this.imageHub.images_boss_walk[i];
                this.img = this.imageCache[path];
                this.currentImage++;
            }
        }, 1000 / 10);
    }
}
