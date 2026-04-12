// src/components/Dashboard/StatusCards.jsx
import React from 'react'
import { FaTruck, FaExclamationCircle, FaRadiationAlt, FaSatelliteDish } from 'react-icons/fa'

const StatusCards = ({ vehicles = [], alerts = [] }) => {
  // Calcular estadísticas reales desde los datos de la API
  const totalVehicles = vehicles.length
  const normalVehicles = vehicles.filter(v => v.status === 'normal').length
  const warningVehicles = vehicles.filter(v => v.status === 'warning').length
  const alertVehicles = vehicles.filter(v => v.status === 'alert').length
  const activeAlerts = alerts.filter(a => !a.resolved).length

  const cards = [
    {
      title: 'Vehículos Activos',
      value: totalVehicles,
      description: 'En operación',
      icon: <FaTruck />,
      type: 'normal',
      footer: `Normal: ${normalVehicles}`,
      trend: `+${normalVehicles}`,
      trendUp: true
    },
    {
      title: 'En Alerta',
      value: warningVehicles,
      description: 'Requieren atención',
      icon: <FaExclamationCircle />,
      type: 'warning',
      footer: 'Monitorear',
      trend: `${warningVehicles}`,
      trendUp: false
    },
    {
      title: 'Emergencia',
      value: alertVehicles,
      description: 'Acción inmediata',
      icon: <FaRadiationAlt />,
      type: 'alert',
      footer: 'Crítica',
      trend: `${alertVehicles} vehículos`,
      trendUp: false
    },
    {
      title: 'Alertas Activas',
      value: activeAlerts,
      description: 'Sin resolver',
      icon: <FaSatelliteDish />,
      type: 'info',
      footer: 'Total alertas',
      trend: `${alerts.length} totales`,
      trendUp: activeAlerts > 0
    }
  ]

  return (
    <div className="dashboard-grid">
      {cards.map((card, index) => (
        <div key={index} className={`status-card ${card.type}`}>
          <div className="card-header">
            <div className="card-title">{card.title}</div>
            <div className="card-icon">{card.icon}</div>
          </div>
          <div className="card-value">{card.value}</div>
          <div className="card-description">{card.description}</div>
          <div className="card-footer">
            <span>{card.footer}</span>
            <div className={`card-trend ${card.trendUp ? 'trend-up' : 'trend-down'}`}>
              <span>{card.trend}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatusCards