/**
 * profileView.js
 *
 * This file manages the creation and setup of the profile view user interface.
 * It includes functions to create the main profile container, generate character
 * selection HTML, and action buttons for gameplay (play, stats, leaderboard, logout).
 */

const gameDiv = document.getElementById('game-div');
const profileUI = createProfile();
const playButton = generatePlayButton();
const statsButton = generateStatsButton();
const leaderboardButton = generateLeaderboardButton();
const logoutButton = generateLogoutButton();

/**
 * Creates the main profile ScoreBoard container element.
 *
 * @function createProfile
 * @returns {HTMLElement} The profile ScoreBoard container.
 */
function createProfile() {
    const profileUI = document.createElement('div');
    profileUI.id = 'profile-ui';
    gameDiv.appendChild(profileUI);
    return profileUI;
}

/**
 * Generates the HTML structure for character selection in the profile ScoreBoard.
 *
 * @function generateSelectCharacterHTML
 * @param {HTMLElement} profileUI - The profile ScoreBoard container to append character selection HTML.
 * @param username
 */
function generateSelectCharacterHTML(profileUI, username) {
    profileUI.innerHTML = `
    <div id="select-character-div">
        <h2 id="character-heading">Hello ${username}, select your character</h2>
        <div id="sprite-select"></div>
    </div>
    `;
}

/**
 * Appends action buttons (play, stats, leaderboard, logout) to the profile ScoreBoard's action menu.
 *
 * @function generateButtons
 * @param {HTMLElement} playButton - The play button element.
 * @param {HTMLElement} statsButton - The stats button element.
 * @param {HTMLElement} leaderboardButton - The leaderboard button element.
 * @param {HTMLElement} logoutButton - The logout button element.
 */
function generateButtons(playButton, statsButton, leaderboardButton, logoutButton) {
    const actionMenu = document.createElement('div');
    actionMenu.id = 'action-menu';
    profileUI.appendChild(actionMenu);
    actionMenu.appendChild(playButton);
    actionMenu.appendChild(statsButton);
    actionMenu.appendChild(leaderboardButton);
    actionMenu.append(logoutButton);
}

/**
 * Generates the play button for the profile ScoreBoard and attaches a click event to start the game.
 *
 * @function generatePlayButton
 * @returns {HTMLElement} The play button element.
 */
function generatePlayButton() {
    const playButton = document.createElement('button');
    playButton.id = 'play-button';
    playButton.innerText = 'play';
    return playButton;
}

/**
 * Generates the stats button for viewing game stats.
 *
 * @function generateStatsButton
 * @returns {HTMLElement} The stats button element.
 */
function generateStatsButton() {
    const statsButton = document.createElement('button');
    statsButton.id = 'stats-button';
    statsButton.innerText = 'view stats';
    return statsButton;
}

/**
 * Generates the leaderboard button for viewing the game leaderboard.
 *
 * @function generateLeaderboardButton
 * @returns {HTMLElement} The leaderboard button element.
 */
function generateLeaderboardButton() {
    const leaderboardButton = document.createElement('button');
    leaderboardButton.id = 'leaderboard-button';
    leaderboardButton.innerText = 'leaderboard';
    return leaderboardButton;
}

/**
 * Generates the logout button for logging out of the profile.
 *
 * @function generateLogoutButton
 * @returns {HTMLElement} The logout button element.
 */
function generateLogoutButton() {
    const logoutButton = document.createElement('button');
    logoutButton.id = 'logout-button';
    logoutButton.innerText = 'logout';
    return logoutButton;
}

export {
    profileUI,
    generateSelectCharacterHTML,
    generateButtons,
    playButton,
    statsButton,
    leaderboardButton,
    logoutButton
};