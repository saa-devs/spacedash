/**
 * profileController.js
 *
 * @fileOverview Handles the initialisation and setup of the player profile, including character
 * selection and action buttons for playing the game, viewing stats/leaderboard, and logging out.
 */

import {
    getUserInfo,
    getCharacterURLs,
    updateCharacter,
    updatePlayerStats,
    getPlayerStats,
    getPlayerSpriteSheet
} from '../model/profileModel';
import {
    profileUI,
    generateSelectCharacterHTML,
    generateButtons,
    playButton,
    statsButton,
    leaderboardButton,
    logoutButton
} from '../view/profileView';
import {createChooseLevel} from './chooseLevelController';
import {createStatsView} from './statsController';
import {createLeaderboard} from './leaderBoardController';
import {Player} from '../model/Player';

// To store the currently logged in player
const player = new Player('', '', '', 0, 0);

/**
 * Initialises and displays the profile scoreboard, including character selection and action buttons.
 *
 * @async
 * @function loadProfile
 * @param {string} username - The username of the current player.
 * @param {boolean} newUser - Indicates whether the user is new (true) or existing (false).
 * @returns {Promise<void>} No return value.
 */
async function loadProfile(username, newUser) {
    const loadingIndicator = document.getElementById('loading-indicator');
    loadingIndicator.style.display = 'block';

    try {
        if (newUser) { // Initialises player stats for a new user
            await updatePlayerStats(
                username, 0,
                0,
                [],
                {"1": [], "2": []});
        }
        const userInfo = await getUserInfo(username);
        const characterURLs = await storeCharacterURLs();
        const playerStats = await getPlayerStats(username);

        if (userInfo) {
            player.setUsername(userInfo.username);
            player.setCharacter(userInfo.character);
        } else {
            console.error("User info could not be retrieved.");
        }

        if (playerStats?.data) {
            player.setAllStats(playerStats.data);
        } else {
            console.error("Player stats could not be retrieved.");
        }
        generateSelectCharacterHTML(profileUI, player.username);

        if (characterURLs) {
            await insertCharacterLabels(characterURLs);
            selectCharacterSetup();
        }

        generateButtons(playButton, statsButton, leaderboardButton, logoutButton);
        setupButtons(playButton, statsButton, leaderboardButton, logoutButton);
    } catch (error) {
        console.error('Error loading profile:', error);
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

/**
 * Fetches and caches character URLs from S3 or local storage.
 *
 * @async
 * @function storeCharacterURLs
 * @returns {Promise<Object|null>} The character URLs object or `null` if retrieval fails.
 */
async function storeCharacterURLs() {
    try {
        return await getCharacterURLs();
    } catch (error) {
        console.error('Error retrieving character URLs:', error);
        return null;
    }
}

/**
 * Inserts character selection options into the profile scoreboard, using cached URLs.
 *
 * @function insertCharacterLabels
 * @param {Object} characterURLs - The URLs of character images.
 * @returns {void}
 */
function insertCharacterLabels(characterURLs) {
    const spriteSelect = document.getElementById('sprite-select');
    spriteSelect.innerHTML = Object.entries(characterURLs).map(([colour, url]) => `
        <label class="character-label">
            <input type="radio" name="character" value="${colour}" class="character-radio" id="${colour}-radio" />
            <img id="${colour}-character" 
                 class="character-image" 
                 alt="${colour.charAt(0).toUpperCase() + colour.slice(1)} Character" 
                 src="${url}" />
        </label>
    `).join('');
}

/**
 * Sets up character selection options and updates the character when selected.
 *
 * @function selectCharacterSetup
 * @returns {void}
 */
function selectCharacterSetup() {
    const username = player.username;
    const character = player.character;
    const radioButtons = document.querySelectorAll("input[name='character']");
    let isCharacterSet = false;

    radioButtons.forEach(radio => {
        if (radio.value === character) {
            radio.checked = true;
            isCharacterSet = true;
        }
    });

    if (radioButtons.length > 0 && !isCharacterSet) {
        radioButtons[0].checked = true;
    }

    radioButtons.forEach(radio => {
        radio.addEventListener('change', async () => {
            const loadingIndicator = document.getElementById('loading-indicator');
            profileUI.style.display = 'none';
            loadingIndicator.style.display = 'block';
            try {
                await updateCharacter(username, radio.value);
                const spriteSheet = await getPlayerSpriteSheet(radio.value);
                player.setCharacter(radio.value);
                player.setSpritesheet(spriteSheet);
            } catch (error) {
                console.error('Error loading profile:', error);
            } finally {
                profileUI.style.display = 'flex';
                loadingIndicator.style.display = 'none';
            }
        });
    });
}

/**
 * Sets up action buttons (play, stats, leaderboard, logout) with their respective event listeners.
 *
 * @function setupButtons
 * @param {HTMLElement} playButton - The play button element.
 * @param {HTMLElement} statsButton - The stats button element.
 * @param {HTMLElement} leaderboardButton - The leaderboard button element.
 * @param {HTMLElement} logoutButton - The logout button element.
 * @returns {void}
 */
function setupButtons(playButton, statsButton, leaderboardButton, logoutButton) {
    playButtonSetup(playButton);
    statsButtonSetup(statsButton);
    leaderboardButtonSetup(leaderboardButton);
    logoutButtonSetup(logoutButton);
}

/**
 * Configures the play button to start the game when clicked.
 *
 * @function playButtonSetup
 * @param {HTMLElement} playButton - The play button element.
 * @returns {void}
 */
function playButtonSetup(playButton) {
    playButton.removeEventListener('click', onPlayButtonClick);
    playButton.addEventListener('click', onPlayButtonClick);
}

/**
 * Event handler for the play button. Hides the profile UI and loads the level selection screen.
 *
 * @function onPlayButtonClick
 * @returns {void}
 */
function onPlayButtonClick() {
    profileUI.style.display = 'none';
    createChooseLevel();
}

/**
 * Configures the stats button to display player statistics when clicked.
 *
 * @function statsButtonSetup
 * @param {HTMLElement} statsButton - The stats button element.
 * @returns {void}
 */
function statsButtonSetup(statsButton) {
    statsButton.removeEventListener('click', onStatsButtonClick);
    statsButton.addEventListener('click', onStatsButtonClick);
}

/**
 * Event handler for the stats button. Hides the profile UI and displays the stats view.
 *
 * @function onStatsButtonClick
 * @returns {void}
 */
function onStatsButtonClick() {
    profileUI.style.display = 'none';
    createStatsView(player);
}

/**
 * Configures the leaderboard button to display the leaderboard when clicked.
 *
 * @function leaderboardButtonSetup
 * @param {HTMLElement} leaderboardButton - The leaderboard button element.
 * @returns {void}
 */
function leaderboardButtonSetup(leaderboardButton) {
    leaderboardButton.removeEventListener('click', leaderboardButtonClick);
    leaderboardButton.addEventListener('click', leaderboardButtonClick);
}

/**
 * Event handler for the leaderboard button. Hides the profile UI and displays the leaderboard.
 *
 * @async
 * @function leaderboardButtonClick
 * @returns {Promise<void>} No return value.
 */
async function leaderboardButtonClick() {
    profileUI.style.display = 'none';
    await createLeaderboard();
}

/**
 * Configures the logout button to clear session storage and redirect to the homepage when clicked.
 *
 * @function logoutButtonSetup
 * @param {HTMLElement} logoutButton - The logout button element.
 * @returns {void}
 */
function logoutButtonSetup(logoutButton) {
    logoutButton.removeEventListener('click', onLogoutButtonClick);
    logoutButton.addEventListener('click', onLogoutButtonClick);
}

/**
 * Event handler for the logout button. Clears session storage and redirects to the homepage.
 *
 * @function onLogoutButtonClick
 * @returns {void}
 */
function onLogoutButtonClick() {
    sessionStorage.clear();
    window.location.href = '/';
}

export {loadProfile, player};