export async function parseJSONFile(file) {
  const text = await file.text()
  let data
  try { data = JSON.parse(text) } catch (e) { return [] }
  // Expect array of objects with lat/lng
  if (!Array.isArray(data)) return []
  return data.map((r) => ({
    lat: parseFloat(r.lat || r.latitude),
    lng: parseFloat(r.lng || r.longitude),
    title: r.title || r.name || '',
    description: r.description || '',
    image: r.image || null
  })).filter(n => n.lat && n.lng)
}
