import React, { useEffect, useState } from "react";
import GaugeChart from "react-gauge-chart";

export default function TemperatureGauge({ temperature }) {
  const minTemp = -1;
  const maxTemp = 40;

  // ---- Smooth animaatio ----
  const [animatedTemp, setAnimatedTemp] = useState(temperature);

  useEffect(() => {
    const duration = 500; // hieman pidempi & sulavampi
    const frameRate = 60; // 60 fps
    const frames = duration / (1000 / frameRate);

    const startValue = animatedTemp;
    const diff = temperature - startValue;
    let frame = 0;

    const anim = setInterval(() => {
      frame++;
      const t = frame / frames;

      // smoothstep (pehmeä kaari)
      const smooth = t * t * (3 - 2 * t);
      const newValue = startValue + diff * smooth;

      setAnimatedTemp(newValue);

      if (frame >= frames) clearInterval(anim);
    }, 1000 / frameRate);

    return () => clearInterval(anim);
  }, [temperature]);

  // ---- Väri lämpötilan mukaan ----
  let needleColor = "#00BFFF";
  if (animatedTemp > 5 && animatedTemp <= 12) needleColor = "#00FF7F";
  if (animatedTemp > 12) needleColor = "#FF4500";

  // ---- Prosentti asteikolle ----
  const percent = (animatedTemp - minTemp) / (maxTemp - minTemp);

  return (
    <div style={{ width: "250px", textAlign: "center" }}>
      <h2 style={{ marginBottom: "10px" }}>Ilman lämpötila</h2>

      <GaugeChart
        id="temperature-gauge"
        nrOfLevels={30}
        colors={["#0044FF", "#00FF7F", "#FF3300"]}
        arcWidth={0.3}
        percent={percent}
        textColor="#fff"
        needleColor={needleColor}
        needleBaseColor={needleColor}
        formatTextValue={() => `${animatedTemp.toFixed(2)} °C`}
        animate={false}          // 🔥 estää gaugechartin sisäisen animaation
      />
    </div>
  );
}
