import { useAuth }      from '../context/AuthContext'
import { useFavorites } from '../context/FavoritesContext'
import { useRankings }  from '../context/RankingsContext'
import { useReviews }   from '../context/ReviewsContext'
import { songs }        from '../data/songs'
import './ProfilePage.css'

function StatCard({ value, label }) {
  return (
    <div className="stat-card card">
      <span className="stat-value">{value}</span>
      <span className="stat-label text-muted">{label}</span>
    </div>
  )
}

export default function ProfilePage() {
  const { currentUser }   = useAuth()
  const { favoriteIds }   = useFavorites()
  const { rankedIds }     = useRankings()
  const { reviews }       = useReviews()

  const reviewCount = reviews.filter((r) => r.userId === currentUser.id).length
  const topSong     = rankedIds[0] ? songs.find((s) => s.id === rankedIds[0]) : null

  const memberSince = new Date(currentUser.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long',
  })

  return (
    <div className="page-content profile-page">

      {/* ── Identity ── */}
      <div className="profile-header">
        <div className="profile-avatar">
          {currentUser.username.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="profile-username">{currentUser.username}</h1>
          <p className="text-muted profile-email">{currentUser.email}</p>
          <p className="text-muted profile-since">Member since {memberSince}</p>
        </div>
      </div>

      {/* ── Stats grid ── */}
      <h2 className="section-title" style={{ marginBottom: '0.85rem' }}>Stats</h2>
      <div className="stats-grid">
        <StatCard value={favoriteIds.length} label="Favorites" />
        <StatCard value={rankedIds.length}   label="Songs Ranked" />
        <StatCard value={reviewCount}         label="Reviews Written" />
        <StatCard value={memberSince}         label="Member Since" />
      </div>

      {/* ── Top ranked song ── */}
      <h2 className="section-title" style={{ margin: '2rem 0 0.85rem' }}>Your #1 Pick</h2>
      {topSong ? (
        <div className="top-song card">
          <div
            className="top-song-art"
            style={topSong.albumArt
              ? { backgroundImage: `url(${topSong.albumArt})` }
              : { background: `linear-gradient(135deg, ${topSong.albumColor}, #0a0a0a)` }
            }
          >
            {!topSong.albumArt && (
              <span className="top-song-initial">{topSong.title.charAt(0)}</span>
            )}
          </div>
          <div className="top-song-info">
            <p className="top-song-title">{topSong.title}</p>
            <p className="text-muted">{topSong.album} · {topSong.year}</p>
          </div>
          <span className="top-song-badge">#1</span>
        </div>
      ) : (
        <div className="profile-empty card">
          <p className="profile-empty-label text-muted">
            You haven't ranked any songs yet.{' '}
            <a href="/rankings">Start your ranking →</a>
          </p>
        </div>
      )}

    </div>
  )
}
