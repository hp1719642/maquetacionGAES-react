import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix para iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const MapView = () => {
  const position = [4.7110, -74.0721] // Bogotá

  const vehicles = [
    { id: 1, position: [4.7110, -74.0721], status: 'normal', name: 'VV-001' },
    { id: 2, position: [4.7000, -74.0800], status: 'warning', name: 'VV-002' },
    { id: 3, position: [4.7200, -74.0600], status: 'alert', name: 'VV-003' },
  ]

  const getMarkerColor = (status) => {
    switch(status) {
      case 'alert': return 'red'
      case 'warning': return 'orange'
      default: return 'green'
    }
  }

  return (
    <MapContainer 
      center={position} 
      zoom={13} 
      style={{ height: '450px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {vehicles.map(vehicle => (
        <Marker 
          key={vehicle.id} 
          position={vehicle.position}
          icon={L.divIcon({
            className: `marker-${getMarkerColor(vehicle.status)}`,
            html: `<div style="background-color: ${getMarkerColor(vehicle.status)}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
            iconSize: [12, 12]
          })}
        >
          <Popup>
            <div>
              <strong>{vehicle.name}</strong>
              <br />
              Estado: {vehicle.status}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

export default MapView