/**
 * Central registry of image asset paths used throughout the game.
 *
 * The image collections are grouped by their purpose and can be consumed by
 * animations, user-interface components, characters, and enemies.
 */
export class ImageHub {
    /**
     * Creates an image asset registry.
     */
    constructor() {
        // Image collections are declared as instance fields.
    }

    // ==========================================
    //        STATUS BAR (HUD)
    // ==========================================
    /** @type {string[]} Image paths for the player's health bar states. */
    images_hp = [
        "assets/img/hud/hpBar0.webp",
        "assets/img/hud/hpBar1.webp",
        "assets/img/hud/hpBar2.webp",
        "assets/img/hud/hpBar3.webp",
        "assets/img/hud/hpBar4.webp",
        "assets/img/hud/hpBar5.webp",
    ];
    /** @type {string[]} Image path for the disc bar. */
    images_disc = ["assets/img/hud/discBar.webp"];
    /** @type {string[]} Image path for the coin bar. */
    images_coinbar = ["assets/img/hud/coinBar.webp"];
    /** @type {string[]} Image paths for the coin animation frames. */
    images_coin = [
        "assets/img/coin/coin0.webp",
        "assets/img/coin/coin1.webp",
        "assets/img/coin/coin2.webp",
        "assets/img/coin/coin3.webp",
    ];

    // ==========================================
    //        CHARAKTER BILDER (HERO)
    // ==========================================

    /** @type {string[]} Image paths for the hero's walking animation. */
    images_walking = [
        "assets/img/character/walk/walk0.webp",
        "assets/img/character/walk/walk1.webp",
        "assets/img/character/walk/walk2.webp",
        "assets/img/character/walk/walk3.webp",
        "assets/img/character/walk/walk4.webp",
        "assets/img/character/walk/walk5.webp",
        "assets/img/character/walk/walk6.webp",
        "assets/img/character/walk/walk7.webp",
        "assets/img/character/walk/walk8.webp",
    ];

    /** @type {string[]} Image paths for the hero's jumping animation. */
    images_jumping = [
        "assets/img/character/jump/jump0.webp",
        "assets/img/character/jump/jump1.webp",
        "assets/img/character/jump/jump2.webp",
        "assets/img/character/jump/jump3.webp",
        "assets/img/character/jump/jump4.webp",
    ];

    /** @type {string[]} Image paths for the hero's hurt animation. */
    images_hurt = [
        "assets/img/character/dead/dead0.webp",
        "assets/img/character/dead/dead1.webp",
    ];

    /** @type {string[]} Image paths for the hero's death animation. */
    images_dead = [
        "assets/img/character/dead/dead0.webp",
        "assets/img/character/dead/dead1.webp",
        "assets/img/character/dead/dead2.webp",
        "assets/img/character/dead/dead3.webp",
        "assets/img/character/dead/dead4.webp",
        "assets/img/character/dead/dead5.webp",
    ];

    // ==========================================
    //        GEGNER BILDER (ENEMIES)
    // ==========================================

    /** @type {string[]} Image paths for the hard-drive enemy animation. */
    images_hard_drive = [
        "assets/img/monster/hardDrive0.webp",
        "assets/img/monster/hardDrive1.webp",
        "assets/img/monster/hardDrive2.webp",
        "assets/img/monster/hardDrive3.webp",
        "assets/img/monster/hardDrive4.webp",
        "assets/img/monster/hardDrive5.webp",
        "assets/img/monster/hardDrive6.webp",
        "assets/img/monster/hardDrive7.webp",
        "assets/img/monster/hardDrive8.webp",
    ];

    /** @type {string[]} Image paths for the mouse-drone enemy animation. */
    images_mouse_drone = [
        "assets/img/monster/mouseDrone0.webp",
        "assets/img/monster/mouseDrone1.webp",
        "assets/img/monster/mouseDrone2.webp",
        "assets/img/monster/mouseDrone3.webp",
        "assets/img/monster/mouseDrone4.webp",
        "assets/img/monster/mouseDrone5.webp",
        "assets/img/monster/mouseDrone6.webp",
        "assets/img/monster/mouseDrone7.webp",
        "assets/img/monster/mouseDrone8.webp",
    ];

    /** @type {string[]} Image paths for the boss health bar states. */
    images_boss_hp = [
        "assets/img/hud/boss_hp_bar0.webp",
        "assets/img/hud/boss_hp_bar1.webp",
        "assets/img/hud/boss_hp_bar2.webp",
        "assets/img/hud/boss_hp_bar3.webp",
        "assets/img/hud/boss_hp_bar4.webp",
        "assets/img/hud/boss_hp_bar5.webp",
    ];

    /** @type {string[]} Image paths for the boss transformation animation. */
    images_boss_transformation = [
        "assets/img/boss/bossTransformation0.webp",
        "assets/img/boss/bossTransformation1.webp",
        "assets/img/boss/bossTransformation2.webp",
        "assets/img/boss/bossTransformation3.webp",
        "assets/img/boss/bossTransformation4.webp",
        "assets/img/boss/bossTransformation5.webp",
    ];
    /** @type {string[]} Image paths for the boss walking animation. */
    images_boss_walk = [
        "assets/img/boss/bossWalk0.webp",
        "assets/img/boss/bossWalk1.webp",
        "assets/img/boss/bossWalk2.webp",
        "assets/img/boss/bossWalk3.webp",
        "assets/img/boss/bossWalk4.webp",
        "assets/img/boss/bossWalk5.webp",
        "assets/img/boss/bossWalk6.webp",
        "assets/img/boss/bossWalk7.webp",
        "assets/img/boss/bossWalk8.webp",
    ];

    /** @type {string[]} Image paths for the boss death animation. */
    images_boss_dead = [
        "assets/img/boss/bossDead0.webp",
        "assets/img/boss/bossDead1.webp",
        "assets/img/boss/bossDead2.webp",
        "assets/img/boss/bossDead3.webp",
    ];
}
