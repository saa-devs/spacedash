/**
 * authView.js
 *
 * Handles the creation of user interface elements related to log in and registration.
 * Includes the registration form and the login link to switch between forms.
 */

// Create the registration form and login link elements
const registerForm = createRegisterForm();
const loginLink = createLoginLink();

/**
 * Creates the registration form element with fields for username, password, and password confirmation.
 * Also includes a submit button for registration.
 *
 * @function createRegisterForm
 * @returns {HTMLFormElement} The registration form element.
 */
function createRegisterForm() {
    const registerForm = document.createElement('form');
    registerForm.setAttribute('method', 'post'); // Set form method to POST
    registerForm.setAttribute('action', '/register'); // Set form action to /register endpoint
    registerForm.id = 'register-form'; // Assign a unique ID to the form

    // Populate the form with input fields and a submit button
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
    return registerForm; // Return the complete registration form element
}

/**
 * Creates the login link element, allowing users to switch back to the login form
 * from the registration form.
 *
 * @function createLoginLink
 * @returns {HTMLSpanElement} The login link element.
 */
function createLoginLink() {
    const loginLink = document.createElement('span');
    loginLink.id = 'login-link'; // Assign a unique ID to the login link
    loginLink.innerText = 'Click here to login'; // Set the link text
    return loginLink; // Return the complete login link element
}

// Export the UI elements for use in other modules
export { registerForm, loginLink };