import {loadGame} from './game.js';

const gameUI = document.getElementById('game-ui');
const loginButton = document.getElementById('login-button');
const devLogin = document.getElementById('dev-login');

/* Once clicked, hide the login button and load the game */
devLogin.addEventListener('click', () => {
    gameUI.style.display = 'none';
    loadGame();
});