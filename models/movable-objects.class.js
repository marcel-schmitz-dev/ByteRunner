export class MovableObject {
    x = 120;
    y = 300;
    img;
    height = 130;
    width = 100;
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    moveRight() {
        console.log("moving right");
    }

    moveLeft() {}
}
