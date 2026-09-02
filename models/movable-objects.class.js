export class MovableObject {
    x = 120;
    y = 300;
    img;
    imageCache = {};
    height = 130;
    width = 100;
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } else {
                this.speedY = 0;
                this.y = 300;
            }
        }, 1000 / 25);
    }

    isAboveGround() {
        return this.y < 300;
    }

    isAboveGround() {
        return this.y < 300;
    }

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    drawFrame(ctx) {
        if (
            ["Character", "MouseDrone", "HardDrive", "Endboss"].includes(
                this.constructor.name,
            )
        ) {
            ctx.beginPath();
            ctx.lineWidth = "5";
            ctx.strokeStyle = "blue";
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
    }

    isColliding(mo){
        return this.x +this.width > mo.x && 
        this.y +this.height > mo.y &&
        this.x < mo.x && this.y < mo.y + mo.height
    }

    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    moveRight() {
        console.log("moving right");
    }

    moveLeft() {
        setInterval(() => {
            this.x -= 0.15;
        }, 1000 / 60);
    }
}
