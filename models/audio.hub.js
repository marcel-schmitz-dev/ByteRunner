export class AudioHub {
    constructor() {
        this.sounds = {
            backgroundSound: new Audio("assets/audio/background_sound.mp3"),
            background: new Audio("assets/audio/background.mp3"),
            bossDead: new Audio("assets/audio/boss_dead.mp3"),
            bossDetected: new Audio("assets/audio/boss_detected.mp3"),
            bossFightSound: new Audio("assets/audio/boss_fight_sound.mp3"),
            bossHurt: new Audio("assets/audio/boss_hurt.mp3"),
            bossLaufSound: new Audio("assets/audio/boss_lauf_sound.mp3"),
            bossTransformation: new Audio(
                "assets/audio/boss_transformation.mp3",
            ),
            characterDiscWerfen: new Audio(
                "assets/audio/character_disc_werfen.mp3",
            ),
            characterJump: new Audio("assets/audio/character_jump.mp3"),
            characterRun: new Audio("assets/audio/character_run.mp3"),
            enemiesDead: new Audio("assets/audio/enemies_dead.mp3"),
            gameOverSound: new Audio("assets/audio/game_over_sound.mp3"),
            pickCoin: new Audio("assets/audio/pick_coin.mp3"),
            pickDisc: new Audio("assets/audio/pick_disc.mp3"),
            startSoundCountdown: new Audio(
                "assets/audio/start_sound_countdown.mp3",
            ),
        };

        this.sounds.background.loop = true;
        this.sounds.backgroundSound.loop = true;
        this.sounds.bossLaufSound.loop = true;
        this.sounds.characterRun.loop = true;
        this.sounds.bossFightSound.loop = true;
    }

    play(soundName, volume = 1.0) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].volume = volume;
            this.sounds[soundName].play().catch((e) => {
                console.log("Audio play blocked or error:", e);
            });
        }
    }

    stop(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].pause();
            this.sounds[soundName].currentTime = 0;
        }
    }
}
