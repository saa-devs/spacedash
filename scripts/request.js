/**
 * request.js
 *
 * This file sends POST requests to the server related to user authentication
 * and waits for a response from the server.
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

/**
 * Retrieves character URLs from the server.
 *
 * This function fetches character URLs from the specified endpoint.
 * It returns the URLs in JSON format if the request is successful.
 * Logs an error to the console if the fetch request fails.
 *
 * @async
 * @function getCharacterURLs
 * @returns {Promise<Object|undefined>} A promise that resolves to an object containing character URLs, or undefined if an error occurs.
 */
async function getCharacterURLs() {
    try {
        const response = await fetch('http://localhost:5100/characters');
        return await response.json();
    } catch (error) {
        console.error('Error fetching all characters:', error);
    }
}

module.exports = {checkCredentials, registerUser, getCharacterURLs};