import {gameOverDiv, createGameOverUI, displayGameStats, continueButton} from "../view/gameOverView";
import {updatePlayerStats} from "../model/profileModel";
import {player} from './profileController';

const profileUI = document.getElementById('profile-ui');

async function createGameOver(gameWon, coinsCollected, enemiesDefeated, level, timeTaken) {
    createGameOverUI();
    displayGameStats(gameWon, coinsCollected, enemiesDefeated);
    continueButtonSetup(continueButton);
    gameOverDiv.style.display = 'flex';

    if (gameWon) {
        await updateGameStats(player, coinsCollected, enemiesDefeated, level, timeTaken);
    }
}

function continueButtonSetup(continueButton) {
    const existingButton = document.getElementById('continue-button');

    if (existingButton) {
        existingButton.removeEventListener('click', onContinueClick);
    }

    continueButton.addEventListener('click', onContinueClick);
}

function onContinueClick() {
    gameOverDiv.style.display = 'none';
    profileUI.style.display = 'flex';
}

async function updateGameStats(player, coinsCollected, enemiesDefeated, level, timeTaken) {
    player.setCoinsCollected(player.getCoinsCollected() + coinsCollected);
    player.setEnemies(player.getEnemiesDefeated() + enemiesDefeated);
    player.appendLevels(level);
    player.appendFastestTimes(level, timeTaken);

    await updatePlayerStats(player.getUsername(),
        player.getCoinsCollected(),
        player.enemiesDefeated,
        player.getLevelsCompleted(),
        player.getFastestTimes());
    console.log(player.getPlayerInfo());
}
export {createGameOver};