/**
 * gameOverController.js
 *
 * @fileOverview Handles the game-over logic and user interface setup, including
 * updating player statistics, displaying game-over stats, and navigating back
 * to the profile UI. Integrates with the gameOverView and profileModel for rendering
 * the UI and updating player data.
 */

import {gameOverDiv, createGameOverUI, displayGameStats, continueButton} from "../view/gameOverView";
import {updatePlayerStats} from "../model/profileModel";
import {player} from './profileController';

const profileUI = document.getElementById('profile-ui');

/**
 * Creates and displays the game-over UI, shows the game statistics, and updates
 * player stats if the game is won.
 *
 * @async
 * @function createGameOver
 * @param {boolean} gameWon - Whether the player won the game.
 * @param {number} coinsCollected - Number of coins collected during the game.
 * @param {number} enemiesDefeated - Number of enemies defeated during the game.
 * @param {number} level - The level completed by the player.
 * @param {string} timeTaken - Time taken to complete the level.
 * @returns {Promise<void>} No return value.
 */
async function createGameOver(gameWon, coinsCollected, enemiesDefeated, level, timeTaken) {
    createGameOverUI();
    displayGameStats(gameWon, coinsCollected, enemiesDefeated, timeTaken);
    continueButtonSetup(continueButton);
    gameOverDiv.style.display = 'flex';

    if (gameWon) {
        await updateGameStats(player, coinsCollected, enemiesDefeated, level, Number(timeTaken));
    }
}

/**
 * Sets up the continue button with an event listener to handle navigation back
 * to the profile UI after the game-over screen.
 *
 * @function continueButtonSetup
 * @param {HTMLElement} continueButton - The continue button element.
 * @returns {void}
 */
function continueButtonSetup(continueButton) {
    const existingButton = document.getElementById('continue-button');

    if (existingButton) {
        existingButton.removeEventListener('click', onContinueClick);
    }

    continueButton.addEventListener('click', onContinueClick);
}

/**
 * Handles the continue button click event by hiding the game-over UI and
 * displaying the profile UI.
 *
 * @function onContinueClick
 * @returns {void}
 */
function onContinueClick() {
    gameOverDiv.style.display = 'none';
    profileUI.style.display = 'flex';
}

/**
 * Updates the player's game statistics in memory and syncs them with DynamoDB.
 *
 * @async
 * @function updateGameStats
 * @param {Object} player - The player object containing game stats.
 * @param {number} coinsCollected - Number of coins collected during the game.
 * @param {number} enemiesDefeated - Number of enemies defeated during the game.
 * @param {number} level - The level completed by the player.
 * @param {number} timeTaken - Time taken to complete the level.
 * @returns {Promise<void>} No return value.
 */
async function updateGameStats(player, coinsCollected, enemiesDefeated, level, timeTaken) {
    player.setCoinsCollected(player.getCoinsCollected() + coinsCollected);
    player.setEnemies(player.getEnemiesDefeated() + enemiesDefeated);
    player.appendLevels(level);
    player.appendFastestTimes(level.toString(), timeTaken);

    await updatePlayerStats(
        player.getUsername(),
        player.getCoinsCollected(),
        player.enemiesDefeated,
        player.getLevelsCompleted(),
        player.getFastestTimes()
    );
    console.log(player.getPlayerInfo());
}

export {createGameOver};