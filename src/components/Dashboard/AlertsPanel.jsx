// src/components/Dashboard/AlertsPanel.jsx
import React from 'react'

const AlertsPanel = ({ alerts = [] }) => {
  // Función para obtener clase de prioridad
  const getPriorityClass = (priority) => {
    switch(priority) {
      case 'high': return 'priority-high'
      case 'medium': return 'priority-medium'
      case 'low': return 'priority-low'
      default: return 'priority-low'
    }
  }

  // Función para formatear fecha
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Fecha desconocida'
    const date = new Date(timestamp)
    const ahora = new Date()
    const diffMs = ahora - date
    const diffMin = Math.floor(diffMs / 60000)
    
    if (diffMin < 1) return 'Hace unos segundos'
    if (diffMin < 60) return `Hace ${diffMin} min`
    if (diffMin < 1440) return `Hace ${Math.floor(diffMin / 60)} horas`
    return date.toLocaleDateString()
  }

  if (alerts.length === 0) {
    return (
      <div className="alerts-panel">
        <div className="panel-header">
          <div className="panel-title">Alertas Recientes</div>
          <button className="btn btn-danger">
            <i className="fas fa-broadcast-tower"></i> Protocolo Emergencia
          </button>
        </div>
        <div style={{ padding: '40px', textAlign: 'center', color: '#718096' }}>
          ✅ No hay alertas activas
        </div>
      </div>
    )
  }

  return (
    <div className="alerts-panel">
      <div className="panel-header">
        <div className="panel-title">
          Alertas Recientes 
          <span style={{ fontSize: '12px', marginLeft: '10px', color: '#e53e3e' }}>
            ({alerts.filter(a => !a.resolved).length} activas)
          </span>
        </div>
        <button className="btn btn-danger">
          <i className="fas fa-broadcast-tower"></i> Protocolo Emergencia
        </button>
      </div>
      <div className="alert-list">
        {alerts.map((alert) => (
          <div key={alert.id} className="alert-item">
            <div className={`alert-priority ${getPriorityClass(alert.priority)}`}></div>
            <div className="alert-content">
              <div className="alert-title">{alert.title}</div>
              <div className="alert-description">{alert.description}</div>
            </div>
            <div className="alert-time">{formatDate(alert.timestamp)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AlertsPanel