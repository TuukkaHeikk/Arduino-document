// Sivujen testaaminen toimii kun ajaa node.js script.js ja selaimeen kirjoittaa:
// http://localhost:3000/admin tai http://localhost:3000/user

const express = require('express');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
const { fetchData } = require('./arduino.js');
const Database = require('better-sqlite3');

// Database:

const db = new Database('database.db');

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    settings TEXT
    )
`)

// Miltä käyttäjät näyttävät:
const user = {
    name: "Pasi",
    settings: {
        showTemp: {
            id: 0,
            value: true,
            displayName: "Temperature",
            symbol: "℃"
        },
        showHumidity: {
            id: 1,
            value: false,
            displayName: "Humidity",
            symbol: "%"
        }
    }
};


// Lisää Pasi databaseen:
// const settingsStr = JSON.stringify(user.settings);
// const stmt = db.prepare(`INSERT INTO users (name, settings) VALUES (?, ?)`);
// const info = stmt.run(user.name, JSON.stringify(user.settings));


const app = express();
app.use(cors());    // ilman tätä CORS ei anna minkään toimia
const port = 3000;

app.use(session({
    secret: "tosi_salainen_avain_jota_kukaan_ei_voi_tietaa7049823832",   // change this to something else
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 }
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend'))) // ?

// Näiden avulla ei tarvitse erikseen kirjoittaa index.html URL'n loppuun
app.use('/admin', express.static(path.join(__dirname, "../frontend/admin")));
app.use('/users', express.static(path.join(__dirname, "../frontend/user")));


// Käyttäjä:

// Lähetä tietylle käyttäjälle tämän asetukset
app.get('/users/:id', async (req, res) => {
    const id = req.params.id;

    // Etsitään käyttäjä IDn avulla
    const stmt = db.prepare(`SELECT * FROM users WHERE id = ?`);
    const row = stmt.get(id);

    if (!row) {
        return res.status(500).json({ error: 'User could not be found.' });
    }

    const settings = JSON.parse(row.settings);
    console.log('settings: ', settings);

    const keysArray = Object.entries(settings)
        .filter(([key, item]) => item.value) // keep only true values
        .map(([key, item]) => ({
            key,
            displayName: item.displayName,
            symbol: item.symbol
        }));          // extract the key

    console.log('KEYSARRAY:::: ', keysArray);
    const results = await fetchData(keysArray);

    return res.status(200).json(results);
    //console.log('keysArray:', keysArray);
});

// Admin:

app.get('/admin-login', async (req, res) => {
    req.session.isAdmin = true;
    res.redirect('/admin');
})

// Lähetä kaikki käyttäjät
app.get('/api/admin', (req, res) => {
    // Estä fetchaamista URL'n kautta ellei ole käyttäjä
    if (!req.session.isAdmin) {
        return res.status(401).json({ error: "Unauthorized" });
    }

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
app.post('/api/admin/setting', (req, res) => {
    const { userId } = req.body;  // Kenen käyttäjän asetuksia muutetaan
    const { settingId } = req.body;   // asetus jota vaihdetaan
    const { value } = req.body; // true tai false

    console.log('VALUE: ', value);
    const stmt = db.prepare(`SELECT * FROM users WHERE id = ?`);
    const row = stmt.get(userId);

    if (row) {
        const user = {
            id: row.id,
            name: row.name,
            settings: JSON.parse(row.settings) // parse the nested settings
        };

        console.log(user.name);
        console.log(user.settings);

        try {
            for (const key in user.settings) {
                if (user.settings[key].id === settingId) {
                    try {
                        user.settings[key].value = value;

                        const stmt = db.prepare(`UPDATE users SET settings = ? WHERE id = ?`)
                        const result = stmt.run(JSON.stringify(user.settings), user.id);

                        if (result.changes === 0) {
                            return res.status(400).json({ error: 'No rows updated' });
                        }

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

app.listen(port, () => console.log('serveri pyörii portilla:', port));
