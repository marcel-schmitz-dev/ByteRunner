import { Character } from "./character.class.js";
import { HardDrive } from "./hard-drive.class.js";
import { MouseDrone } from "./mouse-drone.class.js";
import { Boss } from "./boss.class.js";

export class World {
    character = new Character();
    enemies = [
        new MouseDrone(),
        new MouseDrone(),
        new MouseDrone(),
        new MouseDrone(),
        new MouseDrone(),
        new HardDrive(),
        new HardDrive(),
        new HardDrive(),
        new HardDrive(),
        new HardDrive(),
        new Boss(),
    ];

    draw() {}
}
