/**
 * leaderboardController.js
 *
 * @fileOverview Handles the logic and user interface setup for displaying the leaderboard.
 * This includes fetching leaderboard data, creating leaderboard views, and managing
 * navigation back to the profile UI.
 */

import {
    leaderboardUI,
    leaderboardHeading,
    createCoinsCollectedLeaderboard,
    createEnemiesDefeatedLeaderboard,
    createFastestTimesLeaderboard,
    backButton
} from '../view/leaderboardView.js';
import {getLeaderboardStats} from "../model/leaderboardModel";
import {statsUI} from "../view/statsView";
import {profileUI} from "../view/profileView";

const gameDiv = document.getElementById('game-div');

/**
 * Creates and displays the leaderboard UI, fetching data for coins collected,
 * enemies defeated, and fastest times, and appending it to the game container.
 *
 * @async
 * @function createLeaderboard
 * @returns {Promise<void>} No return value.
 */
async function createLeaderboard() {
    leaderboardUI.innerHTML = '';
    leaderboardUI.style.display = 'flex';

    leaderboardUI.appendChild(leaderboardHeading);

    // Ensure `leaderboardUI` is visible and added to `gameDiv`
    if (!gameDiv.contains(leaderboardUI)) {
        gameDiv.appendChild(leaderboardUI);
    }

    const leaderboardStats = await getLeaderboardStats();

    // Populate leaderboards with stats
    createCoinsCollectedLeaderboard(leaderboardStats);
    createEnemiesDefeatedLeaderboard(leaderboardStats);
    createFastestTimesLeaderboard(leaderboardStats);

    leaderboardUI.appendChild(backButton);
    backButtonSetup(backButton);
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
 * Handles the back button click event by hiding the leaderboard UI
 * and displaying the profile UI.
 *
 * @function onBackButtonClick
 * @returns {void}
 */
function onBackButtonClick() {
    leaderboardUI.style.display = 'none';
    profileUI.style.display = 'flex';
}

export {createLeaderboard};