import {
    chooseLevelUI,
    generateLevelButtons,
    levelOneButton,
    levelTwoButton,
    backButton,
} from '../view/chooseLevelView';
import {profileUI} from "../view/profileView";
import {loadGame, destroyGame} from '../../src/game';

const gameDiv = document.getElementById('game-div');

function createChooseLevel() {
    gameDiv.appendChild(chooseLevelUI);
    chooseLevelUI.style.display = 'flex';

    generateLevelButtons(levelOneButton, levelTwoButton, backButton);
    backButtonSetup(backButton);
    levelOneButtonSetup(levelOneButton);
    levelTwoButtonSetup(levelTwoButton);
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

function levelOneButtonSetup(levelOneButton) {
    levelOneButton.addEventListener('click', () => {
        const level = 1;
        chooseLevelUI.style.display = 'none';
        loadGame(level);
    });
}

function levelTwoButtonSetup(levelTwoButton) {
    levelTwoButton.addEventListener('click', () => {
        const level = 2;
        chooseLevelUI.style.display = 'none';
        loadGame(level);
    });
}

export { createChooseLevel };