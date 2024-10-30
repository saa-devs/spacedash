/**
 * dynamodb.js
 *
 * This file configures and manages interactions with the DynamoDB database.
 */

const {DynamoDBClient} = require('@aws-sdk/client-dynamodb');
const {DynamoDBDocumentClient, GetCommand, PutCommand} = require('@aws-sdk/lib-dynamodb');
require('dotenv').config();

/*
 * Create DynamoDB client with credentials and region from environment variables.
 */
const client = new DynamoDBClient({
    region: String(process.env.AWS_REGION),
    credentials: {
        accessKeyId: String(process.env.AWS_ACCESS_KEY_ID),
        secretAccessKey: String(process.env.AWS_SECRET_ACCESS_KEY),
    },
});

/*
 * Create document client for data handling with DynamoDB.
 */
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
        return false;
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw new Error("Could not check credentials");
    }
};

/**
 * Register a new user in the spacedash-user table.
 * @param {string} username - The username to register.
 * @param {string} password - The password to store.
 * @returns {Promise<object>} - Returns an object with success status and message.
 */
const registerUser = async (username, password) => {
    const command = {
        TableName: 'spacedash-user',
        Item: {
            username: username,
            password: password,
        },
        ConditionExpression: 'attribute_not_exists(username)',
    };

    try {
        await dynamoDB.send(new PutCommand(command));
        console.log("User registered successfully");
        return {success: true, message: 'User registered successfully'};
    } catch (error) {
        if (error.name === 'ConditionalCheckFailedException') {
            console.error("Username already exists");
            return {success: false, message: 'This username already exists'};
        }
        console.error("Error registering user:", error);
        return {success: false, message: 'Error registering user'};
    }
};

module.exports = {checkCredentials, registerUser};