import { DrawableObject } from "./drawable-object.class.js";
import { ImageHub } from "./image.hub.js";

export class BossHpBar extends DrawableObject {
    imageHub = new ImageHub();
    percentage = 100;
    otherDirection = false;

    constructor() {
        super();
        this.loadImages(this.imageHub.images_boss_hp);
        this.x = 235;
        this.y = 15;
        this.width = 250;
        this.height = 50;
        this.setPercentage(100);
    }

    setPercentage(percentage) {
        this.percentage = percentage;
        let imagePath = this.imageHub.images_boss_hp[this.resolveImageIndex()];
        this.img = this.imageCache[imagePath];
    }

    resolveImageIndex() {
        if (this.percentage >= 100) return 5;
        if (this.percentage >= 80) return 4;
        if (this.percentage >= 60) return 3;
        if (this.percentage >= 40) return 2;
        if (this.percentage >= 20) return 1;
        return 0;
    }
}
