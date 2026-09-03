import { DrawableObject } from "./drawable-object.class.js";
import { ImageHub } from "./image.hub.js";

/**
 * Represents a user interface status bar (like health or inventory items) with dynamic rendering and text overlays.
 */
export class StatusBar extends DrawableObject {
    imageHub = new ImageHub();
    percentage = 100;
    imageArray;
    text = "";

    /**
     * Initializes a new instance of the StatusBar class.
     * @param {string[]} imageArray - Array of image paths for different status levels.
     * @param {number} [initialPercentage=100] - Starting percentage value.
     * @param {number} [yPosition=0] - Vertical screen coordinate.
     * @param {number} [width=150] - Width of the bar.
     * @param {number} [height=40] - Height of the bar.
     */
    constructor(
        imageArray,
        initialPercentage = 100,
        yPosition = 0,
        width = 150,
        height = 40,
    ) {
        super();
        this.initializeImageArray(imageArray);
        this.configureDimensions(yPosition, width, height);
        this.setPercentage(initialPercentage);
    }

    /**
     * Initializes the status bar's image collection and preloads them.
     * @param {string[]} imageArray - Provided image array.
     */
    initializeImageArray(imageArray) {
        this.imageArray = imageArray && imageArray.length > 0 ? imageArray : this.imageHub.images_hp;
        this.loadImages(this.imageArray);
    }

    /**
     * Sets position and scaling metrics for the status bar.
     * @param {number} yPosition - Y-axis location.
     * @param {number} width - Element width.
     * @param {number} height - Element height.
     */
    configureDimensions(yPosition, width, height) {
        this.x = 20;
        this.y = yPosition;
        this.width = width;
        this.height = height;
    }

    /**
     * Updates the percentage status and refreshes the displayed image and text.
     * @param {number} percentage - Current percentage value.
     * @param {string} [text=""] - Optional text overlay (e.g. item count).
     */
    setPercentage(percentage, text = "") {
        this.percentage = percentage;
        this.text = text;
        this.updateBarImage();
    }

    /**
     * Selects and applies the correct image frame based on percentage or single asset configuration.
     */
    updateBarImage() {
        let imagePath = this.imageArray.length === 1 
            ? this.imageArray[0] 
            : this.imageArray[this.resolveImageIndex()];

        if (this.imageCache && this.imageCache[imagePath]) {
            this.img = this.imageCache[imagePath];
        }
    }

    /**
     * Renders the status bar and its optional text overlay onto the canvas context.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        super.draw(ctx);
        if (this.text !== "") {
            this.renderTextOverlay(ctx);
        }
    }

    /**
     * Renders custom styled text over the status bar icon.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    renderTextOverlay(ctx) {
        ctx.save();
        ctx.font = "bold 22px 'Courier New', monospace";
        ctx.fillStyle = "#00ffff";
        ctx.shadowColor = "#00ffff";
        ctx.shadowBlur = 10;
        ctx.textAlign = "left";
        ctx.fillText(this.text, this.x + 75, this.y + this.height / 1.6);
        ctx.restore();
    }

    /**
     * Determines the appropriate image index from the array based on current energy or count.
     * @returns {number} The target array index.
     */
    resolveImageIndex() {
        if (this.percentage >= 100) return 5;
        if (this.percentage >= 80) return 4;
        if (this.percentage >= 60) return 3;
        if (this.percentage >= 40) return 2;
        if (this.percentage >= 20) return 1;
        return 0;
    }
}