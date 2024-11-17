/**
 * leaderboardView.js
 *
 * @fileOverview Manages the creation and layout of the leaderboard view UI.
 * This includes generating leaderboards for coins collected, enemies defeated,
 * and fastest times, as well as creating navigation elements like the back button.
 */

const leaderboardUI = createLeaderboardUI();
const leaderboardHeading = createLeaderboardHeading();
const backButton = generateBackButton();

/**
 * Creates the main leaderboard UI container.
 *
 * @function createLeaderboardUI
 * @returns {HTMLElement} The leaderboard UI container element.
 */
function createLeaderboardUI() {
    const leaderboardUI = document.createElement('div');
    leaderboardUI.id = 'leaderboard-ui';
    return leaderboardUI;
}

/**
 * Creates the heading for the leaderboard view.
 *
 * @function createLeaderboardHeading
 * @returns {HTMLElement} The leaderboard heading element.
 */
function createLeaderboardHeading() {
    const leaderboardHeading = document.createElement('h3');
    leaderboardHeading.id = 'stats-heading';
    leaderboardHeading.innerText = 'Top rankings by coins, enemies, and speed';
    return leaderboardHeading;
}

/**
 * Creates the leaderboard table for the most coins collected.
 *
 * @function createCoinsCollectedLeaderboard
 * @param {Object} leaderboardStats - The leaderboard data containing top coins collected stats.
 * @returns {void}
 */
function createCoinsCollectedLeaderboard(leaderboardStats) {
    const coinsTableContainer = document.createElement('div');
    coinsTableContainer.id = 'coinstable-container';

    const coinsTableHeading = document.createElement('h3');
    coinsTableHeading.id = 'coinstable-heading';
    coinsTableHeading.innerText = 'Most collected coins';

    const coinsData = leaderboardStats.topCoins;
    const coinsTable = document.createElement('table');
    coinsTable.id = 'coins-table';
    coinsTable.innerHTML = `
    <thead>
        <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Coins Collected</th>
        </tr>
    </thead>
    <tbody>
    ${coinsData.map((player, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${player.username}</td>
            <td>${player.coins}</td>
        </tr>`).join('')}
    </tbody>`;

    coinsTableContainer.appendChild(coinsTableHeading);
    coinsTableContainer.appendChild(coinsTable);
    leaderboardUI.appendChild(coinsTableContainer);
}

/**
 * Creates the leaderboard table for the most enemies defeated.
 *
 * @function createEnemiesDefeatedLeaderboard
 * @param {Object} leaderboardStats - The leaderboard data containing top enemies defeated stats.
 * @returns {void}
 */
function createEnemiesDefeatedLeaderboard(leaderboardStats) {
    const enemiesTableContainer = document.createElement('div');
    enemiesTableContainer.id = 'enemiestable-container';

    const enemiesTableHeading = document.createElement('h3');
    enemiesTableHeading.id = 'enemiestable-heading';
    enemiesTableHeading.innerText = 'Most enemies defeated';

    const enemiesData = leaderboardStats.topEnemies;
    const enemiesTable = document.createElement('table');
    enemiesTable.id = 'enemies-table';
    enemiesTable.innerHTML = `
    <thead>
        <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Enemies Defeated</th>
        </tr>
    </thead>
    <tbody>
    ${enemiesData.map((player, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${player.username}</td>
            <td>${player.enemies}</td>
        </tr>`).join('')}
    </tbody>`;

    enemiesTableContainer.appendChild(enemiesTableHeading);
    enemiesTableContainer.appendChild(enemiesTable);
    leaderboardUI.appendChild(enemiesTableContainer);
}

/**
 * Creates the leaderboard table for the fastest times in each level.
 *
 * @function createFastestTimesLeaderboard
 * @param {Object} leaderboardStats - The leaderboard data containing fastest times stats.
 * @returns {void}
 */
function createFastestTimesLeaderboard(leaderboardStats) {
    const fastestTimesContainer = document.createElement('div');
    fastestTimesContainer.id = 'fastesttimes-container';

    const fastestTimesData = leaderboardStats.fastestTimes;

    Object.keys(fastestTimesData).forEach((level) => {
        const levelTableContainer = document.createElement('div');
        levelTableContainer.id = `level-${level}-container`;
        const levelTable = document.createElement('table');
        levelTable.id = `level-${level}-table`;
        levelTable.className = 'level-table';
        levelTable.innerHTML = `
        <thead>
            <tr>
                <th colspan="3">Level ${level}</th>
            </tr>
            <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Time (s)</th>
            </tr>
        </thead>
        <tbody>
        ${fastestTimesData[level]
            .map(
                (player, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${player.username}</td>
                    <td>${player.time}</td>
                </tr>`
            )
            .join('')}
        </tbody>`;
        levelTableContainer.appendChild(levelTable);
        fastestTimesContainer.appendChild(levelTableContainer);
    });
    leaderboardUI.appendChild(fastestTimesContainer);
}

/**
 * Generates the back button for navigating back to the profile UI.
 *
 * @function generateBackButton
 * @returns {HTMLElement} The back button element.
 */
function generateBackButton() {
    const backButton = document.createElement('button');
    backButton.id = 'back-button';
    backButton.innerText = 'back';
    return backButton;
}

export {
    leaderboardUI,
    leaderboardHeading,
    createCoinsCollectedLeaderboard,
    createEnemiesDefeatedLeaderboard,
    createFastestTimesLeaderboard,
    backButton
};