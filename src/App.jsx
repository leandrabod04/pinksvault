import './App.css'

const features = [
  {
    icon: '🔐',
    title: 'User Authentication',
    description: 'Create an account and log in to keep your data saved across sessions.',
  },
  {
    icon: '🏆',
    title: 'Personal Song Rankings',
    description: 'Rank PinkPantheress songs however you like and build your own tier list.',
  },
  {
    icon: '♡',
    title: 'Favorite Songs List',
    description: 'Save the tracks you love most to your personal favorites vault.',
  },
  {
    icon: '✍',
    title: 'Song Reviews',
    description: 'Write short reviews on any song and share your thoughts with the community.',
  },
  {
    icon: '🌐',
    title: 'Community Rankings',
    description: 'See how other fans are ranking songs and discover new favorites.',
  },
]

function App() {
  return (
    <div className="page">
      <header className="hero">
        <h1>PinksVault</h1>
        <p className="description">
          PinksVault is a web app where PinkPantheress fans can rank their favorite songs,
          save favorites, and write short reviews.
        </p>
      </header>

      <main className="features">
        <h2>Features</h2>
        <ul className="feature-list">
          {features.map((f) => (
            <li key={f.title} className="feature-item">
              <span className="feature-icon">{f.icon}</span>
              <div>
                <h3>{f.title}</h3>
                <p>{f.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </main>

      <footer>
        <p>PinksVault &mdash; made for fans, by fans</p>
      </footer>
    </div>
  )
}

export default App
