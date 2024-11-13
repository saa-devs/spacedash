const chooseLevelUI = createChooseLevelDiv();
const levelOneButton = generateLevelOneButton();
const levelTwoButton = generateLevelTwoButton();
const backButton = generateBackButton();

function createChooseLevelDiv() {
    const chooseLevelUI = document.createElement('div');
    chooseLevelUI.id = 'chooselevel-ui';
    return chooseLevelUI;
}

function generateLevelButtons(levelOneButton, levelTwoButton, backButton) {
    const levelMenu = document.createElement('div');
    chooseLevelUI.appendChild(levelMenu);
    levelMenu.id = 'level-menu';
    levelMenu.appendChild(levelOneButton);
    levelMenu.appendChild(levelTwoButton);
    levelMenu.appendChild(backButton);
}

function generateLevelOneButton() {
    const levelOneButton = document.createElement('button');
    levelOneButton.id = 'levelone-button';
    levelOneButton.innerText = 'level one';
    return levelOneButton;
}

function generateLevelTwoButton() {
    const levelTwoButton = document.createElement('button');
    levelTwoButton.id = 'leveltwo-button';
    levelTwoButton.innerText = 'level two';
    return levelTwoButton;
}

function generateBackButton() {
    const backButton = document.createElement('button');
    backButton.id = 'back-button';
    backButton.innerText = 'back';
    return backButton;
}

export { chooseLevelUI, generateLevelButtons, levelOneButton, levelTwoButton, backButton };