/**
 * Retrieves player stats from AWS DynamoDB via API Gateway that triggers an AWS Lambda function.
 *
 * @async
 * @function getPlayerStats
 * @param {string} username - The username of the player.
 * @returns {Promise<Object|undefined>} The player stats object or `undefined` if the request fails.
 */
async function getPlayerStats(username) {
    const apiUrl = `https://sed83q2b55.execute-api.us-east-1.amazonaws.com/dev/getPlayerStatsDDB?username=${username}`;

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            console.log(`Error: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to retrieve player stats:", error);
    }
}

export {getPlayerStats};