import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const { currentUser, logOut } = useAuth()
  const navigate = useNavigate()

  async function handleLogOut() {
    await logOut()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <Link to={currentUser ? '/home' : '/'} className="navbar-brand">PinksVault</Link>

      {currentUser && (
        <div className="navbar-links">
          <NavLink to="/home"      className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink>
          <NavLink to="/rankings"  className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Rankings</NavLink>
          <NavLink to="/favorites" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Favorites</NavLink>
          <NavLink to="/reviews"   className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Reviews</NavLink>
          <NavLink to="/community" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Community</NavLink>
        </div>
      )}

      <div className="navbar-auth">
        {currentUser ? (
          <>
            <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              {currentUser.username}
            </NavLink>
            <button className="btn-ghost nav-btn" onClick={handleLogOut}>Log Out</button>
          </>
        ) : (
          <>
            <Link to="/login"  className="nav-link">Log In</Link>
            <Link to="/signup" className="btn-primary nav-btn">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  )
}
