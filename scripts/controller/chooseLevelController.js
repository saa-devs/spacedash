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

function createChooseLevel() {
    gameDiv.appendChild(chooseLevelUI);
    chooseLevelUI.style.display = 'flex';

    generateLevelButtons(levelOneButton, levelTwoButton, backButton);
    backButtonSetup(backButton);
    levelOneButtonSetup(levelOneButton, player);
    levelTwoButtonSetup(levelTwoButton, player);
}

function backButtonSetup(backButton) {
    backButton.removeEventListener('click', onBackButtonClick); // Ensure no duplicate listener
    backButton.addEventListener('click', onBackButtonClick);
}

function onBackButtonClick() {
    destroyGame(); // Call destroyGame to clean up the game instance
    chooseLevelUI.style.display = 'none';
    profileUI.style.display = 'flex';
}

function levelOneButtonSetup(levelOneButton, player) {
    levelOneButton.addEventListener('click', () => {
        const level = 1;
        chooseLevelUI.style.display = 'none';
        loadGame(level, player);
    });
}

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


export { createChooseLevel };