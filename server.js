const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to handle login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log(`Received login request: username=${username}, password=${password}`);

    // Load users from users.json
    fs.readFile(path.join(__dirname, 'public', 'users.json'), (err, data) => {
        if (err) {
            console.error('Error reading users.json:', err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        const users = JSON.parse(data);
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            res.status(200).json({ success: true, message: 'Login successful' });
        } else {
            res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
    });
});

// Endpoint to handle signup
app.post('/signup', (req, res) => {
    const { username, email, password, phone, address } = req.body;
    console.log(`Received signup request: username=${username}, email=${email}`);

    // Load users from users.json
    fs.readFile(path.join(__dirname, 'public', 'users.json'), (err, data) => {
        if (err && err.code !== 'ENOENT') {
            console.error('Error reading users.json:', err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        const users = data ? JSON.parse(data) : [];

        // Check if username already exists
        if (users.find(u => u.username === username)) {
            return res.status(400).json({ success: false, message: 'Username already exists' });
        }

        // Add new user
        users.push({ username, email, password, phone, address });

        // Save users to users.json
        fs.writeFile(path.join(__dirname, 'public', 'users.json'), JSON.stringify(users, null, 2), (err) => {
            if (err) {
                console.error('Error writing users.json:', err);
                return res.status(500).json({ success: false, message: 'Internal server error' });
            }

            res.status(200).json({ success: true, message: 'Sign up successful' });
        });
    });
});

// Endpoint to handle questionnaire submission
app.post('/submit-questionnaire', (req, res) => {
    const questionnaireData = req.body;
    console.log('Received questionnaire data:', questionnaireData);

    // Save questionnaire data to a file (for example, questionnaire.json)
    fs.readFile(path.join(__dirname, 'public', 'questionnaire.json'), (err, data) => {
        if (err && err.code !== 'ENOENT') {
            console.error('Error reading questionnaire.json:', err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        const questionnaires = data ? JSON.parse(data) : [];
        questionnaires.push(questionnaireData);

        fs.writeFile(path.join(__dirname, 'public', 'questionnaire.json'), JSON.stringify(questionnaires, null, 2), (err) => {
            if (err) {
                console.error('Error writing questionnaire.json:', err);
                return res.status(500).json({ success: false, message: 'Internal server error' });
            }

            res.status(200).json({ success: true, message: 'Questionnaire submitted successfully' });
        });
    });
});

// Add a route for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});