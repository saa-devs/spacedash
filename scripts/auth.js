/**
 * auth.js
 *
 * This file sends POST requests to the server related to user authentication
 * and waits for a response from the server.
 */

/**
 * Send POST request with login credentials and wait for response from server.
 *
 * @param {string} username - The username provided by the user.
 * @param {string} password - The password provided by the user.
 * @returns {Promise<boolean>} - Resolves to `true` if the credentials are valid; otherwise `false`.
 * @throws {Error} - Logs an error if the request fails.
 */
async function checkCredentials(username, password) {
    try {
        const response = await fetch(`/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password})
        });
        return response.ok;
    } catch (error) {
        console.log('Error:', error);
    }
}

/**
 * Send POST request with registration details and wait for response from server.
 *
 * @param {string} createUsername - The desired username for the new account.
 * @param {string} createPassword - The password for the new account.
 * @returns {Promise<void>} - Resolves if the registration is successful.
 * @throws {Error} - Logs an error if the request fails.
 */
async function registerUser(createUsername, createPassword) {
    try {
        const response = await fetch(`/register`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({createUsername, createPassword})
        });
        const data = await response.json();
    } catch (error) {
        console.log('Error:', error);
    }
}

module.exports = {checkCredentials, registerUser};