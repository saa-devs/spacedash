async function getCharacterURLs() {
    const apiUrl = 'https://vl34kgdy52.execute-api.us-east-1.amazonaws.com/dev/getCharacterURLS3';

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            console.error(`Error: ${response.status} - ${response.statusText}`);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching all characters:', error);
        return null;
    }
}

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
        return undefined; // Return undefined or throw error if needed
    }
}

async function updateCharacter(username, colour) {

    const apiUrl = `https://rctm78l2ab.execute-api.us-east-1.amazonaws.com/dev/updateCharacterDDB?username=${username}&colour=${colour}`;
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',  // Changed to GET
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            console.log('An error has occurred')
        }
        const data = await response.json();
        console.log('Update successful:', data);
        return data;

    } catch (error) {
        console.error('Failed to update colour:', error);
        throw error;
    }
}


module.exports = {getUserInfo, getCharacterURLs, updateCharacter};