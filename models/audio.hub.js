/**
 * Represents a preloaded audio resource.
 */
class MyAudio {
    /**
     * Creates and loads an audio resource.
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
        this.isMuted = localStorage.getItem("byteRunner_muted") === "true";
        this.initializeSounds();
        this.configureLoopingSounds();
        this.applyMuteStateToAll();
    }

    /**
     * Initializes all game sound instances.
     */
    initializeSounds() {
        this.sounds = {
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
            character_snoring: new MyAudio(
                "assets/audio/character_snoring.mp3",
            ),
            gameOverSound: new MyAudio("assets/audio/game_over_sound.mp3"),
            pickCoin: new MyAudio("assets/audio/pick_coin.mp3"),
            pickDisc: new MyAudio("assets/audio/pick_disc.mp3"),
            startSoundCountdown: new MyAudio(
                "assets/audio/start_sound_countdown.mp3",
            ),
            youWin: new MyAudio("assets/audio/you_wIn.mp3"),
        };
    }

    /**
     * Configures looping behavior for specific ambient and movement sounds.
     */
    configureLoopingSounds() {
        this.setSoundLoop("background", true);
        this.setSoundLoop("bossLaufSound", true);
        this.setSoundLoop("characterRun", true);
        this.setSoundLoop("bossFightSound", true);
        this.setSoundLoop("character_snoring", true);
    }

    /**
     * Enables or disables looping for a specific sound key.
     * @param {string} soundKey - The name of the sound.
     * @param {boolean} isLooping - Loop state.
     */
    setSoundLoop(soundKey, isLooping) {
        if (this.sounds[soundKey]?.file) {
            this.sounds[soundKey].file.loop = isLooping;
        }
    }

    /**
     * Applies the current mute state across all registered sounds.
     */
    applyMuteStateToAll() {
        for (let key in this.sounds) {
            this.updateSoundMuteState(this.sounds[key]);
        }
    }

    /**
     * Updates mute property on an individual sound object.
     * @param {MyAudio} soundObj - The audio object.
     */
    updateSoundMuteState(soundObj) {
        if (soundObj?.file) {
            soundObj.file.muted = this.isMuted;
        }
    }

    /**
     * Plays a specific sound by name with a given volume.
     * @param {string} soundName - Name of the sound key.
     * @param {number} [volume=1.0] - Volume level between 0.0 and 1.0.
     */
    play(soundName, volume = 1.0) {
        if (this.isMuted) return;
        let soundObj = this.sounds[soundName];
        if (soundObj) {
            this.executeSoundPlayback(soundObj, volume);
        }
    }

    /**
     * Executes the audio playback with time reset and error handling.
     * @param {MyAudio} soundObj - The audio object.
     * @param {number} volume - Volume level.
     */
    executeSoundPlayback(soundObj, volume) {
        soundObj.file.currentTime = 0;
        soundObj.file.volume = volume;
        soundObj.file.play().catch((e) => {
            if (e.name !== "AbortError") {
                console.log("Audio play blocked or error:", e);
            }
        });
    }

    /**
     * Pauses and resets a specific sound.
     * @param {string} soundName - Name of the sound key.
     */
    stop(soundName) {
        let soundObj = this.sounds[soundName];
        if (soundObj?.file) {
            soundObj.file.pause();
            soundObj.file.currentTime = 0;
            soundObj.file.loop = false;
        }
    }

    /**
     * Toggles the global mute state and saves it to local storage.
     * @returns {boolean} The new mute state.
     */
    toggleMute() {
        this.setMuted(!this.isMuted);
        return this.isMuted;
    }

    /**
     * Sets the global mute state and applies it to all registered sounds.
     * @param {boolean} isMuted - Whether all sounds should be muted.
     */
    setMuted(isMuted) {
        this.isMuted = isMuted;
        localStorage.setItem("byteRunner_muted", isMuted);
        this.applyMuteStateToAll();
    }
}
