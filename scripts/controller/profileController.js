/**
 * profileController.js
 *
 * This file handles the initialisation and setup of the profile UI, including character
 * selection and action buttons for playing the game, viewing stats/leaderboard, and logging out.
 */

const {getCharacterURLs} = require("../model/profileModel");
const {loadGame} = require("../../src/game");
const {
    profileUI,
    generateSelectCharacterHTML,
    generateButtons,
    playButton,
    statsButton,
    leaderboardButton,
    logoutButton
} = require('../view/profileView');

const gameDiv = document.getElementById('game-div');

/**
 * Initialises and displays the profile UI, including character selection and action buttons.
 *
 * @async
 * @function loadProfile
 * @returns {Promise<void>} No return value.
 */
async function loadProfile() {
    gameDiv.appendChild(profileUI);
    generateSelectCharacterHTML(profileUI);
    generateButtons(playButton, statsButton, leaderboardButton, logoutButton);
    playButtonSetup();

    await storeCharacterURLs();
    insertCharacterLabels();
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
        characterURLs = JSON.parse(localStorage.getItem('characterURLs'));
    } catch (error) {
        console.error('Character URLs not found in localStorage. Fetching from S3...');
        characterURLs = null; // Fallback to fetching from S3
    }

    if (!characterURLs) {
        characterURLs = await getCharacterURLs();
        if (characterURLs) {
            localStorage.setItem('characterURLs', JSON.stringify(characterURLs));
        } else {
            console.error('Error: characterURLs is undefined after fetching.');
        }
    }
    return characterURLs;
}

/**
 * Inserts character selection options with images into the profile UI, using URLs from local storage.
 * Adds event listeners to each character selection option.
 *
 * @function insertCharacterLabels
 * @returns {void}
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

/**
 * Sets up the play button with an event listener that hides the profile UI and starts the game.
 *
 * @function playButtonSetup
 * @returns {void}
 */
function playButtonSetup() {
    playButton.addEventListener('click', () => {
        profileUI.style.display = 'none';
        loadGame();
    })
}

module.exports = {loadProfile};