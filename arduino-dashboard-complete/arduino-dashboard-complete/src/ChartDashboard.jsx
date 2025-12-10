import React, { useEffect, useState } from "react";
import TemperatureGauge from "./TemperatureGauge";
import TemperatureLineChart from "./TemperatureLineChart";
import { Sun, CloudRain, Snowflake } from "lucide-react";
import "./theme.css";

export default function ChartDashboard({ temperaturedata }) {
  const [temperature, setTemperature] = useState(5);
  const [history, setHistory] = useState([]);
  const [theme, setTheme] = useState("dark");

  console.log('CHARTDASHBOARD:: ', temperaturedata);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTemperature(parseFloat(temperaturedata));
      setHistory((prev) => {
        const updated = [...prev, { time: Date.now(), temp: parseFloat(temperaturedata) }];
        return updated.slice(-1440);
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [temperaturedata]);

  const getWeatherIcon = () => {
    if (temperature < 0) return <Snowflake className="weather-icon" size={40} />;
    if (temperature < 10) return <CloudRain className="weather-icon" size={40} />;
    return <Sun className="weather-icon" size={40} />;
  };

  const cardStyle = {
    background: "var(--card-bg)",
    padding: "20px",
    borderRadius: "22px",
    boxShadow: "0 0 25px var(--glow)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    transition: "0.4s ease",
    position: "relative",
    overflow: "hidden",
  };

  return (
    <div className="weather-bg" style={{ width: "100vw", height: "100vh", overflow: "hidden", padding: "20px" }}>
  <button
  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
  className="theme-toggle"
>
  {theme === "dark" ? "Light mode" : "Dark mode"}
</button>

      <div className="top-row">
        <div style={{ ...cardStyle, width: "30%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div className="weather-icon-wrapper">{getWeatherIcon()}</div>
          <TemperatureGauge temperature={temperature} />
        </div>

        <div style={{ ...cardStyle, width: "70%" }}>
          <h2 style={{ marginBottom: "10px" }}>Lämpötila 24h</h2>
          <TemperatureLineChart data={history} />
        </div>
      </div>
    </div>
  );
}
