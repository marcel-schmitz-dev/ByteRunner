import { DrawableObject } from "./drawable-object.class.js";
import { ImageHub } from "./image.hub.js";

export class StatusBar extends DrawableObject {
    imageHub = new ImageHub();
    percentage = 100;
    imageArray;
    text = "";

    constructor(
        imageArray,
        initialPercentage = 100,
        yPosition = 0,
        width = 150,
        height = 40,
    ) {
        super();
        this.imageArray =
            imageArray && imageArray.length > 0
                ? imageArray
                : this.imageHub.images_hp;
        this.loadImages(this.imageArray);
        this.x = 20;
        this.y = yPosition;
        this.width = width;
        this.height = height;
        this.setPercentage(initialPercentage);
    }

    setPercentage(percentage, text = "") {
        this.percentage = percentage;
        this.text = text;

        let imagePath;
        if (this.imageArray.length === 1) {
            imagePath = this.imageArray[0];
        } else {
            imagePath = this.imageArray[this.resolveImageIndex()];
        }

        if (this.imageCache && this.imageCache[imagePath]) {
            this.img = this.imageCache[imagePath];
        }
    }

    draw(ctx) {
        super.draw(ctx);

        if (this.text !== "") {
            ctx.save();
            ctx.font = "bold 22px 'Courier New', monospace";
            ctx.fillStyle = "#00ffff";
            ctx.shadowColor = "#00ffff"; 
            ctx.shadowBlur = 10;
            ctx.textAlign = "left";
            ctx.fillText(this.text, this.x + 75, this.y + (this.height / 1.6));
            ctx.restore();
        }
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
