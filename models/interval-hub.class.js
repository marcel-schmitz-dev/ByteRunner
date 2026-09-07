/**
 * Registers game intervals and stops them when a game session ends.
 */
export class IntervalHub {
    static intervalIds = [];

    /**
     * Starts and registers an interval.
     * @param {Function} callback - Function to run repeatedly.
     * @param {number} delay - Delay in milliseconds.
     * @returns {number} Registered interval identifier.
     */
    static start(callback, delay) {
        let intervalId = setInterval(callback, delay);
        this.intervalIds.push(intervalId);
        return intervalId;
    }

    /**
     * Stops and unregisters one interval.
     * @param {number} intervalId - Interval identifier to stop.
     */
    static stop(intervalId) {
        clearInterval(intervalId);
        this.intervalIds = this.intervalIds.filter((id) => id !== intervalId);
    }

    /**
     * Stops and clears every registered interval.
     */
    static stopAll() {
        this.intervalIds.forEach((intervalId) => clearInterval(intervalId));
        this.intervalIds = [];
    }
}
