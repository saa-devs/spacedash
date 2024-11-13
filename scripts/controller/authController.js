/**
 * authController.js
 *
 * This file handles ScoreBoard interactions for login and register events and switches between the login and registration
 * according to user input.
 */

const {registerForm, loginLink} = require('../view/authView');
const {validUsername, validPassword, matchingPassword} = require('../validation');
const {checkCredentials, registerUser} = require('/scripts/model/userModel');
const {loadProfile} = require('./profileController');

const authUI = document.getElementById('auth-ui');
const loginForm = document.getElementById('login-form');
let errorMsg = document.getElementById('error-msg');
const accountMsg = document.getElementById('account-msg');
const registerLink = document.getElementById('register-link');

const profileUI = document.getElementById('profile-ui');
profileUI.style.display = 'none';


/**
 * Handles login form submission and attempts to authenticate the user.
 * If valid login credentials are provided, hides the 'auth-ui' element and loads the profile.
 *
 * @event submit
 * @param {Event} event - The form submission event.
 * @returns {void}
 */
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent form from refreshing the page

    /* Get username and password from form */
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    /* Attempt to log the user in */
    const response = await checkCredentials(username, password);
    const data = await response.json();

    if (response.ok) {
        authUI.style.display = 'none';
        sessionStorage.setItem('username', username);
        profileUI.style.display = 'flex';
        await loadProfile(username);
    } else if (response.status === 401) {
        errorMsg.innerText = data.message;
    }
});

/**
 * Handles registration form submission by validating input fields before sending the
 * registration request to the server. If registration is successful, it loads the user's profile,
 * otherwise, displays the appropriate error message.
 *
 * @event submit
 * @param {Event} event - The form submission event.
 * @returns {void}
 */
registerForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent form from refreshing the page

    /* Get username and password from form */
    const createUsername = document.getElementById('create-username').value;
    const createPassword = document.getElementById('create-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const characterColour = 'green';

    if (validRegisterDetails(createUsername, createPassword, confirmPassword)) {
        const response = await registerUser(createUsername, createPassword, characterColour);
        const data = await response.json();

        if (response.ok) {
            errorMsg.innerText = '';
            authUI.style.display = 'none';
            await loadProfile(createUsername);
        } else if (response.status === 409) {
            errorMsg.innerText = data.message;
        }
    }
});

/**
 * Displays the registration form when the user clicks the "Click here to register" link.
 * Updates ScoreBoard elements to show the registration form and hides the login form.
 *
 * @event click
 * @returns {void}
 */
registerLink.addEventListener('click', () => {
    errorMsg.innerText = '';
    loginForm.style.display = 'none'; // Remove login form
    registerLink.style.display = 'none'; // Remove 'Click here to register' link
    loginLink.style.display = 'inline-block'; // Display 'Click here to login' link

    accountMsg.innerText = 'Already have an account? ';
    accountMsg.appendChild(loginLink);

    registerForm.style.display = 'flex'; // Display register form
    authUI.insertBefore(registerForm, authUI.children[1]);
});

/**
 * Displays the login form when the user clicks the "Click here to login" link.
 * Updates ScoreBoard elements to show the login form and hides the registration form.
 *
 * @event click
 * @returns {void}
 */
loginLink.addEventListener('click', () => {
    errorMsg.innerText = '';
    registerForm.style.display = 'none'; // Remove register form
    loginLink.style.display = 'none'; // Remove 'Click here to login' link

    accountMsg.innerText = "Don't have an account? ";
    accountMsg.appendChild(registerLink);

    registerLink.style.display = 'inline-block'; // Display 'Click here to register' link
    loginForm.style.display = 'flex'; // Display login form
    authUI.insertBefore(loginForm, authUI.children[1]);
});

/**
 * Validates registration details, ensuring the username is valid, the password is strong enough,
 * and that both password and confirmation match.
 *
 * @function validRegisterDetails
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