import express from 'express'
import { Canvas, loadImage, FontLibrary } from 'skia-canvas'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000

FontLibrary.use('CartoonVibes', path.join(__dirname, 'data/f5803c-1772975107907.ttf'))

app.use(express.json())
app.use(express.static(__dirname))

const TARGET = 2200 // Fixed output size

async function generate(angka) {
  const bg = await loadImage('https://raw.githubusercontent.com/uploader762/dat3/main/uploads/9c18e0-1772932032348.jpg')
  const logo = await loadImage('https://raw.githubusercontent.com/uploader762/dat3/main/uploads/d0f081-1772929197100.png')

  const SCALE = TARGET / bg.width // Hitung scale dari ukuran asli bg

  const canvas = new Canvas(TARGET, TARGET)
  const ctx = canvas.getContext('2d')

  ctx.drawImage(bg, 0, 0, TARGET, TARGET)

  ctx.font = `${Math.round(205 * SCALE)}px CartoonVibes`
  ctx.fillStyle = 'white'
  ctx.textBaseline = 'top'

  const x = Math.round(664 * SCALE)
  const y = Math.round(293 * SCALE)

  ctx.fillText(angka, x, y)

  const textWidth = ctx.measureText(angka).width
  const jarak = Math.round(11 * SCALE)
  const logoSize = Math.round(370 * SCALE)
  const offsetY = Math.round(-31 * SCALE)

  const logoX = x + textWidth + jarak
  const logoY = y + offsetY

  ctx.drawImage(logo, logoX, logoY, logoSize, logoSize)

  // Pakai JPEG quality 85 → jauh lebih kecil dari PNG
  return await canvas.toBuffer('jpg', { quality: 85 })
}

app.post('/api/generate', async (req, res) => {
  try {
    const { angka } = req.body
    if (!angka) return res.status(400).json({ error: 'Nominal diperlukan' })

    const raw = Number(String(angka).replace(/\./g, '').replace(/,/g, ''))
    if (isNaN(raw) || raw <= 0) return res.status(400).json({ error: 'Nominal tidak valid' })

    const formatted = raw.toLocaleString('id-ID')
    const buffer = await generate(formatted)

    res.setHeader('Content-Type', 'image/jpeg')
    res.setHeader('Content-Disposition', `attachment; filename="dana-${raw}.jpg"`)
    res.send(buffer)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
