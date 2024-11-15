const gameDiv = document.getElementById('game-div');
const gameOverDiv = createGameOverDiv();
const continueButton = generateContinueButton();

function createGameOverUI() {
    let existingGameOverDiv = document.getElementById('gameover-div');
    if (!existingGameOverDiv) {
        // Create only if it doesn't exist
        gameOverDiv.innerHTML = ''; // Clear content if needed
        gameDiv.appendChild(gameOverDiv); // Append it to gameDiv
    }
}

function createGameOverDiv() {
    let gameOverDiv = document.getElementById('gameover-div');
    if (!gameOverDiv) {
        gameOverDiv = document.createElement('div');
        gameOverDiv.id = 'gameover-div';
    }
    return gameOverDiv;
}

function displayGameStats(gameWon, coinsCollected, enemiesDefeated) {
    // Clear existing content
    gameOverDiv.innerHTML = '';

    // Add new content
    const gameOverHeading = document.createElement('h3');
    gameOverHeading.id = 'gameover-heading';
    gameOverHeading.innerText = gameWon ? 'Game Over. You Won!' : 'Game Over. You Lost!';
    gameOverHeading.style.color = gameWon ? '#b2ffde' : '#f65279';

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


function generateContinueButton() {
    const continueButton = document.createElement('button');
    continueButton.id = 'continue-button';
    continueButton.innerText = 'continue';
    return continueButton;
}

export {gameOverDiv, createGameOverUI, displayGameStats, continueButton};