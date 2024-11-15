export class Player {
    constructor(username, character, coinsCollected, enemiesDefeated) {
        this.username = username;
        this.character = character;
        this.coinsCollected = coinsCollected;
        this.enemiesDefeated = enemiesDefeated;
        this.levelsCompleted = [];
        this.fastestTimes = {"1": [], "2": []};
    }

    getPlayerInfo() {
        return `Player Stats:
                Username: ${this.username || "Unknown"}
                Character: ${this.character || "Not selected"}
                Coins Collected: ${this.coinsCollected || 0}
                Enemies Defeated: ${this.enemiesDefeated || 0}
                Levels Completed: ${this.levelsCompleted}`
    }

    getUsername() {
        return this.username;
    }

    getCoinsCollected() {
        return this.coinsCollected;
    }

    getEnemiesDefeated() {
        return this.enemiesDefeated
    }

    getLevelsCompleted() {
        return this.levelsCompleted;
    }

    getFastestTimes() {
        return this.fastestTimes;
    }

    setUsername(username) {
        this.username = username;
    }

    setCharacter(character) {
        this.character = character;
    }

    setCoinsCollected(coinsCollected) {
        this.coinsCollected = coinsCollected;
    }

    setEnemies(enemiesDefeated) {
        this.enemiesDefeated = enemiesDefeated
    }

    setAllStats(stats) {
        this.coinsCollected = stats['coins-collected'];
        this.enemiesDefeated = stats['enemies-defeated'];
        this.levelsCompleted = stats['levels-completed'];
        this.fastestTimes = stats['fastest-times'];
    }

    appendLevels(level) {
        if (!this.levelsCompleted.includes(level)) {
            this.levelsCompleted.push(level);
        }
    }

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