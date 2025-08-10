import { FormEvent, useState } from 'react'
import { getDeviceId, setAuth } from '../lib/auth'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [message, setMessage] = useState('')

  async function requestOtp(e: FormEvent) {
    e.preventDefault()
    setMessage('Đang gửi mã...')
    const res = await fetch('/api/request-otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
    if (!res.ok) return setMessage('Lỗi gửi mã')
    const data = await res.json()
    setCodeSent(true)
    setMessage(`Mã đã gửi. (Demo OTP: ${data.debugCode})`)
    setOtp(data.debugCode || '')
  }

  async function verifyOtp(e: FormEvent) {
    e.preventDefault()
    setMessage('Đang xác minh...')
    const deviceId = getDeviceId()
    const res = await fetch('/api/verify-otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, code: otp, deviceId }) })
    const data = await res.json()
    if (!res.ok) return setMessage(data?.message || 'Mã sai hoặc hết hạn')
    setAuth({ email, userId: data.userId, sessionId: data.sessionId })
    setMessage('Đăng nhập thành công.')
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: 16 }}>
      <h2>Đăng nhập</h2>
      {!codeSent ? (
        <form onSubmit={requestOtp}>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          <button type="submit">Gửi mã OTP</button>
        </form>
      ) : (
        <form onSubmit={verifyOtp}>
          <label>Mã OTP</label>
          <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="6 số" />
          <button type="submit">Xác minh</button>
        </form>
      )}
      <p>{message}</p>
    </div>
  )
}