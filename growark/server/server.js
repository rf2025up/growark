import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mysql from 'mysql2/promise'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const port = process.env.PORT || 4000
let pool = null
if (process.env.DATABASE_URL) {
  try {
    const u = new URL(process.env.DATABASE_URL)
    const dbName = (u.pathname || '').replace(/^\//, '') || undefined
    const base = {
      host: u.hostname,
      port: u.port ? Number(u.port) : 3306,
      user: decodeURIComponent(u.username || ''),
      password: decodeURIComponent(u.password || ''),
      waitForConnections: true,
      connectionLimit: 5
    }
    if (dbName) {
      const conn = await mysql.createConnection({ host: base.host, port: base.port, user: base.user, password: base.password })
      await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``)
      await conn.end()
      pool = await mysql.createPool({ ...base, database: dbName })
    } else {
      pool = await mysql.createPool(base)
    }
  } catch (e) {
    pool = null
  }
}
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ensureDb = async () => {
  if (!pool) return
    await pool.query(`CREATE TABLE IF NOT EXISTS students (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(255),
      points INT DEFAULT 0,
      exp INT DEFAULT 0,
      level INT DEFAULT 1,
      class_name VARCHAR(255),
      avatar_url VARCHAR(500),
      team_id VARCHAR(64),
      habit_stats JSON,
      challenge_history JSON,
      pk_history JSON,
      task_history JSON,
      badge_history JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`)
    await pool.query(`CREATE TABLE IF NOT EXISTS events (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      type VARCHAR(64),
      payload TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`)
}

ensureDb().catch(()=>{})

const clients = new Set()
const broadcast = (data) => {
  const payload = `data: ${JSON.stringify(data)}\n\n`
  clients.forEach((res) => {
    try { res.write(payload) } catch {}
  })
}

const writeEvent = async (type, payload) => {
  try {
    if (!pool) return
    await pool.query('INSERT INTO events(type, payload) VALUES(?, ?)', [type, JSON.stringify(payload)])
  } catch (e) {
    // swallow to avoid affecting business write
  }
}

app.get('/health', (_req, res) => res.json({ ok: true }))
app.get('/students', async (_req, res) => {
  try {
    if (!pool) return res.json({ students: [] })
    const [rows] = await pool.query(`
      SELECT id, name, points, exp, level, class_name as className,
             avatar_url as avatar, team_id as teamId,
             habit_stats as habitStats, challenge_history as challengeHistory,
             pk_history as pkHistory, task_history as taskHistory,
             badge_history as badgeHistory
      FROM students
      ORDER BY id
    `)
    res.json({ students: rows || [] })
  } catch (e) {
    console.error('get_students_error:', e?.message || e)
    res.status(500).json({ students: [] })
  }
})

app.post('/score', async (req, res) => {
  const { ids = [], points = 0, exp = 0 } = req.body || {}
  const apply = async () => {
    if (pool) {
      for (const id of ids) {
        const incExp = exp || Math.max(0, Math.abs(points) * 10)
        await pool.query('INSERT INTO students(id, points, exp) VALUES(?, ?, ?) ON DUPLICATE KEY UPDATE points = points + VALUES(points), exp = exp + VALUES(exp)', [id, points, incExp])
        await pool.query("UPDATE students SET name = COALESCE(name, CONCAT('学生', ?)) WHERE id = ?", [id, id])
      }
    }
    await writeEvent('score', { ids, points, exp })
    broadcast({ type: 'score', payload: { ids, points, exp } })
  }
  try {
    await apply()
    res.json({ ok: true })
  } catch (e) {
    console.error('score_error', e?.message || e)
    try {
      await ensureDb()
      await apply()
      res.json({ ok: true })
    } catch (e2) {
      console.error('score_error_after_ensure', e2?.message || e2)
      res.status(500).json({ ok: false })
    }
  }
})

app.post('/habit-checkin', async (req, res) => {
  const { studentIds = [], habitId } = req.body || {}
  try {
    await writeEvent('habit', { studentIds, habitId })
    broadcast({ type: 'habit', payload: { studentIds, habitId } })
    res.json({ ok: true })
  } catch {
    res.status(500).json({ ok: false })
  }
})

app.post('/challenge-status', async (req, res) => {
  const { id, result, participants = [] } = req.body || {}
  try {
    if (pool && result === 'success') {
      for (const sid of participants) {
        await pool.query('INSERT IGNORE INTO students(id) VALUES(?)', [sid])
      }
    }
    await writeEvent('challenge', { id, result, participants })
    broadcast({ type: 'challenge', payload: { id, result, participants } })
    res.json({ ok: true })
  } catch { res.status(500).json({ ok: false }) }
})

app.post('/pk-winner', async (req, res) => {
  const { id, winnerId } = req.body || {}
  try {
    await writeEvent('pk', { id, winnerId })
    broadcast({ type: 'pk', payload: { id, winnerId } })
    res.json({ ok: true })
  } catch { res.status(500).json({ ok: false }) }
})

app.post('/task-complete', async (req, res) => {
  const { id, title, expValue } = req.body || {}
  try {
    await writeEvent('task', { id, title, expValue })
    broadcast({ type: 'task', payload: { id, title, expValue } })
    res.json({ ok: true })
  } catch { res.status(500).json({ ok: false }) }
})

app.post('/badge-grant', async (req, res) => {
  const { badgeId, studentId } = req.body || {}
  try {
    await writeEvent('badge', { badgeId, studentId })
    broadcast({ type: 'badge', payload: { badgeId, studentId } })
    res.json({ ok: true })
  } catch { res.status(500).json({ ok: false }) }
})

app.get('/events', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders && res.flushHeaders()
  res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`)
  const timer = setInterval(() => {
    res.write(`data: ${JSON.stringify({ type: 'ping', ts: Date.now() })}\n\n`)
  }, 30000)
  clients.add(res)
  req.on('close', () => { clearInterval(timer); clients.delete(res) })
})

const staticRoot = path.resolve(__dirname, '../dist')
app.use(express.static(staticRoot))
app.get('/', (req, res) => {
  res.sendFile(path.join(staticRoot, 'index.html'))
})
app.get('/bigscreen', (req, res) => {
  res.sendFile(path.join(staticRoot, 'bigscreen/index.html'))
})

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://localhost:${port}`)
  console.log(`🌐 Public address: http://101.126.39.135:${port}`)
})