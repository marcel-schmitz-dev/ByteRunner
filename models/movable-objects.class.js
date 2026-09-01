export class MovableObject {
    x = 120;
    y = 300;
    img;
    imageCache = {};
    height = 130;
    width = 100;
    speed= 0.15;
    
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
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
