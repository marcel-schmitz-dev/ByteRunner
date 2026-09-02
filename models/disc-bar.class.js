import { DrawableObject } from "./drawable-object.class.js";
import { ImageHub } from "./image.hub.js";

export class DiscBar extends DrawableObject {
    imageHub = new ImageHub();
    amount = 0;

    constructor() {
        super();
        this.loadImages(this.imageHub.images_disc);
        this.x = 12;
        this.y = 120;
        this.width = 200;
        this.height = 50;
        this.setAmount(0);
    }

    setAmount(amount) {
        this.amount = amount;
        let imagePath = this.imageHub.images_disc[0];
        this.img = this.imageCache[imagePath];
    }

    draw(ctx) {
        super.draw(ctx);
        ctx.font = "bold 22px Arial";
        ctx.fillStyle = "white";

        ctx.fillText(this.amount, this.x + 115, this.y + 38);
    }
}
