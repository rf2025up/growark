import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()
const dist = path.resolve(__dirname, '../dist')

// Serve static files from dist root (including config.js, assets, etc.)
app.use(express.static(dist))

// Serve bigscreen SPA - fallback for all other routes
app.use((req, res) => {
  const bigscreenPath = path.join(dist, 'bigscreen/index.html')
  console.log(`[${new Date().toISOString()}] Request: ${req.url}, serving SPA: ${bigscreenPath}`)
  if (fs.existsSync(bigscreenPath)) {
    console.log(`[${new Date().toISOString()}] SPA file exists, sending...`)
    res.sendFile(bigscreenPath)
  } else {
    console.log(`[${new Date().toISOString()}] SPA file not found`)
    res.status(404).send('Not found: BigScreen SPA')
  }
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`Bigscreen server listening on port ${port}`)
})