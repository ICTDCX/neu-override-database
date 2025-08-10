import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: 16 }}>
      <h1>English Practice</h1>
      <p>Mô phỏng giao diện thi: làm bài, xem đúng/sai ngay, lưu tiến độ cục bộ.</p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
        <Link to="/auth">Đăng nhập</Link>
        <Link to="/practice">Vào làm bài</Link>
        <Link to="/review">Xem lại</Link>
      </div>
    </div>
  )
}