import React from 'react'
import { Thermometer, Droplet, Battery } from 'lucide-react'

export default function SensorCard({ sensor }){
  const online = sensor.online
  return (
    <div className="sensor-row">
      <div className="sensor-left">
        <div style={{width:44, height:44, borderRadius:10, background: online? 'rgba(39,214,139,0.08)':'rgba(255,77,77,0.06)', display:'flex', alignItems:'center', justifyContent:'center'}}>
          <Thermometer size={20} color={ online ? 'var(--ok)' : 'var(--err)' } />
        </div>
        <div>
          <div className="sensor-name">{sensor.name}</div>
          <div className="sensor-meta">Viimeksi: {new Date(sensor.lastUpdate).toLocaleString()}</div>
        </div>
      </div>

      <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end'}}>
        <div className="value">{sensor.temp !== null ? sensor.temp.toFixed(1) + '°C' : '--'}</div>
        <div className="sensor-meta" style={{display:'flex', gap:8, alignItems:'center'}}><Droplet size={12} />{sensor.hum && sensor.hum !== -1 ? sensor.hum.toFixed(0) + '%' : '-'}</div>
      </div>
    </div>
  )
}
