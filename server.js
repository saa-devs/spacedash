const {checkCredentials} = require('./aws/dynamodb');

const express = require('express'); // Import web server
const path = require('path');
const bodyParser = require('body-parser'); // To read incoming requests in JSON format
const cors = require('cors');

const app = express(); // Create express app
const PORT = process.env.PORT || 1235; // Listen for requests on port 1234
app.use(cors());

app.use(express.static(path.join(__dirname, 'dist')));
app.use(bodyParser.json());

app.post('/', async (req, res) => {
    /* Retrieve username and password from POST request */
    const {username, password} = req.body;

    /* Check credentials are valid from DynamoDB */
    const isValid = await checkCredentials(username, password);

    if (isValid) {
        return res.status(200).json({message: 'Login successful'});
    } else {
        return res.status(401).json({message: 'Invalid credentials'});
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});