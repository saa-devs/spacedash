/**
 * chooseLevelController.js
 *
 * @fileOverview Handles the logic for the level selection screen, allowing players
 * to choose a game level or navigate back to the profile UI. Integrates with the
 * game instance and manages UI setup for level buttons.
 */

import {
    chooseLevelUI,
    generateLevelButtons,
    levelOneButton,
    levelTwoButton,
    backButton,
} from '../view/chooseLevelView';
import {profileUI} from "../view/profileView";
import {loadGame, destroyGame} from '../../src/game';
import {player} from './profileController';

const gameDiv = document.getElementById('game-div');

/**
 * Creates and displays the level selection UI, setting up level buttons and back navigation.
 *
 * @function createChooseLevel
 * @returns {void}
 */
function createChooseLevel() {
    gameDiv.appendChild(chooseLevelUI);
    chooseLevelUI.style.display = 'flex';

    generateLevelButtons(levelOneButton, levelTwoButton, backButton);
    backButtonSetup(backButton);
    levelOneButtonSetup(levelOneButton, player);
    levelTwoButtonSetup(levelTwoButton, player);
}

/**
 * Sets up the back button with an event listener for navigating back to the profile UI.
 *
 * @function backButtonSetup
 * @param {HTMLElement} backButton - The back button element.
 * @returns {void}
 */
function backButtonSetup(backButton) {
    backButton.removeEventListener('click', onBackButtonClick); // Ensure no duplicate listener
    backButton.addEventListener('click', onBackButtonClick);
}

/**
 * Handles the back button click event, cleaning up the game instance and returning
 * to the profile UI.
 *
 * @function onBackButtonClick
 * @returns {void}
 */
function onBackButtonClick() {
    destroyGame(); // Call destroyGame to clean up the game instance
    chooseLevelUI.style.display = 'none';
    profileUI.style.display = 'flex';
}

/**
 * Sets up the Level 1 button to load the game when clicked.
 *
 * @function levelOneButtonSetup
 * @param {HTMLElement} levelOneButton - The Level 1 button element.
 * @param {Object} player - The player object containing game progress.
 * @returns {void}
 */
function levelOneButtonSetup(levelOneButton, player) {
    levelOneButton.addEventListener('click', () => {
        const level = 1;
        chooseLevelUI.style.display = 'none';
        loadGame(level, player);
    });
}

/**
 * Sets up the Level 2 button. Enables it Level 1 is completed, otherwise disables
 * it and shows a tooltip explaining the requirement.
 *
 * @function levelTwoButtonSetup
 * @param {HTMLElement} levelTwoButton - The Level 2 button element.
 * @param {Object} player - The player object containing game progress.
 * @returns {void}
 */
function levelTwoButtonSetup(levelTwoButton, player) {
    if (!player.getLevelsCompleted().includes(1)) {
        levelTwoButton.disabled = true;
        levelTwoButton.style.backgroundColor = '#cdcfd1'; // Grey out the button
        levelTwoButton.style.cursor = 'not-allowed'; // Change cursor style
        levelTwoButton.title = "Complete Level 1 to unlock this level."; // Add tooltip
    } else {
        levelTwoButton.disabled = false;
        levelTwoButton.style.backgroundColor = ''; // Reset to default style
        levelTwoButton.style.cursor = 'pointer'; // Reset cursor style
        levelTwoButton.title = ""; // Remove tooltip

        levelTwoButton.addEventListener('click', () => {
            const level = 2;
            chooseLevelUI.style.display = 'none';
            loadGame(level, player);
        });
    }
}

export {createChooseLevel};