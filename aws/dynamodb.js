/**
 REFERENCES:
 * Amazon Web Services. "Amazon DynamoDB Examples". Amazon DynamoDB Examples - AWS SDK for JavaScript.
 * Date Accessed (October 16, 2024). [Online].
 * Available: https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/dynamodb-examples.html
 */

/**
 * dynamodb.js
 *
 * @fileOverview Configures and manages interactions with the DynamoDB database.
 * Includes functions for user authentication and registration.
 */

const {DynamoDBClient} = require('@aws-sdk/client-dynamodb');
const {DynamoDBDocumentClient, GetCommand, PutCommand} = require('@aws-sdk/lib-dynamodb');
require('dotenv').config();

/**
 * Creates a DynamoDB client using environment variables for region and credentials.
 */
const client = new DynamoDBClient({
    region: String(process.env.AWS_REGION), credentials: {
        accessKeyId: String(process.env.AWS_ACCESS_KEY_ID), secretAccessKey: String(process.env.AWS_SECRET_ACCESS_KEY),
    },
});

/**
 * Creates a DynamoDB Document Client for interaction with DynamoDB.
 */
const dynamoDB = DynamoDBDocumentClient.from(client);

/**
 * Validates user credentials by checking the username and password in the DynamoDB table.
 *
 * @async
 * @function checkCredentials
 * @param {string} username - The username to validate.
 * @param {string} password - The password to validate.
 * @returns {Promise<boolean>} Resolves to `true` if the credentials match; otherwise, `false`.
 * @throws {Error} Throws an error if the credentials cannot be validated due to a database issue.
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
 * Registers a new user in the DynamoDB table `spacedash-user`.
 *
 * @async
 * @function registerUser
 * @param {string} username - The desired username for the new user.
 * @param {string} password - The password for the new user.
 * @param {string} characterColour - The character colour selected by the user.
 * @returns {Promise<object>} Resolves to an object containing `success` (boolean) and `message` (string).
 * @throws {Error} Throws an error if registration fails due to a database issue or existing username.
 */
const registerUser = async (username, password, characterColour) => {
    const command = {
        TableName: 'spacedash-user', Item: {
            username: username, password: password, character: characterColour,
        }, ConditionExpression: 'attribute_not_exists(username)', // Ensure username is unique
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

// Export the functions for use in other parts of the application
module.exports = {checkCredentials, registerUser};