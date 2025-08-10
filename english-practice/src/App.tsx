import { Link } from 'react-router-dom'
import './App.css'

export default function App() {
  return (
    <div>
      <nav style={{ display: 'flex', gap: 12 }}>
        <Link to="/">Home</Link>
        <Link to="/auth">Auth</Link>
        <Link to="/practice">Practice</Link>
        <Link to="/review">Review</Link>
      </nav>
    </div>
  )
}
