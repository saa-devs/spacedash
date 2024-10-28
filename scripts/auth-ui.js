/**
 * auth-ui.js
 *
 * Handles UI interactions for toggling between login and register forms. Handles form submission for
 * login and register by validating inputs before sending them to auth-ui.js for server communication.
 */

import {loadGame} from '/src/game.js';
import {validUsername, validPassword, matchingPassword} from '/scripts/validation'
import {checkCredentials, registerUser} from '/scripts/auth'

const gameUI = document.getElementById('game-ui');
const authDiv = document.getElementById('auth-div');
const loginForm = document.getElementById('login-form');
let errorMsg = document.getElementById('error-msg');
const accountMsg = document.getElementById('account-msg');
const registerLink = document.getElementById('register-link');

const registerForm = createRegisterForm();
const loginLink = createLoginLink();

/**
 * Handles login form submission and attempts to authenticate the user.
 * If valid login credentials, hides the 'auth-ui' element and loads the game.
 */
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent form from refreshing the page

    /* Get username and password from form */
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    /* Attempt to log the user in */
    const isValid = await checkCredentials(username, password);

    if (isValid) {
        gameUI.style.display = 'none';
        loadGame();
    }
});

/**
 * auth-ui.js
 *
 * Handles registration form submission and attempts to register a new user.
 * Validates the provided username, password, and password confirmation before
 * sending the registration request to the server.
 */
registerForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent form from refreshing the page

    /* Get username and password from form */
    const createUsername = document.getElementById('create-username').value;
    const createPassword = document.getElementById('create-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (validRegisterDetails(createUsername, createPassword, confirmPassword)) {
        await registerUser(createUsername, createPassword);
    }
});

/**
 * Displays the registration form when the user clicks the "Click here to register" link.
 * Updates UI elements to show the registration form and hides the login form.
 */
registerLink.addEventListener('click', () => {
    errorMsg.innerText = '';
    loginForm.style.display = 'none'; // Remove login form
    registerLink.style.display = 'none'; // Remove 'Click here to register' link
    loginLink.style.display = 'inline-block'; //Display 'Click here to login' link

    accountMsg.innerText = 'Already have an account? ';
    accountMsg.appendChild(loginLink);

    registerForm.style.display = 'flex'; // Display register form
    authDiv.appendChild(registerForm);
});

/**
 * Displays the login form when the user clicks the "Click here to login" link.
 * Updates UI elements to show the login form and hides the registration form.
 */
loginLink.addEventListener('click', () => {
    errorMsg.innerText = '';
    registerForm.style.display = 'none'; // Remove register form
    loginLink.style.display = 'none'; // Remove 'Click here to login' link

    accountMsg.innerText = "Don't have an account? ";
    accountMsg.appendChild(registerLink);

    registerLink.style.display = 'inline-block'; // Display 'Click here to register' link
    loginForm.style.display = 'flex'; // Display login form
    authDiv.appendChild(loginForm);
});

/**
 * Creates and returns the registration form element, including fields for username,
 * password, and password confirmation, as well as a submit button.
 *
 * @returns {HTMLFormElement} The registration form element.
 */
function createRegisterForm() {
    const registerForm = document.createElement('form');
    registerForm.setAttribute('method', 'post');
    registerForm.setAttribute('action', '/register');
    registerForm.id = 'register-form';

    registerForm.innerHTML = `
        <label for="create-username">
            <input id="create-username" type="text" name="create-username" placeholder="Create a username" required>
        </label>
        <label for="create-password">
            <input id="create-password" type="text" name="password" placeholder="Create a password" required>
        </label>
        <label for="confirm-password">
            <input id="confirm-password" type="text" name="password" placeholder="Confirm your password" required>
        </label>
        <button type="submit" id="register-button">register</button>
    `;
    return registerForm;
}

/**
 * Creates and returns the login link element, which allows users to switch from
 * the registration form to the login form.
 *
 * @returns {HTMLSpanElement} The login link element.
 */
function createLoginLink() {
    const loginLink = document.createElement('span');
    loginLink.id = 'login-link';
    loginLink.innerText = 'Click here to login';
    return loginLink;
}

/**
 * Validates registration details, checking that the username follows a valid format,
 * the password is strong enough, and the password and confirmation match.
 *
 * @param {string} createUsername - The username for the new account.
 * @param {string} createPassword - The password for the new account.
 * @param {string} confirmPassword - The confirmation password.
 * @returns {boolean} `true` if all details are valid, `false` otherwise.
 */
function validRegisterDetails(createUsername, createPassword, confirmPassword) {
    let isValid = true;
    if (!validUsername(createUsername)) {
        errorMsg.innerText = 'The username must be between 3 - 10 characters, and can only contain numbers and letters';
        isValid = false;
    } else if (!validPassword(createPassword)) {
        errorMsg.innerText = 'The password must have at least 6 characters, and contain at least 1 number';
        isValid = false;
    } else if (!matchingPassword(createPassword, confirmPassword)) {
        errorMsg.innerText = "The passwords don't match";
        isValid = false;
    }
    return isValid;
}