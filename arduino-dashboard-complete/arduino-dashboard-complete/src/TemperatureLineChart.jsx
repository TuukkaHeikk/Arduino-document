import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function TemperatureLineChart({ data }) {
  // Jos data on tyhjä, laitetaan dummy-arvot jotta kaavio näkyy aluksi
  const defaultData = data.length > 0 ? data : [{ time: Date.now(), temp: 5 }];

  const chartData = {
    labels: defaultData.map(h => new Date(h.time).toLocaleTimeString()),
    datasets: [
      {
        label: "Lämpötila °C",
        data: defaultData.map(h => h.temp),
        fill: false,
        borderColor: "#FF4500",
        backgroundColor: "#FF4500",
        tension: 0.4,
        pointRadius: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        title: { display: true, text: "Aika" },
      },
      y: {
        title: { display: true, text: "°C" },
        suggestedMin: -1,
        suggestedMax: 18,
      },
    },
  };

  return <Line data={chartData} options={options} />;
}