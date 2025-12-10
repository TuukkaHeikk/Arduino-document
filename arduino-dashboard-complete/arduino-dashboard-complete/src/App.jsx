import React, { useEffect, useState } from 'react'
import SensorOverview from './components/SensorOverview'
import LiveChart from './components/LiveChart'
import axios from 'axios'
import ChartDashboard from './ChartDashboard'

export default function App(){
  const [sensors, setSensors] = useState([])
  const [history, setHistory] = useState({ timestamps: [], temps: [] })
  const [loading, setLoading] = useState(false)
  const [temperature, setTemperature] = useState(0)

  async function fetchData(){
    setLoading(true)
    try {
      // IMPORTANT: point this to your backend proxy that holds the Arduino token
      const resp = await axios.get('http://localhost:3000/api/arduino/thing-data');
      if (resp.data) {
        console.log('JOTAIN DATAA::', resp.data);
        setTemperature(resp.data);
        if(Array.isArray(resp.data.sensors)) setSensors(resp.data.sensors)
        if(resp.data.history) setHistory(resp.data.history)
      }
    } catch(e){
      // fallback: mock
      console.warn('fetch error', e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{
    const t = setInterval(fetchData, 10000);
    return () => clearInterval(t);
  }, [])

  return (
    <div className="app">
      <ChartDashboard temperaturedata={temperature}/>
      <header className="header">
        <h1>Palma</h1>
        <div className="subtitle">ESP-NOW → reTerminal → Arduino Cloud</div>
      </header>

      <main className="container">
        <div className="left">
          <SensorOverview sensors={sensors} loading={loading} onRefresh={fetchData} />
        </div>
        <div className="right">
          <LiveChart history={history} />
        </div>
      </main>

      <footer className="footer">Keep API token on the server. Proxy endpoint: <code>/api/arduino/thing-data</code></footer>
    </div>
  )
}
