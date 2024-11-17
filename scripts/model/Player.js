/**
 * @fileOverview Represents a player in the game.
 */
export class Player {
    /**
     * Creates a new Player instance.
     * @param {string} username - The username of the player.
     * @param {string} character - The character chosen by the player.
     * @param spritesheet - The spritesheet used by Phaser.js.
     * @param {number} coinsCollected - The number of coins collected by the player.
     * @param {number} enemiesDefeated - The number of enemies defeated by the player.
     */
    constructor(username, character, spritesheet, coinsCollected, enemiesDefeated) {
        this.username = username;
        this.character = character;
        this.spritesheet = spritesheet;
        this.coinsCollected = coinsCollected;
        this.enemiesDefeated = enemiesDefeated;
        this.levelsCompleted = [];
        this.fastestTimes = {"1": [], "2": []};
    }

    /**
     * Retrieves a formatted string of the player's information and stats.
     * @returns {string} The player's stats as a formatted string.
     */
    getPlayerInfo() {
        const timesTakenFormatted = Object.entries(this.getFastestTimes())
            .map(([level, times]) => `    Level ${level}: ${times.join(", ")}`)
            .join("\n");

        return `Player Stats:
    Username: ${this.username || "Unknown"}
    Character: ${this.character || "Not selected"}
    Coins Collected: ${this.coinsCollected || 0}
    Enemies Defeated: ${this.enemiesDefeated || 0}
    Levels Completed: ${this.levelsCompleted}
    Times Taken:
${timesTakenFormatted}`;
    }

    /**
     * Retrieves the username of the player.
     * @returns {string} The username of the player.
     */
    getUsername() {
        return this.username;
    }

    /**
     * Retrieves the spritesheet for character chosen by the player.
     * @returns {string} spritesheet - Spritesheet used by Phaser.js.
     */
    getSpritesheet() {
        return this.spritesheet;
    }

    /**
     * Retrieves the total number of coins collected by the player.
     * @returns {number} The total coins collected.
     */
    getCoinsCollected() {
        return this.coinsCollected;
    }

    /**
     * Retrieves the total number of enemies defeated by the player.
     * @returns {number} The total enemies defeated.
     */
    getEnemiesDefeated() {
        return this.enemiesDefeated;
    }

    /**
     * Retrieves the levels completed by the player.
     * @returns {Array<number>} An array of completed level numbers.
     */
    getLevelsCompleted() {
        return this.levelsCompleted;
    }

    /**
     * Retrieves the fastest times for each level.
     * @returns {*|{"1": *[], "2": *[]}} An object mapping level numbers to the fastest times.
     */
    getFastestTimes() {
        return this.fastestTimes;
    }

    /**
     * Updates the username of the player.
     * @param {string} username - The new username.
     */
    setUsername(username) {
        this.username = username;
    }

    /**
     * Updates the character chosen by the player.
     * @param {string} character - The new character.
     */
    setCharacter(character) {
        this.character = character;
    }

    /**
     * Updates the spritesheet for character chosen by the player.
     * @param {string} spritesheet - Spritesheet used by Phaser.js.
     */
    setSpritesheet(spritesheet) {
        this.spritesheet = spritesheet;
    }

    /**
     * Updates the total number of coins collected by the player.
     * @param {number} coinsCollected - The new total coins collected.
     */
    setCoinsCollected(coinsCollected) {
        this.coinsCollected = coinsCollected;
    }

    /**
     * Updates the total number of enemies defeated by the player.
     * @param {number} enemiesDefeated - The new total enemies defeated.
     */
    setEnemies(enemiesDefeated) {
        this.enemiesDefeated = enemiesDefeated;
    }

    /**
     * Updates all stats for the player.
     * @param {Object} stats - An object containing the updated stats.
     * @param {number} stats.coins-collected - The total coins collected.
     * @param {number} stats.enemies-defeated - The total enemies defeated.
     * @param {Array<number>} stats.levels-completed - The levels completed.
     * @param {Object<string, Array<number>>} stats.fastest-times - The fastest times for levels.
     */
    setAllStats(stats) {
        this.coinsCollected = stats['coins-collected'];
        this.enemiesDefeated = stats['enemies-defeated'];
        this.levelsCompleted = stats['levels-completed'];
        this.fastestTimes = stats['fastest-times'];
    }

    /**
     * Appends a level to the list of completed levels if it hasn't been completed already.
     * @param {number} level - The level number to add.
     */
    appendLevels(level) {
        if (!this.levelsCompleted.includes(level)) {
            this.levelsCompleted.push(level);
        }
    }

    /**
     * Appends a time taken for a level to the fastest times list, keeping only the top 10 fastest times.
     * @param {string} level - The level number.
     * @param {number} timeTaken - The time taken to complete the level.
     */
    appendFastestTimes(level, timeTaken) {
        if (!this.fastestTimes[level]) {
            this.fastestTimes[level] = [];
        }

        this.fastestTimes[level].push(timeTaken);
        this.fastestTimes[level].sort((a, b) => a - b);

        if (this.fastestTimes[level].length > 10) {
            this.fastestTimes[level].pop();
        }
    }
}