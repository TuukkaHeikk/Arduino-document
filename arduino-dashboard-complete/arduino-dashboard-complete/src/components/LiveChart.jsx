import React from 'react'
import { Line } from 'react-chartjs-2'

export default function LiveChart({ history={ timestamps: [], temps: [] } }){
  const labels = history.timestamps || []
  const datasets = (history.temps || []).map((s, idx) => ({
    label: s.label || ('Sensor ' + (idx+1)),
    data: s.values || [],
    borderWidth: 2,
    tension: 0.3
  }))

  const data = { labels, datasets }
  const options = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
    scales: { x: { display: true }, y: { display: true } }
  }

  return (
    <div className="card">
      <h3>Lämpötilahistoria (24h)</h3>
      <div style={{height:320}}>
        <Line data={data} options={options} />
      </div>
    </div>
  )
}
