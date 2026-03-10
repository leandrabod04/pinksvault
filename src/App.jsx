import './App.css'

function App() {
  return (
    <div className="landing">
      <header className="hero">
        <div className="hero-content">
          <h1 className="logo-title">PinksVault</h1>
          <p className="tagline">Your personal archive for all things PinkPantheress</p>
          <div className="cta-buttons">
            <button className="btn-primary">Create Account</button>
            <button className="btn-secondary">Explore</button>
          </div>
        </div>
      </header>

      <section className="features">
        <h2>What you can do</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <span className="feature-icon">★</span>
            <h3>Rank Songs</h3>
            <p>Build your personal tier list across all of PinkPantheress's discography.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">♡</span>
            <h3>Save Favorites</h3>
            <p>Bookmark the tracks you keep on repeat to your personal vault.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">✍</span>
            <h3>Leave Reviews</h3>
            <p>Drop short takes on songs and see what other fans think.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">👤</span>
            <h3>Your Profile</h3>
            <p>Create an account and keep all your rankings and reviews in one place.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>PinksVault &mdash; Made for fans, by fans &hearts;</p>
      </footer>
    </div>
  )
}

export default App
