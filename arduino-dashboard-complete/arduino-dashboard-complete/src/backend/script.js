import express from "express";
import fetchData from "./arduino.js";
import cors from "cors";

const app = express();
app.use(cors());
const port = 3000;

app.get('/api/arduino/thing-data', async (req, res) => {
    try {
        const data = await fetchData();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch Arduino data" });
    }
})

app.listen(port, () => console.log('Server running on port:', port));
