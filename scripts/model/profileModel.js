/**
 * profileModel.js
 *
 * @fileOverview Contains functions that communicate with serverless backends (AWS Lambda) via API Gateway endpoints.
 * These functions handle operations such as fetching character URLs, retrieving user information,
 * getting and updating player stats, and updating the selected character for a user.
 * Images and spritesheets are delivered via CloudFront for fast, cached access.
 *
 * @module profileModel
 */

/**
 * Retrieves character URLs from an S3 bucket via an AWS Lambda function triggered by API Gateway.
 *
 * @async
 * @function getCharacterURLs
 * @returns {Promise<Object|null>} The object containing character URLs or `null` if the request fails.
 */
async function getCharacterURLs() {
    const apiUrl = 'https://vl34kgdy52.execute-api.us-east-1.amazonaws.com/dev/getCharacterURLS3';

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            console.error(`Error: ${response.status} - ${response.statusText}`);
            const errorDetails = await response.text();
            console.error(`Error details: ${errorDetails}`);
            return null;
        }

        const data = await response.json();
        console.log('Character URLs fetched successfully:', data);
        return data;
    } catch (error) {
        console.error('Error fetching character URLs:', error);
        return null;
    }
}

/**
 * Retrieves a player's sprite sheet URL from an S3 bucket via an AWS Lambda function triggered by API Gateway.
 *
 * @async
 * @function getPlayerSpriteSheet
 * @param {string} characterColour - The colour of the character to retrieve the sprite sheet for.
 * @returns {Promise<string|null>} The CloudFront URL of the sprite sheet or `null` if the request fails.
 */
async function getPlayerSpriteSheet(characterColour) {
    const apiUrl = `https://38gmo9t9q7.execute-api.us-east-1.amazonaws.com/dev/getPlayerSpritesheetS3?characterColour=${characterColour}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorMessage = await response.json();
            console.error(`Error: ${response.status} - ${response.statusText}`);
            console.error(errorMessage.message);
            return null;
        }

        const data = await response.json();
        console.log(`Spritesheet URL retrieved successfully: ${data.url}`);
        return data.url; // This is the CloudFront URL of the matching spritesheet
    } catch (error) {
        console.error('Failed to retrieve spritesheet URL:', error);
        return null;
    }
}

/**
 * Fetches user information from AWS DynamoDB via API Gateway that triggers an AWS Lambda function.
 *
 * @async
 * @function getUserInfo
 * @param {string} username - The username of the player.
 * @returns {Promise<Object|undefined>} The user information object or `undefined` if the request fails.
 */
async function getUserInfo(username) {
    const apiUrl = `https://yuc1tge4nl.execute-api.us-east-1.amazonaws.com/dev/getUserInfoDDB?username=${username}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            console.log(`Error: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("API call error:", error);
        return undefined;
    }
}

/**
 * Updates the character associated with a user in AWS DynamoDB via API Gateway that triggers an AWS Lambda function.
 *
 * @async
 * @function updateCharacter
 * @param {string} username - The username of the player.
 * @param {string} colour - The colour of the character to update.
 * @returns {Promise<Object>} The response data from the API.
 * @throws Will throw an error if the API call fails.
 */
async function updateCharacter(username, colour) {
    const apiUrl = `https://rctm78l2ab.execute-api.us-east-1.amazonaws.com/dev/updateCharacterDDB?username=${username}&colour=${colour}`;
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            console.log(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Character update successful');
        return data;
    } catch (error) {
        console.error('Failed to update character:', error);
        throw error;
    }
}

/**
 * Updates player stats in AWS DynamoDB via API Gateway that triggers an AWS Lambda function.
 *
 * @async
 * @function updatePlayerStats
 * @param {string} username - The username of the player.
 * @param {number} coinsCollected - The number of coins collected by the player.
 * @param {number} enemiesDefeated - The number of enemies defeated by the player.
 * @param {Array} levelsCompleted - An array of completed levels.
 * @param {Object} fastestTimes - An object containing the fastest times for each level.
 * @returns {Promise<Object>} The response data from the API.
 * @throws Will throw an error if the API call fails.
 */
async function updatePlayerStats(username, coinsCollected, enemiesDefeated, levelsCompleted, fastestTimes) {
    const params = new URLSearchParams({
        username,
        coinsCollected: coinsCollected.toString(),
        enemiesDefeated: enemiesDefeated.toString(),
        levelsCompleted: JSON.stringify(levelsCompleted),
        fastestTimes: JSON.stringify(fastestTimes),
    });
    const apiUrl = `https://sruclfpn37.execute-api.us-east-1.amazonaws.com/dev/updatePlayerStatsDDB?${params.toString()}`;
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            console.log(`Error: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error calling API Gateway:", error);
        throw error;
    }
}

export {
    getCharacterURLs,
    getUserInfo,
    updateCharacter,
    getPlayerSpriteSheet,
    updatePlayerStats,
};