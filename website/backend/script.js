const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { getArduinoData } = require('./arduino');
const Database = require('better-sqlite3');

// Database
const db = new Database('database.db');

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    settings TEXT
    )
`)

const user = {
    name: "Pasi",
    settings: {
        showTemp: {
            id: 0,
            value: true
        },
        showHumidity: {
            id: 1,
            value: false
        }
    }
};


//const settingsStr = JSON.stringify(user.settings);


//const stmt = db.prepare(`INSERT INTO users (name, settings) VALUES (?, ?)`);

// Run the statement
//const info = stmt.run(user.name, JSON.stringify(user.settings));


const app = express();
app.use(cors());    // ilman tätä CORS ei anna minkään toimia
const port = 5500;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend'))) // ?

// Käyttäjä:

// Hae asiat (lämpötila, ilmankosteus) mitä tietty käyttäjä voi nähdä
app.get('/users/:uid', async (req, res) => {
    const uid = req.params.uid;
    const users = JSON.parse(fs.readFileSync('users.json'));

    if (!users[uid]) {
        return res.status(404).json({ error: "User not found" });
    }

    const userSettings = users[uid].settings;
    const arduinoData = await getArduinoData();

    const filteredData = {};
    if (userSettings.showTemp) filteredData.temperature = arduinoData.temperature;
    if (userSettings.showHumidity) filteredData.humidity = arduinoData.humidity;

    return res.json(filteredData);
});

// Admin: 

// Lähetä kaikki käyttäjät
app.get('/api/admin', (req, res) => {
    const rows = db.prepare(`SELECT * FROM users`).all();

    const users = rows.map(row => ({
        id: row.id,
        name: row.name,
        settings: JSON.parse(row.settings)
    }));

    console.log('users', users);
    return res.json(users);
});

// Muuta käyttäjien asetuksia
app.post('/api/admin/:uid', (req, res) => {
    const { userId } = req.body;  // Kenen käyttäjän asetuksia muutetaan
    const { settingId } = req.body;   // asetus jota vaihdetaan
    const { value } = req.body; // true tai false

    console.log('VALUE: ', value);
    const stmt = db.prepare(`SELECT * FROM users WHERE id = ?`);
    const row = stmt.get(userId);   // find user with id = 1

    if (row) {
        const user = {
            id: row.id,
            name: row.name,
            settings: JSON.parse(row.settings) // parse the nested settings
        };

        console.log(user.name);                   // "Pasi"
        console.log(user.settings);
        //user.settings.

        try {
            for (const key in user.settings) {
                console.log('key avain', key);
                if (user.settings[key].id === settingId) {
                    try {
                    user.settings[key].value = value;

                    db.prepare(`UPDATE users SET settings = ? WHERE id = ?`)
                        .run(JSON.stringify(user.settings), user.id);

                    return res.status(200).json({ message: 'Value changed' });
                    } catch (error) {
                        console.log('error: ', error);
                        return res.status(500).json({ error: "Something went wrong" });
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
        return res.status(500).json({ error: "User or setting couldn't be found" })
    }
});

app.listen(port, () => console.log('serveri pyörii portilla: ', port));
