import React, { useRef, useState } from 'react'
import Papa from 'papaparse'
import { parseJSONFile } from './utils/parseData'

export default function UploadPanel({ onAdd }) {
  const fileRef = useRef()
  const [images, setImages] = useState([])

  function handleFiles(files) {
    const arr = Array.from(files)
    arr.forEach((f) => {
      if (/\.csv$/i.test(f.name)) {
        Papa.parse(f, { header: true, complete: (res) => {
          const nodes = res.data.map((r) => ({
            lat: parseFloat(r.lat || r.latitude),
            lng: parseFloat(r.lng || r.longitude),
            title: r.title || r.name || '',
            description: r.description || ''
          })).filter(n => n.lat && n.lng)
          onAdd(nodes)
        }})
      } else if (/\.json$/i.test(f.name)) {
        parseJSONFile(f).then((nodes) => onAdd(nodes))
      } else if (/\.(jpg|jpeg|png)$/i.test(f.name)) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setImages((s) => [...s, { name: f.name, data: e.target.result, lat: '', lng: '', title: '' }])
        }
        reader.readAsDataURL(f)
      }
    })
  }

  function onDrop(e) {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  function addImageNode(idx) {
    const img = images[idx]
    const lat = parseFloat(img.lat)
    const lng = parseFloat(img.lng)
    if (!isFinite(lat) || !isFinite(lng)) return alert('Please enter valid lat/lng')
    onAdd([{ lat, lng, title: img.title || img.name, image: img.data }])
    setImages((s) => s.filter((_, i) => i !== idx))
  }

  return (
    <div className="upload-panel">
      <div
        className="dropzone"
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileRef.current.click()}
      >
        Drop CSV/JSON or Images here, or click to select
        <input ref={fileRef} style={{ display: 'none' }} type="file" multiple onChange={(e) => handleFiles(e.target.files)} accept=".csv,.json,.jpg,.jpeg,.png" />
      </div>

      {images.length > 0 && (
        <div className="image-uploads">
          <h4>Pending Images</h4>
          {images.map((img, idx) => (
            <div key={idx} className="image-item">
              <img src={img.data} alt={img.name} style={{ width: 120 }} />
              <div className="meta">
                <input placeholder="Title" value={img.title} onChange={(e) => { const v=e.target.value; setImages(s=>{ const c=[...s]; c[idx].title=v; return c })}} />
                <input placeholder="Lat" value={img.lat} onChange={(e) => { const v=e.target.value; setImages(s=>{ const c=[...s]; c[idx].lat=v; return c })}} />
                <input placeholder="Lng" value={img.lng} onChange={(e) => { const v=e.target.value; setImages(s=>{ const c=[...s]; c[idx].lng=v; return c })}} />
                <button onClick={() => addImageNode(idx)}>Add to Map</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
