import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

async function getArduinoToken() {
  const response = await axios.post(
    "https://api2.arduino.cc/iot/v1/clients/token",
    new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.ARDUINO_CLIENT_ID,
      client_secret: process.env.ARDUINO_CLIENT_SECRET,
      audience: "https://api2.arduino.cc/iot"
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
  );

  return response.data.access_token;
}

async function readProperty(token, thingId, propertyId) {
  const url = `https://api2.arduino.cc/iot/v2/things/${thingId}/properties/${propertyId}`;
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
}

export default async function fetchData() {
  try {
    const token = await getArduinoToken();
    const data = await readProperty(token, process.env.ARDUINO_THING_ID, process.env.PROP_TEMPERATURE);
    console.log('VALUE: ', data.last_value);
    return data.last_value;
  } catch (error) {
    console.log("Couldn't fetch from cloud!, ", error);
  }
};
