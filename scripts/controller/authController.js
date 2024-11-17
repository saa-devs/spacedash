/**
 * authController.js
 *
 * @fileOverview Handles interactions for login and registration.
 * Dynamically switches between login and registration forms based on user input.
 * Also manages the user authentication process and error handling.
 */

import {registerForm, loginLink} from '../view/authView';
import {validUsername, validPassword, matchingPassword} from '../validation';
import {checkCredentials, registerUser} from '/scripts/model/userModel';
import {loadProfile} from './profileController';

const gameJolt = new GameJolt({
    game_id: 939743,
    private_key: 'e71e108439ebf30fbc415a74abd8c376'
});

console.log(typeof gameJolt);
// DOM elements for managing authentication UI
const authUI = document.getElementById('auth-ui');
const loginForm = document.getElementById('login-form');
let errorMsg = document.getElementById('error-msg');
const accountMsg = document.getElementById('account-msg');
const registerLink = document.getElementById('register-link');
const profileUI = document.getElementById('profile-ui');

// Hide profile UI by default until the user logs in
profileUI.style.display = 'none';

/**
 * Handles login form submission and authenticates the user.
 * If successful, hides the login form and loads the user profile.
 *
 * @event submit
 * @param {Event} event - The form submission event.
 * @returns {void}
 */
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent page refresh

    // Retrieve username and password from input fields
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Send login request and handle response
    const response = await checkCredentials(username, password);
    const data = await response.json();

    if (response.ok) {
        const newUser = false;
        authUI.style.display = 'none';
        profileUI.style.display = 'flex';
        await loadProfile(username, newUser);
    } else if (response.status === 401) {
        errorMsg.innerText = data.message; // Display error message for invalid credentials
    }
});

/**
 * Handles registration form submission, validates inputs,
 * and attempts to register the user. If successful, loads the profile.
 *
 * @event submit
 * @param {Event} event - The form submission event.
 * @returns {void}
 */
registerForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent page refresh

    // Retrieve registration inputs
    const createUsername = document.getElementById('create-username').value;
    const createPassword = document.getElementById('create-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const characterColour = 'blue';

    if (validRegisterDetails(createUsername, createPassword, confirmPassword)) {
        const response = await registerUser(createUsername, createPassword, characterColour);
        const data = await response.json();

        if (response.ok) {
            const newUser = true;
            errorMsg.innerText = '';
            authUI.style.display = 'none';
            profileUI.style.display = 'flex';
            await loadProfile(createUsername, newUser);
        } else if (response.status === 409) {
            errorMsg.innerText = data.message; // Display error for username conflicts
        }
    }
});

/**
 * Switches to the registration form when the user clicks the "Click here to register" link.
 * Updates the UI to display the registration form and hide the login form.
 *
 * @event click
 * @returns {void}
 */
registerLink.addEventListener('click', () => {
    errorMsg.innerText = '';
    loginForm.style.display = 'none'; // Hide login form
    registerLink.style.display = 'none'; // Hide 'register' link
    loginLink.style.display = 'inline-block'; // Show 'login' link

    accountMsg.innerText = 'Already have an account? ';
    accountMsg.appendChild(loginLink);

    registerForm.style.display = 'flex'; // Display registration form
    authUI.insertBefore(registerForm, authUI.children[1]);
});

/**
 * Switches to the login form when the user clicks the "Click here to login" link.
 * Updates the UI to display the login form and hide the registration form.
 *
 * @event click
 * @returns {void}
 */
loginLink.addEventListener('click', () => {
    errorMsg.innerText = '';
    registerForm.style.display = 'none'; // Hide registration form
    loginLink.style.display = 'none'; // Hide 'login' link

    accountMsg.innerText = "Don't have an account? ";
    accountMsg.appendChild(registerLink);

    registerLink.style.display = 'inline-block'; // Show 'register' link
    loginForm.style.display = 'flex'; // Display login form
    authUI.insertBefore(loginForm, authUI.children[1]);
});

/**
 * Validates registration details to ensure they meet the required criteria:
 * - Username must be valid.
 * - Password must meet strength requirements.
 * - Password and confirmation must match.
 *
 * @function validRegisterDetails
 * @param {string} createUsername - The username for the new account.
 * @param {string} createPassword - The password for the new account.
 * @param {string} confirmPassword - The confirmation password.
 * @returns {boolean} `true` if all validation passes, otherwise `false`.
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