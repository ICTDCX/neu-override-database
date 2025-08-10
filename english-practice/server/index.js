import express from 'express'
import cors from 'cors'
import crypto from 'crypto'

const app = express()
app.use(cors())
app.use(express.json())

// In-memory stores for demo only
const otpStore = new Map() // email -> { code, exp }
const users = new Map() // email -> { userId, devices: Set<deviceId>, sessions: Set<sid> }
const MAX_DEVICES = 1

function genCode() { return ('' + Math.floor(100000 + Math.random() * 900000)) }
function genId(prefix) { return prefix + '_' + crypto.randomBytes(8).toString('hex') }

app.post('/api/request-otp', (req, res) => {
  const { email } = req.body || {}
  if (!email) return res.status(400).json({ error: 'email required' })
  const code = genCode()
  otpStore.set(email, { code, exp: Date.now() + 5 * 60_000 })
  console.log('OTP for', email, code)
  // demo: return code so user can test quickly
  return res.json({ ok: true, debugCode: code })
})

app.post('/api/verify-otp', (req, res) => {
  const { email, code, deviceId } = req.body || {}
  if (!email || !code || !deviceId) return res.status(400).json({ error: 'missing fields' })
  const rec = otpStore.get(email)
  if (!rec || rec.exp < Date.now() || rec.code !== code) return res.status(401).json({ error: 'invalid code' })
  otpStore.delete(email)

  if (!users.has(email)) users.set(email, { userId: genId('u'), devices: new Set(), sessions: new Set() })
  const u = users.get(email)

  if (!u.devices.has(deviceId)) {
    if (u.devices.size >= MAX_DEVICES) return res.status(403).json({ error: 'device_limit', message: 'Thiết bị đã đạt giới hạn' })
    u.devices.add(deviceId)
  }

  // single active session
  for (const sid of u.sessions) { /* invalidate old */ }
  u.sessions.clear()
  const sid = genId('s')
  u.sessions.add(sid)

  return res.json({ ok: true, userId: u.userId, sessionId: sid })
})

app.post('/api/session/heartbeat', (req, res) => {
  const { email, sessionId } = req.body || {}
  const u = users.get(email)
  if (!u || !u.sessions.has(sessionId)) return res.status(401).json({ error: 'expired' })
  return res.json({ ok: true })
})

app.post('/api/logout', (req, res) => {
  const { email, sessionId } = req.body || {}
  const u = users.get(email)
  if (u && u.sessions.has(sessionId)) u.sessions.delete(sessionId)
  return res.json({ ok: true })
})

const PORT = process.env.PORT || 5174
app.listen(PORT, () => console.log('API listening on', PORT))