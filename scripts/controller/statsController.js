/**
 * statsController.js
 *
 * @fileOverview Handles the logic and user interface setup for displaying player statistics.
 * It includes functions to create the stats view, display collected stats, and handle navigation
 * back to the profile UI.
 */

import {statsUI, statsHeading, createScoreboard, createTimesTaken, backButton} from '../view/statsView';
import {profileUI} from "../view/profileView";

const gameDiv = document.getElementById('game-div');

/**
 * Creates and displays the stats view UI, showing the player's game statistics,
 * including coins collected, enemies defeated, and fastest times for levels.
 *
 * @function createStatsView
 * @param {Object} player - The player object containing statistics to display.
 * @returns {void}
 */
function createStatsView(player) {
    // Clear existing content in statsUI to prevent duplication
    statsUI.innerHTML = '';
    statsUI.style.display = 'flex';

    // Append fresh content
    statsUI.appendChild(statsHeading);
    createScoreboard(player.getCoinsCollected(), player.getEnemiesDefeated());
    createTimesTaken(player.getFastestTimes());
    statsUI.appendChild(backButton);
    backButtonSetup(backButton);

    // Ensure `statsUI` is visible and added to `gameDiv`
    if (!gameDiv.contains(statsUI)) {
        gameDiv.appendChild(statsUI);
    }
}

/**
 * Sets up the back button with an event listener to handle navigation back
 * to the profile UI.
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
 * Handles the back button click event by hiding the stats UI and displaying the profile UI.
 *
 * @function onBackButtonClick
 * @returns {void}
 */
function onBackButtonClick() {
    statsUI.style.display = 'none';
    profileUI.style.display = 'flex';
}

export {createStatsView};