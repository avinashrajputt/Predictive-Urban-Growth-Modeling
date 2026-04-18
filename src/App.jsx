import React, { useState, useCallback } from 'react'
import MapView from './MapView'
import UploadPanel from './UploadPanel'

export default function App() {
  const [nodes, setNodes] = useState([])
  const [showTiles, setShowTiles] = useState(false)

  const addNodes = useCallback((newNodes) => {
    setNodes((s) => [...s, ...newNodes])
  }, [])

  return (
    <div className="app-root">
      <div className="sidebar">
        <h2>Fusion Dashboard</h2>
        <UploadPanel onAdd={addNodes} />

        <div style={{ marginTop: 12 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={showTiles} onChange={(e) => setShowTiles(e.target.checked)} />
            <span>Show map tiles</span>
          </label>
        </div>

        <div className="legend">
          <h4>Legend</h4>
          <div>- Hover markers to preview imagery/metadata</div>
        </div>
      </div>
      <div className="map-area">
        <MapView nodes={nodes} showTiles={showTiles} />
      </div>
    </div>
  )
}
