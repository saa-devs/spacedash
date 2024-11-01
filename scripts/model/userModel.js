/**
 * userModel.js
 *
 * This file contains functions that send POST requests to the server for login and register validation
 * and handles the responses.
 */

/**
 * Send POST request with login credentials returns the response from server.
 *
 * @param {string} username - The username provided by the user.
 * @param {string} password - The password provided by the user.
 * @returns {Promise<boolean>} - Resolves to `true` if the credentials are valid; otherwise `false`.
 * @throws {Error} - Logs an error if the request fails.
 */
async function checkCredentials(username, password) {
    try {
        const response = await fetch(`http://localhost:5100/login`, {
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
 * Send POST request with registration details and returns the response from server.
 *
 * @param {string} createUsername - The desired username for the new account.
 * @param {string} createPassword - The password for the new account.
 * @returns {Promise<Response>} - Resolves if the registration is successful.
 * @throws {Error} - Logs an error if the request fails.
 */
async function registerUser(createUsername, createPassword) {
    try {
        return await fetch('http://localhost:5100/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({createUsername, createPassword})
        });
    } catch (error) {
        console.error('Network Error:', error);
    }
}

module.exports = {checkCredentials, registerUser};