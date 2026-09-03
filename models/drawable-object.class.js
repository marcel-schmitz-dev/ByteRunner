/**
 * Provides the base functionality for objects that can be rendered on a canvas.
 */
export class DrawableObject {
    /** @type {number} Horizontal position of the object in pixels. */
    x = 120;
    /** @type {number} Vertical position of the object in pixels. */
    y = 300;
    /** @type {number} Height of the object in pixels. */
    height = 130;
    /** @type {number} Width of the object in pixels. */
    width = 100;
    /** @type {HTMLImageElement|undefined} Image currently assigned to the object. */
    img;
    /** @type {Object.<string, HTMLImageElement>} Images cached by their source path. */
    imageCache = {};
    /** @type {number} Index of the currently selected image. */
    currentImage = 0;

    /**
     * Creates a drawable object with default position and dimensions.
     */
    constructor() {}

    /**
     * Loads an image and assigns it as the object's current image.
     *
     * @param {string} path - Path or URL of the image to load.
     * @returns {void}
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Draws the current image at the object's position and dimensions.
     *
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     * @returns {void}
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Loads multiple images into the object's image cache.
     *
     * @param {string[]} arr - Paths or URLs of the images to cache.
     * @returns {void}
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Draws a blue debugging frame around supported drawable object types.
     *
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     * @returns {void}
     */
    drawFrame(ctx) {
        if (
            [
                "Character",
                "MouseDrone",
                "HardDrive",
                "Endboss",
                "StatusBar",
            ].includes(this.constructor.name)
        ) {
            ctx.beginPath();
            ctx.lineWidth = "5";
            ctx.strokeStyle = "blue";
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
    }
}
