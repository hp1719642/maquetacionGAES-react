// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import StatusCards from '../components/Dashboard/StatusCards'
import MapView from '../components/Dashboard/MapView'
import AlertsPanel from '../components/Dashboard/AlertsPanel'
import { vehiclesAPI, alertsAPI } from '../services/api'

const Dashboard = () => {
  const [vehicles, setVehicles] = useState([])
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  // useEffect se ejecuta cuando la página se carga
  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    setLoading(true)
    
    // Cargar vehículos desde la API
    const vehiclesResult = await vehiclesAPI.getAll()
    if (vehiclesResult.success) {
      setVehicles(vehiclesResult.data)
    }

    // Cargar alertas desde la API
    const alertsResult = await alertsAPI.getAll()
    if (alertsResult.success) {
      setAlerts(alertsResult.data)
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          Cargando datos...
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <StatusCards vehicles={vehicles} alerts={alerts} />
      
      <div className="map-container">
        <div className="map-header">
          <div className="map-title">Monitoreo en Tiempo Real</div>
          <div className="map-controls">
            <button className="btn btn-outline btn-sm">
              <i className="fas fa-filter"></i> Filtros
            </button>
            <button className="btn btn-outline btn-sm">
              <i className="fas fa-layer-group"></i> Capas
            </button>
            <button className="btn btn-primary btn-sm" onClick={cargarDatos}>
              <i className="fas fa-sync-alt"></i> Actualizar
            </button>
          </div>
        </div>
        <MapView vehicles={vehicles} />
      </div>
      
      <AlertsPanel alerts={alerts} />
    </Layout>
  )
}

export default Dashboard