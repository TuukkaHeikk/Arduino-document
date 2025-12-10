import React from 'react'
import SensorCard from './SensorCard'

export default function SensorOverview({ sensors=[], loading, onRefresh }){
  return (
    <div>
      <div className="card">
        <h3>Reaaliaikainen</h3>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:10}}>
          <div>
            <div style={{fontSize:28, fontWeight:800}}>
              {sensors[0] ? sensors[0].temp.toFixed(1) + '°C' : '--'}
            </div>
            <div style={{color:'var(--muted)'}}>{sensors[0] ? sensors[0].name : 'Ei anturia'}</div>
          </div>
          <div>
            <button className="btn" onClick={onRefresh}>{loading ? 'Päivitetään...' : 'Päivitä'}</button>
          </div>
        </div>
      </div>

      <div style={{height:16}}/>

      <div className="card">
        <h3>Sensorien tila</h3>
        <div className="sensor-list" style={{marginTop:8}}>
          {sensors.length === 0 && <div style={{color:'var(--muted)'}}>Ei sensoreita — käytä mock-dataa tai aseta proxy.</div>}
          {sensors.map(s => <SensorCard key={s.id} sensor={s} />)}
        </div>
      </div>
    </div>
  )
}
