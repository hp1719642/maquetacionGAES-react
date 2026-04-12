// src/components/Dashboard/MapView.jsx
import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Arreglar los iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const MapView = ({ vehicles = [] }) => {
  // Centro de Bogotá (por defecto)
  const centerPosition = [4.7110, -74.0721]

  // Función para obtener color según estado
  const getMarkerColor = (status) => {
    switch(status) {
      case 'alert': return '#e53e3e'   // Rojo
      case 'warning': return '#dd6b20' // Naranja
      default: return '#38a169'         // Verde
    }
  }

  // Función para obtener texto del estado en español
  const getStatusText = (status) => {
    switch(status) {
      case 'alert': return '🚨 EMERGENCIA'
      case 'warning': return '⚠️ ALERTA'
      default: return '✅ NORMAL'
    }
  }

  return (
    <MapContainer 
      center={centerPosition} 
      zoom={12} 
      className="map-content"
      style={{ height: '450px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      
      {vehicles.map(vehicle => (
        <Marker 
          key={vehicle.id} 
          position={[vehicle.latitude, vehicle.longitude]}
          icon={L.divIcon({
            html: `<div style="
              background-color: ${getMarkerColor(vehicle.status)}; 
              width: 16px; 
              height: 16px; 
              border-radius: 50%; 
              border: 2px solid white; 
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              ${vehicle.status === 'alert' ? 'animation: pulse 1s infinite;' : ''}
            "></div>`,
            iconSize: [16, 16],
            popupAnchor: [0, -8]
          })}
        >
          <Popup>
            <div style={{ textAlign: 'center' }}>
              <strong>🚛 {vehicle.plate}</strong>
              <br />
              👨‍✈️ Conductor: {vehicle.driver}
              <br />
              🗺️ Ruta: {vehicle.route}
              <br />
              <span style={{ 
                color: getMarkerColor(vehicle.status),
                fontWeight: 'bold'
              }}>
                {getStatusText(vehicle.status)}
              </span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

export default MapView