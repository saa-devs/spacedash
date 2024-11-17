/**
 * leaderboardModel.js
 *
 * @fileOverview Fetches leaderboard statistics from the AWS API Gateway triggered by AWS Lambda function.
 *
 * @async
 * @function getLeaderboardStats
 * @returns {Promise<Object|undefined>} A promise resolving to the leaderboard statistics as an object, or `undefined` if an error occurs.
 */
async function getLeaderboardStats() {
    // Construct the API URL with query parameters
    const apiUrl = `https://hkn1o1jgyl.execute-api.us-east-1.amazonaws.com/dev/getLeaderboardStatsDDB`;
    try {
        // Make the GET request
        const response = await fetch(apiUrl);
        if (!response.ok) {
            console.log(`Error: ${response.statusText}`);
        }
        // Parse and return the JSON response
        return await response.json();
    } catch (error) {
        console.error('Error fetching leaderboard stats:', error);
        return undefined; // Return undefined or handle the error as needed
    }
}

export {getLeaderboardStats};