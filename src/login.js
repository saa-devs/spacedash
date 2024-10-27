import {loadGame} from './game.js';

const gameUI = document.getElementById('game-ui');
const loginForm = document.getElementById('login-form');
const devLogin = document.getElementById('dev-login');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent form from refreshing the page

    /* Get username and password from form */
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    /* Attempt to log the user in */
    await loginUser(username, password);
});

async function loginUser(username, password) {
    try {
        /* Send POST request with username and password and wait for response from server */
        const response = await fetch('/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password})
        });
        const data = await response.json();

        /* If login successful, load the game */
        if (response.ok) {
            gameUI.style.display = 'none';
            loadGame();
            console.log(data.message); // "Login successful"
        } else {
            console.log(data.message); // "Invalid credentials"
        }
    } catch (error) {
        console.log('Error:', error);
    }
}

/* Once clicked, hide the login button and load the game */
devLogin.addEventListener('click', () => {
    gameUI.style.display = 'none';
    loadGame();
});