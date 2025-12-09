//import "dotenv/config";
require('dotenv').config();

async function getArduinoToken() {
  const response = await fetch("https://api2.arduino.cc/iot/v1/clients/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.ARDUINO_CLIENT_ID,
      client_secret: process.env.ARDUINO_CLIENT_SECRET,
      audience: "https://api2.arduino.cc/iot"
    })
  });

  const data = await response.json();
  return data.access_token;
}

async function readProperty(token, thingId, propertyId) {
  const url = `https://api2.arduino.cc/iot/v2/things/${thingId}/properties/${propertyId}`;
  const response = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  const data = await response.json();
  return data;
}

async function fetchData(keysArray) {
  const propertyMap = {
    showTemp: process.env.PROP_TEMPERATURE,
    showHumidity: process.env.PROP_HUMIDITY
  };

  const token = await getArduinoToken();

  const results = [];
  for (const item of keysArray) {
    const { key, displayName, symbol } = item; // destructure
    if (!(key in propertyMap)) continue;

    try {
      const data = await readProperty(token, process.env.ARDUINO_THING_ID, propertyMap[key]);
      console.log('VALUE: ', data.last_value);
      results.push({
        key,
        displayName,
        symbol,
        value: data.last_value
      })
    } catch (error) {
      console.log("Couldn't fetch from cloud!");
    }
  };
  console.log('RESULTS: ', results);
  return results;
}

module.exports = { fetchData };
