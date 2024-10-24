import {loadGame} from './game.js';

/* Select the login button element */
const loginButton = document.getElementById('login-button');

/* Once clicked, hide the login button and load the game */
loginButton.addEventListener('click', (e) => {
    loginButton.style.display = 'none';
    loadGame();
});