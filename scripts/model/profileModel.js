/**
 * profileModel.js
 *
 * This file provides functions to interact with the Amazon S3 and retrieve data needed for the profile
 * view of the game.
 */

/**
 * Retrieves character URLs from the server.
 *
 * This function sends a GET request to the specified endpoint to fetch character URLs.
 * If the request is successful, the URLs are returned in JSON format.
 * If the request fails, an error is logged to the console.
 *
 * @async
 * @function getCharacterURLs
 * @returns {Promise<Object|undefined>} A promise that resolves to an object containing character URLs, or `undefined` if an error occurs.
 */
async function getCharacterURLs() {
    try {
        const response = await fetch('http://localhost:5100/characters');
        return await response.json();
    } catch (error) {
        console.error('Error fetching all characters:', error);
    }
}

module.exports = {getCharacterURLs};