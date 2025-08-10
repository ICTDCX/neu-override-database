import { FormEvent, useState } from 'react'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [message, setMessage] = useState('')

  async function requestOtp(e: FormEvent) {
    e.preventDefault()
    setMessage('Đang gửi mã...')
    // TODO: call /api/request-otp
    setTimeout(() => {
      setCodeSent(true)
      setMessage('Mã đã gửi (demo). Nhập 6 số để đăng nhập.')
    }, 500)
  }

  async function verifyOtp(e: FormEvent) {
    e.preventDefault()
    setMessage('Đang xác minh...')
    // TODO: call /api/verify-otp
    setTimeout(() => {
      setMessage('Đăng nhập thành công (demo).')
    }, 500)
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