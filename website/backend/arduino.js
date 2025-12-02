// Ei ole läheskään valmis ja varmaan väärin tehty muutenki

// Kopioitu ChatGPT:
// TODO: API avaimet ja property id arduino cloudista.
async function getArduinoData(propertyId) {
    const token = "YOUR_API_TOKEN";     // API avain / token
    const url = `https://api2.arduino.cc/iot/v2/properties/${propertyId}`;      // Property avain
    const resp = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const data = await resp.json();
    return data.last_value;
}

// Kopioitu ChatGPT^^