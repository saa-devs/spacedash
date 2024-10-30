const {getCharacterURLs} = require("./request");
const {loadGame} = require("../src/game");
const gameDiv = document.getElementById('game-div');
const profileUI = createProfile();
const playButton = generatePlayButton();
const statsButton = generateStatsButton();
const leaderboardButton = generateLeaderboardButton();
const logoutButton = generateLogoutButton();

/**
 * Initialises and displays the profile UI with character selection and action buttons.
 * @async
 * @function loadProfile
 */
async function loadProfile() {
    gameDiv.appendChild(profileUI);
    generateSelectCharacterHTML(profileUI);
    generateButtons(playButton, statsButton, leaderboardButton, logoutButton);

    await storeCharacterURLs();
    insertCharacterLabels();
}

/**
 * Creates the main profile UI container element.
 * @function createProfile
 * @returns {HTMLElement} The profile UI container.
 */
function createProfile() {
    const profileUI = document.createElement('div');
    profileUI.id = 'profile-ui';
    return profileUI;
}

/**
 * Generates the HTML structure for character selection in the profile UI.
 * @function generateSelectCharacterHTML
 * @param {HTMLElement} profileUI - The profile UI container to append character selection HTML.
 */
function generateSelectCharacterHTML(profileUI) {
    profileUI.innerHTML = `
    <div id="select-character-div">
        <h2 id="character-heading">Hello test123, select your character</h2>
        <div id="sprite-select"></div>
    </div>
    `;
}

/**
 * Generates the play button for the profile UI and attaches a click event to start the game.
 * @function generatePlayButton
 * @returns {HTMLElement} The play button element.
 */
function generatePlayButton() {
    const playButton = document.createElement('button');
    playButton.id = 'play-button';
    playButton.innerText = 'play';
    playButton.addEventListener('click', () => {
        profileUI.style.display = 'none';
        loadGame();
    })
    return playButton;
}

/**
 * Generates the stats button for viewing game stats.
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
 * @function generateLogoutButton
 * @returns {HTMLElement} The logout button element.
 */
function generateLogoutButton() {
    const logoutButton = document.createElement('button');
    logoutButton.id = 'logout-button';
    logoutButton.innerText = 'logout';
    return logoutButton;
}

/**
 * Appends action buttons (play, stats, leaderboard, logout) to the profile UI's action menu.
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
 * Fetches and caches character URLs from local storage or S3 if not already stored.
 * @async
 * @function storeCharacterURLs
 * @returns {Object} Character URLs either from cache or freshly fetched.
 */
async function storeCharacterURLs() {
    let characterURLs = JSON.parse(localStorage.getItem('characterURLs'));
    if (!characterURLs) {
        characterURLs = await getCharacterURLs();
        localStorage.setItem('characterURLs', JSON.stringify(characterURLs));
    }
    return characterURLs;
}

/**
 * Inserts character labels with images into the profile UI using URLs stored in local storage.
 * @function insertCharacterLabels
 */
function insertCharacterLabels() {
    const characterURLs = JSON.parse(localStorage.getItem('characterURLs'));
    const spriteSelect = document.getElementById('sprite-select');
    spriteSelect.innerHTML = Object.entries(characterURLs).map(([colour, url]) => `
    <div>
        <input type="radio" name="character" value="${colour}" class="character-radio" id="${colour}-radio" />
        <label class="character-label" for="${colour}-radio">
        <img id="${colour}-character" 
             class="character-image" 
             alt="${colour.charAt(0).toUpperCase() + colour.slice(1)} Character" 
             src="${url}" />
        </label>
    </div>
    `).join('');

    const radioButtons = document.querySelectorAll("input[name='character']");
    radioButtons.forEach(radio => {
        radio.addEventListener('click', () => {
            console.log(radio.value);
        });
    });
}

module.exports = {loadProfile};