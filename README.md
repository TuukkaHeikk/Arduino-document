# Arduino 
Laite lukee lämpötilaa sekä ilmankosteutta DHT11 anturin avulla ja päivittää sen Arduino Cloudiin. Laite sisältää myös hienon LED valon, jota voi cloudin avulla ohjata.

## Käyttöohjeet
Laite toimii Arduino Cloudin kautta, joten se vaatii Wifi yhteyden.

## Dashboard
Laite päivittää lämpötilaa ja ilmankosteutta Arduino Cloudin Dashboardiin, josta löytyy molemmille tiedoille omat mittarit. Dashboardista löytyy myös nappi, sekä LED, joiden avulla ohjataan ledivaloa, ja nähdään syttyykö LED.

## Liitäntä
DHT 11 anturin liitäntä: Vasen pinni > Digital pin, keskimmäinen pinni > +5V, Oikea pinni > Ground. Anturi sisältää vastuksen.

LED liitäntä: +5V > 220Ω > pidempi jalka > LED > Digital pin, ja LED > Ground.

## Laitteen tiedot
Nimi ja malli: Arduino MKR1000 WiFi

Min / Max lämpötila: 0°C - 50°C

Lämpötila-anturi: 3-pin DHT11
