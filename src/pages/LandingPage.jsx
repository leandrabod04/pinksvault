import { Link } from 'react-router-dom'
import './LandingPage.css'

export default function LandingPage() {
  return (
    <div className="landing">
      <main className="landing-center">
        <h1 className="landing-title">PinksVault</h1>
        <p className="landing-tagline">
          Your personal space for PinkPantheress — rank songs,<br />
          save favorites, and connect with other fans.
        </p>
        <div className="landing-actions">
          <Link to="/signup" className="btn-primary landing-btn">Get Started</Link>
          <Link to="/login"  className="btn-ghost  landing-btn">Log In</Link>
        </div>
      </main>

      <footer className="landing-footer">
        PinksVault &mdash; made for fans, by fans
      </footer>
    </div>
  )
}
