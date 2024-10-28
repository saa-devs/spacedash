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
 * POST /login
 *
 * Handles login requests by validating login credentials against the DynamoDB database.
 * Responds with a success message if credentials are valid, or an error message otherwise.
 *
 * @param {Object} req - The request object containing the login credentials.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.username - The username to be checked.
 * @param {string} req.body.password - The password to be checked.
 * @param {Object} res - The response object.
 * @returns {void}
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
 * POST /register
 *
 * Handles registration requests by creating a new user account with new
 * username and password in the DynamoDB database.
 *
 * @param {Object} req - The request object containing the registration details.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.createUsername - The desired username for the new account.
 * @param {string} req.body.createPassword - The password for the new account.
 * @param {Object} res - The response object.
 * @returns {void}
 */
app.post('/register', async (req, res) => {
    /* Retrieve registration details from POST request */
    const {createUsername, createPassword} = req.body;
    await registerUser(createUsername, createPassword);
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