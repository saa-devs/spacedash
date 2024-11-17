/**
 REFERENCES:
 * Express. "Hello world example". Express "Hello World" example.
 * Date Accessed (October 16, 2024). [Online].
 * Available: https://expressjs.com/en/starter/hello-world.html
 */

/**
 * server.js
 *
 * Sets up an Express server to handle POST for login and registration. This file acts as a middleman between the client
 * (i.e. login or register form). It processes HTTP requests and calls dynamodb.js functions to interact with DynamoDB.
 *
 */

const {checkCredentials, registerUser} = require('../aws/dynamodb');
const express = require('express'); // Import web server framework
const path = require('path'); // Module for working with file and directory paths
const bodyParser = require('body-parser'); // Middleware to parse incoming JSON requests
const cors = require('cors'); // Middleware to enable Cross-Origin Resource Sharing (CORS)

const app = express(); // Create an Express application
const PORT = process.env.PORT || 5100; // Use specified port or default to 5100

// Middleware
app.use(cors()); // Enable CORS for all requests
app.use(express.static(path.join(__dirname, '../dist'))); // Serve static files from /dist directory
app.use(bodyParser.json()); // Parse JSON request bodies

/**
 * Handles user login requests by verifying credentials against DynamoDB.
 *
 * @route POST /login
 * @async
 * @param {Object} req - The incoming request object.
 * @param {Object} req.body - The body of the request containing login credentials.
 * @param {string} req.body.username - The username for authentication.
 * @param {string} req.body.password - The password for authentication.
 * @param {Object} res - The response object to send the result back to the client.
 * @returns {void} Responds with a JSON message indicating login success or failure.
 *
 * @throws {Error} Sends a 401 status if the credentials are invalid.
 */
app.post('/login', async (req, res) => {
    const {username, password} = req.body; // Extract login credentials

    try {
        const isValid = await checkCredentials(username, password); // Validate credentials

        if (isValid) {
            console.log("Login successful");
            res.status(200).json({message: 'Login successful'});
        } else {
            console.log("Invalid credentials");
            res.status(401).json({message: 'Invalid credentials'});
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({message: 'Internal server error'});
    }
});

/**
 * Handles user registration requests by creating a new user account in DynamoDB.
 *
 * @route POST /register
 * @async
 * @param {Object} req - The incoming request object.
 * @param {Object} req.body - The body of the request containing registration details.
 * @param {string} req.body.createUsername - The desired username for the new account.
 * @param {string} req.body.createPassword - The password for the new account.
 * @param {string} req.body.characterColour - The character colour associated with the user.
 * @param {Object} res - The response object to send the result back to the client.
 * @returns {void} Responds with a JSON message indicating registration success or failure.
 *
 * @throws {Error} Sends a 409 status if the username already exists or a 500 status for other errors.
 */
app.post('/register', async (req, res) => {
    const {createUsername, createPassword, characterColour} = req.body; // Extract registration details

    try {
        const response = await registerUser(createUsername, createPassword, characterColour); // Register user

        if (response.success) {
            res.status(200).json({message: response.message});
        } else if (response.message === 'This username already exists') {
            res.status(409).json({message: response.message});
        } else {
            res.status(500).json({message: response.message});
        }
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({message: 'Internal server error'});
    }
});

/**
 * Serves the main HTML file for the client-side application.
 * This catch-all route handles all non-API requests and serves `index.html` from the /dist directory.
 *
 * @route GET *
 * @param {Object} req - The incoming request object.
 * @param {Object} res - The response object to send the HTML file back to the client.
 * @returns {void}
 */
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

/**
 * Starts the Express server on the specified port and logs the status.
 */
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});