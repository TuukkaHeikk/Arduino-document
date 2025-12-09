async function getArduinoToken() {
  const response = await fetch("https://api2.arduino.cc/iot/v1/clients/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.ARDUINO_CLIENT_ID,
      client_secret: process.env.ARDUINO_CLIENT_SECRET,
      audience: "api2.arduino.cc"
    })
  });

  const data = await response.json();
  return data.access_token;
}
