const express = require('express');
const fs = require('fs');
const cors = require('cors'); // Import the cors package
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const users = require('./users.json');
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors()); // Use the cors middleware

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Ensure users.json exists
if (!fs.existsSync('users.json')) {
    fs.writeFileSync('users.json', JSON.stringify({}));
}

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (users[email] && users[email] === password) {
        // Successful login
        res.json({ success: true });
    } else {
        // Failed login
        res.json({ success: false });
    }
});

app.post('/signup', (req, res) => {
    const { email, password } = req.body;
    if (!users[email]) {
        // Create new user
        users[email] = password;
        res.json({ success: true });
    } else {
        // User already exists
        res.json({ success: false });
    }
});

// Endpoint to save user data
app.post('/save-users', (req, res) => {
    const users = req.body;

    // Save the JSON object to a file
    fs.writeFile('users.json', JSON.stringify(users, null, 2), (err) => {
        if (err) {
            return res.status(500).send('Error saving data');
        }
        res.send('Data saved successfully');
    });
});

// Endpoint to load user data
app.get('/load-users', (req, res) => {
    fs.readFile('users.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error loading data');
        }
        res.json(JSON.parse(data));
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (users[email] && users[email] === password) {
        // Successful login
        res.json({ success: true });
    } else {
        // Failed login
        res.json({ success: false });
    }
});

app.post('/signup', (req, res) => {
    const { email, password } = req.body;
    if (!users[email]) {
        // Create new user
        users[email] = password;
        res.json({ success: true });
    } else {
        // User already exists
        res.json({ success: false });
    }
});


//START OF IPM SERVER
// Endpoint to serve the JSON data
app.get('/menuData', (req, res) => {
    const user = req.query.accountName;
    res.sendFile(path.join(__dirname, `${user}.json`));
});

// app.get('/user', (req, res) => {
//     res.sendFile(path.join(__dirname, 'user.json'));
// });

// Endpoint to save the JSON data
app.post('/saveMenuData', (req, res) => {
    const { accountName, selectedMenu, currentMenuSet } = req.body;

    // Determine the path to the user's JSON file
    const userFilePath = path.join(__dirname, `${accountName}.json`);

    // Read the current user's JSON file
    fs.readFile(userFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading user JSON file:', err);
            return res.status(500).send('Error reading user data');
        }

        let userJson;
        try {
            userJson = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return res.status(500).send('Error parsing user data');
        }

        // Update the selected menu's options with the new data
        if (userJson[selectedMenu] && userJson[selectedMenu].options) {
            userJson[selectedMenu].options = currentMenuSet.options;
        } else {
            return res.status(400).send('Selected menu not found');
        }

        // Write the updated JSON back to the user's file
        fs.writeFile(userFilePath, JSON.stringify(userJson, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('Error writing to user JSON file:', writeErr);
                return res.status(500).send('Error saving user data');
            }
            res.send('Data saved successfully');
        });
    });
});

app.post('/updateMenu', (req, res) => {
    const userMenus = req.body;
    const username = req.query.username;

    console.log(userMenus);

    // Write the updated menu data to user.json
    fs.writeFile(path.join(__dirname, `${username}.json`), JSON.stringify(userMenus, null, 2), (err) => {
        if (err) {
            console.error('Error writing to user.json:', err);
            return res.status(500).send('Failed to update menu data.');
        }
        res.status(200).send('Menu data updated successfully.');
    });
});

//END OF IPM SERVER

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'newpage.html'));
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
