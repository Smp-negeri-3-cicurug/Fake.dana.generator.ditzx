import { Canvas, loadImage, FontLibrary } from 'skia-canvas'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

FontLibrary.use('CartoonVibes', path.join(__dirname, '../data/f5803c-1772975107907.ttf'))

async function generate(angka) {
  const bg = await loadImage('https://raw.githubusercontent.com/uploader762/dat3/main/uploads/9c18e0-1772932032348.jpg')
  const logo = await loadImage('https://raw.githubusercontent.com/uploader762/dat3/main/uploads/d0f081-1772929197100.png')

  const canvas = new Canvas(bg.width, bg.height)
  const ctx = canvas.getContext('2d')

  ctx.drawImage(bg, 0, 0)

  ctx.font = '205px CartoonVibes'
  ctx.fillStyle = 'white'
  ctx.textBaseline = 'top'

  const x = 664
  const y = 293

  ctx.fillText(angka, x, y)

  const textWidth = ctx.measureText(angka).width
  const jarak = 11
  const logoSize = 370
  const offsetY = -31

  const logoX = x + textWidth + jarak
  const logoY = y + offsetY

  ctx.drawImage(logo, logoX, logoY, logoSize, logoSize)

  return await canvas.png
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { angka } = req.body
    if (!angka) return res.status(400).json({ error: 'Nominal diperlukan' })

    const raw = Number(String(angka).replace(/\./g, '').replace(/,/g, ''))
    if (isNaN(raw) || raw <= 0) return res.status(400).json({ error: 'Nominal tidak valid' })

    const formatted = raw.toLocaleString('id-ID')
    const buffer = await generate(formatted)

    res.setHeader('Content-Type', 'image/png')
    res.setHeader('Content-Disposition', `attachment; filename="dana-${raw}.png"`)
    res.send(buffer)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message })
  }
    }
    
import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

GlobalFonts.registerFromPath(
  path.join(__dirname, '../data/f5803c-1772975107907.ttf'),
  'CartoonVibes'
)

async function generate(angka) {
  const bg = await loadImage('https://raw.githubusercontent.com/uploader762/dat3/main/uploads/9c18e0-1772932032348.jpg')
  const logo = await loadImage('https://raw.githubusercontent.com/uploader762/dat3/main/uploads/d0f081-1772929197100.png')

  const canvas = createCanvas(bg.width, bg.height)
  const ctx = canvas.getContext('2d')

  ctx.drawImage(bg, 0, 0)

  ctx.font = '205px CartoonVibes'
  ctx.fillStyle = 'white'
  ctx.textBaseline = 'top'

  const x = 664
  const y = 293

  ctx.fillText(angka, x, y)

  const textWidth = ctx.measureText(angka).width
  const jarak = 11
  const logoSize = 370
  const offsetY = -31

  const logoX = x + textWidth + jarak
  const logoY = y + offsetY

  ctx.drawImage(logo, logoX, logoY, logoSize, logoSize)

  return canvas.toBuffer('image/png')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { angka } = req.body
    if (!angka) return res.status(400).json({ error: 'Nominal diperlukan' })

    const raw = Number(String(angka).replace(/\./g, '').replace(/,/g, ''))
    if (isNaN(raw) || raw <= 0) return res.status(400).json({ error: 'Nominal tidak valid' })

    const formatted = raw.toLocaleString('id-ID')
    const buffer = await generate(formatted)

    res.setHeader('Content-Type', 'image/png')
    res.setHeader('Content-Disposition', `attachment; filename="dana-${raw}.png"`)
    res.send(buffer)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message })
  }
}
  
