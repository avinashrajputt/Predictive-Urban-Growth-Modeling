import React from 'react'
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
})

export default function MapView({ nodes, showTiles = false }) {
  const center = [20, 0]

  return (
    <MapContainer center={center} zoom={2} style={{ height: '100%', width: '100%' }}>
      {showTiles && (
        <TileLayer
          attribution='Map tiles: Stamen Terrain & OpenStreetMap'
          url="https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg"
        />
      )}

      {nodes.map((n, i) => {
        if (!n.lat || !n.lng) return null
        return (
          <Marker key={i} position={[n.lat, n.lng]}>
            <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false} interactive={true}>
              <div style={{ maxWidth: 260 }}>
                {n.image && <img src={n.image} alt={n.title || 'img'} style={{ width: '240px', display: 'block', marginBottom: 6 }} />}
                <strong>{n.title || 'Node'}</strong>
                <div style={{ fontSize: 12 }}>{n.description || ''}</div>
                <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>Lat: {n.lat}, Lng: {n.lng}</div>
              </div>
            </Tooltip>
          </Marker>
        )
      })}
    </MapContainer>
  )
}
