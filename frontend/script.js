// Kopioitu ChatGPT:
async function getArduinoValue(propertyId) {
    const token = "YOUR_API_TOKEN";
    const url = `https://api2.arduino.cc/iot/v2/properties/${propertyId}`;
    const resp = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const data = await resp.json();
    return data.last_value;
}

async function updateDashboard() {
    const temp = await getArduinoValue("temperature_property_id");
    document.getElementById("tempValue").textContent = temp;
}

setInterval(updateDashboard, 5000); // refresh every 5 seconds
// Kopioitu ChatGPT^^