/**
 * gameOverView.js
 *
 * @fileOverview This file handles the creation and management of the game-over view UI.
 * It includes functions to create the game-over container, display game stats, and generate
 * a continue button for transitioning back to the profile UI.
 */

const gameDiv = document.getElementById('game-div');
const gameOverDiv = createGameOverDiv();
const continueButton = generateContinueButton();

/**
 * Creates the game-over UI if it doesn't already exist and appends it to the game container.
 *
 * @function createGameOverUI
 * @returns {void}
 */
function createGameOverUI() {
    let existingGameOverDiv = document.getElementById('gameover-div');
    if (!existingGameOverDiv) {
        // Create only if it doesn't exist
        gameOverDiv.innerHTML = ''; // Clear content if needed
        gameDiv.appendChild(gameOverDiv); // Append it to gameDiv
    }
}

/**
 * Creates the game-over container element if it doesn't already exist.
 *
 * @function createGameOverDiv
 * @returns {HTMLElement} The game-over container element.
 */
function createGameOverDiv() {
    let gameOverDiv = document.getElementById('gameover-div');
    if (!gameOverDiv) {
        gameOverDiv = document.createElement('div');
        gameOverDiv.id = 'gameover-div';
    }
    return gameOverDiv;
}

/**
 * Displays game-over stats (coins collected and enemies defeated) in the game-over UI.
 * If the game is lost, a message is shown, and stats are not saved.
 *
 * @function displayGameStats
 * @param {boolean} gameWon - Whether the player won the game.
 * @param {number} coinsCollected - The number of coins collected during the game.
 * @param {number} enemiesDefeated - The number of enemies defeated during the game.
 * @returns {void}
 */
function displayGameStats(gameWon, coinsCollected, enemiesDefeated) {
    // Clear existing content
    gameOverDiv.innerHTML = '';

    // Add new content
    const gameOverHeading = document.createElement('h3');
    gameOverHeading.id = 'gameover-heading';
    gameOverHeading.innerText = gameWon ? 'Game Over. You Won!' : 'Game Over. You Lost!';
    gameOverHeading.style.color = gameWon ? '#87ffcf' : '#f65279';

    const gameOverMsg = document.createElement('p');
    gameOverMsg.id = 'gameover-msg';
    gameOverMsg.innerText = 'Since you lost, these stats will not be collected';

    const gameStats = document.createElement('div');
    gameStats.id = 'game-stats';

    gameStats.innerHTML = `
    <p id="coins-collected">Coins collected: ${coinsCollected}</p>
    <p id="enemies-defeated">Enemies defeated: ${enemiesDefeated}</p>
    `;

    // Append elements to gameOverDiv
    gameOverDiv.appendChild(gameOverHeading);
    if (!gameWon) {
        gameOverDiv.appendChild(gameOverMsg);
    }
    gameOverDiv.appendChild(gameStats);
    gameOverDiv.appendChild(continueButton);
}

/**
 * Generates a continue button for the game-over UI.
 *
 * @function generateContinueButton
 * @returns {HTMLElement} The continue button element.
 */
function generateContinueButton() {
    const continueButton = document.createElement('button');
    continueButton.id = 'continue-button';
    continueButton.innerText = 'continue';
    return continueButton;
}

export {gameOverDiv, createGameOverUI, displayGameStats, continueButton};