// @ts-nocheck

const {DynamoDBClient} = require('@aws-sdk/client-dynamodb');
const {DynamoDBDocumentClient, GetCommand} = require('@aws-sdk/lib-dynamodb');
require('dotenv').config();

/* Create DynamoDB client */
const client = new DynamoDBClient({
    region: String(process.env.AWS_REGION), credentials: {
        accessKeyId: String(process.env.AWS_ACCESS_KEY_ID), secretAccessKey: String(process.env.AWS_SECRET_ACCESS_KEY),
    },
});

/* Create document client for easier operations */
const dynamoDB = DynamoDBDocumentClient.from(client);

/**
 * Check if the provided username and password are correct.
 * @param {string} username - The username to check.
 * @param {string} password - The password to check.
 * @returns {Promise<boolean>} - Returns true if the credentials are correct, false otherwise.
 */
const checkCredentials = async (username, password) => {
    const command = {
        TableName: 'spacedash-user', Key: {
            username: username,
        },
    };

    try {
        const result = await dynamoDB.send(new GetCommand(command));
        if (result.Item && result.Item.password) {
            return result.Item.password === password;
        }
        console.log("No item or password found.");
        return false;
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw new Error("Could not check credentials");
    }
};

module.exports = {checkCredentials}; // Export the function