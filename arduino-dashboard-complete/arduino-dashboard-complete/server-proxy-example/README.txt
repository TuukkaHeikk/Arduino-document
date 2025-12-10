Example Node/Express proxy (do NOT run in frontend).
This proxy holds your Arduino API token and forwards requests to Arduino Cloud.

1) Create a file .env with:
   ARDUINO_API_TOKEN=eyJ...yourtoken...
   PORT=3000

2) Install:
   npm init -y
   npm install express axios dotenv

3) Example code (index.js):
   const express = require('express');
   const axios = require('axios');
   const app = express();
   require('dotenv').config();
   app.get('/api/arduino/thing-data', async (req, res) => {
     try {
       // call Arduino Cloud API here using process.env.ARDUINO_API_TOKEN
       // return JSON: { sensors: [...], history: {...} }
       res.json({ message: 'Implement your Arduino Cloud calls here' })
     } catch(e){
       res.status(500).json({error: e.toString()})
     }
   });
   app.listen(process.env.PORT || 3000);
