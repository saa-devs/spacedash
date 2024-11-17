/**
 * chooseLevelView.js
 *
 * @fileOverview Handles the creation and layout of the level selection view UI.
 * This includes generating the UI container, level buttons (Level 1 and Level 2),
 * and a back button for navigation.
 */

const chooseLevelUI = createChooseLevelDiv();
const levelOneButton = generateLevelOneButton();
const levelTwoButton = generateLevelTwoButton();
const backButton = generateBackButton();

/**
 * Creates the main container for the level selection UI.
 *
 * @function createChooseLevelDiv
 * @returns {HTMLElement} The level selection UI container element.
 */
function createChooseLevelDiv() {
    const chooseLevelUI = document.createElement('div');
    chooseLevelUI.id = 'chooselevel-ui';
    return chooseLevelUI;
}

/**
 * Generates and appends the level selection buttons and back button to the level menu.
 *
 * @function generateLevelButtons
 * @param {HTMLElement} levelOneButton - The Level 1 button element.
 * @param {HTMLElement} levelTwoButton - The Level 2 button element.
 * @param {HTMLElement} backButton - The back button element.
 * @returns {void}
 */
function generateLevelButtons(levelOneButton, levelTwoButton, backButton) {
    const levelMenu = document.createElement('div');
    chooseLevelUI.appendChild(levelMenu);
    levelMenu.id = 'level-menu';
    levelMenu.appendChild(levelOneButton);
    levelMenu.appendChild(levelTwoButton);
    levelMenu.appendChild(backButton);
}

/**
 * Generates the Level 1 button for the level selection UI.
 *
 * @function generateLevelOneButton
 * @returns {HTMLElement} The Level 1 button element.
 */
function generateLevelOneButton() {
    const levelOneButton = document.createElement('button');
    levelOneButton.id = 'levelone-button';
    levelOneButton.innerText = 'level one';
    return levelOneButton;
}

/**
 * Generates the Level 2 button for the level selection UI.
 *
 * @function generateLevelTwoButton
 * @returns {HTMLElement} The Level 2 button element.
 */
function generateLevelTwoButton() {
    const levelTwoButton = document.createElement('button');
    levelTwoButton.id = 'leveltwo-button';
    levelTwoButton.innerText = 'level two';
    return levelTwoButton;
}

/**
 * Generates the back button for navigating back to the profile UI.
 *
 * @function generateBackButton
 * @returns {HTMLElement} The back button element.
 */
function generateBackButton() {
    const backButton = document.createElement('button');
    backButton.id = 'back-button';
    backButton.innerText = 'back';
    return backButton;
}

export {chooseLevelUI, generateLevelButtons, levelOneButton, levelTwoButton, backButton};