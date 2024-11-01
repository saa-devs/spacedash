/**
 * authView.js
 *
 * This file handles the creation of the user interface elements related to log in and register,
 * including the registration form and the login link.
 */

const registerForm = createRegisterForm();
const loginLink = createLoginLink();

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
            <input id="create-password" type="password" name="password" placeholder="Create a password" required>
        </label>
        <label for="confirm-password">
            <input id="confirm-password" type="password" name="password" placeholder="Confirm your password" required>
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

module.exports = {registerForm, loginLink};