/**
 * server.js
 *
 * This file sets up an Express server to handle requests made to AWS services.
 */

const {checkCredentials, registerUser} = require('../aws/dynamodb');

const express = require('express'); // Import web server
const path = require('path');
const bodyParser = require('body-parser'); // To read incoming requests in JSON format
const cors = require('cors');

const app = express(); // Create express app
const PORT = process.env.PORT || 5100; // Listen for requests on port 1234
app.use(cors());

app.use(express.static(path.join(__dirname, '../dist')));
app.use(bodyParser.json());

/**
 * Handles user login requests.
 *
 * This endpoint is used to verify user credentials (username and password).
 * It checks the credentials against DynamoDB and responds with a success or error message.
 *
 * @route POST /login
 * @async
 * @param {Object} req - The request object containing login credentials.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.username - The username to be authenticated.
 * @param {string} req.body.password - The password to be authenticated.
 * @param {Object} res - The response object used to send back the result.
 * @returns {void} Sends a JSON response indicating the success or failure of the login process.
 *
 * @throws {Error} Will send a 401 status code if the credentials are invalid.
 */
app.post('/login', async (req, res) => {
    /* Retrieve login credentials from POST request */
    const {username, password} = req.body;

    /* Check credentials are valid from DynamoDB */
    const isValid = await checkCredentials(username, password);

    if (isValid) {
        console.log("Login successful")
        return res.status(200).json({message: 'Login successful'});
    } else {
        console.log("Login credentials invalid")
        return res.status(401).json({message: 'Invalid credentials'});
    }
});

/**
 * Handles user registration requests.
 *
 * Creates a new user account with a given username and password.
 * It attempts to register the user, and responds with appropriate success or error messages.
 *
 * @route POST /register
 * @async
 * @param {Object} req - The request object containing registration details.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.createUsername - The desired username for the new account.
 * @param {string} req.body.createPassword - The password for the new account.
 * @param {Object} res - The response object used to send back the result.
 * @returns {void} Sends a JSON response indicating the success or failure of the registration process.
 *
 * @throws {Error} Will send a 500 status code if an unexpected error occurs during registration.
 */
app.post('/register', async (req, res) => {
    /* Retrieve registration details from POST request */
    const {createUsername, createPassword, characterColour} = req.body;
    const response = await registerUser(createUsername, createPassword, characterColour);

    if (response.success) {
        return res.status(200).json({message: response.message});
    } else {
        if (response.message === 'This username already exists') {
            return res.status(409).json({message: response.message});
        } else {
            return res.status(500).json({message: response.message});
        }
    }
});

/**
 * GET *
 *
 * Serves the main HTML file for the application. This catch-all route is used to
 * handle all client-side routes by serving the index.html file from the /dist directory.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

/**
 * Start the server on the specified PORT.
 */
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});