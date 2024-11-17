/**
 * statsView.js
 *
 * @fileOverview Manages the creation and layout of the stats view user interface.
 * This includes functions to generate the stats container, headings, scoreboards,
 * level times tables, and navigation elements like the back button.
 */

const statsUI = createStatsUI();
const statsHeading = createStatsHeading();
const backButton = generateBackButton();

/**
 * Creates the main stats UI container.
 *
 * @function createStatsUI
 * @returns {HTMLElement} The stats UI container element.
 */
function createStatsUI() {
    const statsUI = document.createElement('div');
    statsUI.id = 'stats-ui';
    return statsUI;
}

/**
 * Creates the stats heading for the stats view.
 *
 * @function createStatsHeading
 * @returns {HTMLElement} The stats heading element.
 */
function createStatsHeading() {
    const statsHeading = document.createElement('h3');
    statsHeading.id = 'stats-heading';
    statsHeading.innerText = 'Here are your stats';
    return statsHeading;
}

/**
 * Creates and displays the player's scoreboard, including coins collected and enemies defeated.
 *
 * @function createScoreboard
 * @param {number} coinsCollected - Total coins collected by the player.
 * @param {number} enemiesDefeated - Total enemies defeated by the player.
 * @returns {void}
 */
function createScoreboard(coinsCollected, enemiesDefeated) {
    const scoreboardDiv = document.createElement('div');
    scoreboardDiv.id = 'scoreboard-div';
    scoreboardDiv.innerHTML = `
    <h3 id="scoreboard-heading">Scoreboard</h3>
    <div id="stats">
        <p>Total coins collected: ${coinsCollected}</p>
        <p>Total enemies defeated: ${enemiesDefeated}</p>
    </div>
    `;
    statsUI.appendChild(scoreboardDiv);
}

/**
 * Creates and displays the player's fastest times for each level in a tabular format.
 *
 * @function createTimesTaken
 * @param {Object} timesTaken - An object mapping levels to arrays of fastest times.
 * @returns {void}
 */
function createTimesTaken(timesTaken) {
    const timesTakenDiv = document.createElement('div');
    timesTakenDiv.id = 'times-taken';
    timesTakenDiv.innerHTML = `
        <h3 id="timestaken-heading">Your fastest times taken for each level (seconds)</h3>
    `;
    statsUI.appendChild(timesTakenDiv);

    const statsContainer = document.createElement('div');
    statsContainer.id = 'stats-container';

    Object.entries(timesTaken).forEach(([level, times]) => {
        // Create a table for this level
        const statsTable = document.createElement('table');
        statsTable.id = 'stats-table';
        statsTable.innerHTML = `
            <thead>
                <tr>
                    <th colspan="2" style="text-align: center; border: 1px solid #ddd;">Level ${level}</th>
                </tr>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 4px;">Rank</th>
                    <th style="border: 1px solid #ddd; padding: 4px;">Time (s)</th>
                </tr>
            </thead>
            <tbody>
                ${times.map((time, index) => `
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 4px; text-align: center;">${index + 1}</td>
                        <td style="border: 1px solid #ddd; padding: 4px; text-align: center;">${time}</td>
                    </tr>
                `).join('')}
            </tbody>
        `;
        statsContainer.appendChild(statsTable);
    });
    timesTakenDiv.appendChild(statsContainer);
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

export {statsUI, statsHeading, createScoreboard, createTimesTaken, backButton};