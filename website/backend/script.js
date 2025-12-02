const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { getArduinoData } = require('./arduino');

// TODO: selvitä miksi cors blokkaa jatkuvasti
const app = express();
app.use(cors());    // ilman tätä CORS ei anna minkään toimia
const port = 3000;

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

    res.json(filteredData);
});

// Admin: 

// Lähetä kaikki käyttäjät
app.get('/api/admin', (req, res) => {
    const users = JSON.parse(fs.readFileSync('users.json'));
    res.json(users);
});

app.listen(port, () => console.log('serveri pyörii.'));