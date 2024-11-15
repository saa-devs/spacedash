/**
 * profileController.js
 *
 * This file handles the initialisation and setup of the profile ScoreBoard, including character
 * selection and action buttons for playing the game, viewing stats/leaderboard, and logging out.
 */

import {getUserInfo, getCharacterURLs, updateCharacter, updatePlayerStats, getPlayerStats} from '../model/profileModel';
import {Player} from '../model/Player';
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

const player = new Player();

/**
 * Initialises and displays the profile ScoreBoard, including character selection and action buttons.
 *
 * @async
 * @function loadProfile
 * @returns {Promise<void>} No return value.
 */
async function loadProfile(username, newUser) {
    // Show the loading animation
    const loadingIndicator = document.getElementById('loading-indicator');
    loadingIndicator.style.display = 'block';

    try {
        if (newUser) {
            await updatePlayerStats(username,
                0,
                0,
                [],
                {"1": [], "2": []});
        }
        // Run the async calls and wait for their completion
        const userInfo = await getUserInfo(username);
        const characterURLs = await storeCharacterURLs();
        const playerStats = await getPlayerStats(username);

        if (userInfo) {
            player.setUsername(userInfo.username);
            player.setCharacter(userInfo.character);
        } else {
            console.log("User info could not be retrieved.");
        }

        if (playerStats && playerStats.data) {
            player.setAllStats(playerStats.data);
            console.log(player.getPlayerInfo());
        } else {
            console.log("Player stats could not be retrieved.");
        }

        generateSelectCharacterHTML(profileUI, player.username);
        if (characterURLs) {
            await insertCharacterLabels(characterURLs);
            selectCharacterSetup();
        }
        generateButtons(playButton, statsButton, leaderboardButton, logoutButton);
        playButtonSetup(playButton);
    } catch (error) {
        console.error('Error loading profile:', error);
    } finally {
        loadingIndicator.style.display = 'none';
    }
}


/**
 * Fetches and caches character URLs from local storage or from S3 if not already cached.
 *
 * @async
 * @function storeCharacterURLs
 * @returns {Promise<Object|null>} The character URLs from cache or fresh fetch, or `null` if unavailable.
 */
async function storeCharacterURLs() {
    let characterURLs;
    try {
        characterURLs = await getCharacterURLs();
    } catch (error) {
        console.error('Error retrieving characterURLs:', error);
        characterURLs = null;
    }
    return characterURLs;
}

/**
 * Inserts character selection options with images into the profile ScoreBoard, using URLs from local storage.
 * Adds event listeners to each character selection option.
 *
 * @function insertCharacterLabels
 * @returns {void}
 */
function insertCharacterLabels(characterURLs) {
    // Generate the character selection HTML
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

function selectCharacterSetup() {
    const username = player.username;
    const character = player.character;

    // Select all radio buttons and check the one that matches userCharacter
    const radioButtons = document.querySelectorAll("input[name='character']");
    let isCharacterSet = false;

    radioButtons.forEach(radio => {
        if (radio.value === character) {
            radio.checked = true;
            isCharacterSet = true;
        }
    });

    // If no matching character is set, check the first radio button by default
    if (radioButtons.length > 0 && !isCharacterSet) {
        radioButtons[0].checked = true;
    }

    // Add click event to each radio button to update session storage on selection
    radioButtons.forEach(radio => {
        radio.addEventListener('change', async () => {
            await updateCharacter(username, radio.value);
            player.setCharacter(radio.value);
            console.log(player.getPlayerInfo());
        });
    });
}

/**
 * Sets up the play button with an event listener that hides the profile ScoreBoard and starts the game.
 *
 * @function playButtonSetup
 * @returns {void}
 */
function playButtonSetup(playButton) {
    playButton.removeEventListener('click', onPlayButtonClick); // Remove any existing listener
    playButton.addEventListener('click', onPlayButtonClick); // Add the new listener
}

// Define the click event handler separately
function onPlayButtonClick() {
    profileUI.style.display = 'none';
    createChooseLevel();
}

export {loadProfile, player};