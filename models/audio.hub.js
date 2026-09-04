/**
 * Represents a preloaded audio resource.
 */
class MyAudio {
    /**
     * Creates and loads an audio resource.
     *
     * @param {string} file - The path or URL of the audio file.
     */
    constructor(file) {
        this.file = new Audio(file);
        this.file.load();
    }
}

/**
 * Centralizes the audio resources used by the application and provides
 * methods for controlling their playback and global mute state.
 */
export class AudioHub {
    /**
     * Creates an audio hub and initializes all available sound resources.
     */
    constructor() {
        this.isMuted = false;
        this.sounds = {
            backgroundSound: new MyAudio("assets/audio/background_sound.mp3"),
            background: new MyAudio("assets/audio/background.mp3"),
            bossDead: new MyAudio("assets/audio/boss_dead.mp3"),
            bossDetected: new MyAudio("assets/audio/boss_detected.mp3"),
            bossFightSound: new MyAudio("assets/audio/boss_fight_sound.mp3"),
            bossHurt: new MyAudio("assets/audio/boss_hurt.mp3"),
            bossLaufSound: new MyAudio("assets/audio/boss_lauf_sound.mp3"),
            bossTransformation: new MyAudio(
                "assets/audio/boss_transformation.mp3",
            ),
            characterDiscWerfen: new MyAudio(
                "assets/audio/character_disc_werfen.mp3",
            ),
            characterJump: new MyAudio("assets/audio/character_jump.mp3"),
            characterRun: new MyAudio("assets/audio/character_run.mp3"),
            enemiesDead: new MyAudio("assets/audio/enemies_dead.mp3"),
            gameOverSound: new MyAudio("assets/audio/game_over_sound.mp3"),
            pickCoin: new MyAudio("assets/audio/pick_coin.mp3"),
            pickDisc: new MyAudio("assets/audio/pick_disc.mp3"),
            startSoundCountdown: new MyAudio(
                "assets/audio/start_sound_countdown.mp3",
            ),
        };

        this.sounds.background.file.loop = true;
        this.sounds.backgroundSound.file.loop = true;
        this.sounds.bossLaufSound.file.loop = true;
        this.sounds.characterRun.file.loop = true;
        this.sounds.bossFightSound.file.loop = true;
    }

    /**
     * Plays a registered sound from the beginning at the specified volume.
     *
     * If playback is blocked by the browser, muted, or otherwise fails, the error is
     * logged to the console. Unknown sound names are ignored.
     *
     * @param {string} soundName - The name of the sound to play.
     * @param {number} [volume=1.0] - The playback volume, usually from 0.0 to 1.0.
     * @returns {void}
     */
    play(soundName, volume = 1.0) {
        if (this.isMuted) return;
        let soundObj = this.sounds[soundName];
        if (soundObj) {
            soundObj.file.currentTime = 0;
            soundObj.file.volume = volume;
            soundObj.file.play().catch((e) => {
                console.log("Audio play blocked or error:", e);
            });
        }
    }

    /**
     * Stops a registered sound and resets its playback position.
     *
     * Unknown sound names are ignored.
     *
     * @param {string} soundName - The name of the sound to stop.
     * @returns {void}
     */
    stop(soundName) {
        let soundObj = this.sounds[soundName];
        if (soundObj) {
            soundObj.file.pause();
            soundObj.file.currentTime = 0;
        }
    }

    /**
     * Toggles the global mute state for all preloaded audio assets.
     *
     * @returns {boolean} The updated mute status.
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        for (let key in this.sounds) {
            let soundObj = this.sounds[key];
            if (soundObj && soundObj.file) {
                soundObj.file.muted = this.isMuted;
            }
        }
        return this.isMuted;
    }
}
