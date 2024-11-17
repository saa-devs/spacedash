/**
 * userModel.js
 *
 * This file contains functions that send POST requests to the Express server for login and registration validation
 * and handle the server responses.
 */

/**
 * Sends a POST request with login credentials and returns the server's response.
 *
 * @function checkCredentials
 * @param {string} username - The username provided by the user.
 * @param {string} password - The password provided by the user.
 * @returns {Promise<Response>} - Resolves with the server's response if the request succeeds.
 * @throws {Error} - Logs an error if the request fails.
 */
async function checkCredentials(username, password) {
    try {
        return await fetch(`http://localhost:5100/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password})
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

/**
 * Sends a POST request with registration details and returns the server's response.
 *
 * @function registerUser
 * @param {string} createUsername - The desired username for the new account.
 * @param {string} createPassword - The password for the new account.
 * @param {string} characterColour - The chosen character colour for the account.
 * @returns {Promise<Response>} - Resolves with the server's response if the registration is successful.
 * @throws {Error} - Logs an error if the request fails.
 */
async function registerUser(createUsername, createPassword, characterColour) {
    try {
        return await fetch('http://localhost:5100/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({createUsername, createPassword, characterColour})
        });
    } catch (error) {
        console.error('Network Error:', error);
    }
}

// Export the functions for use in other modules
export {checkCredentials, registerUser};