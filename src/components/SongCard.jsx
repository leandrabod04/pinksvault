import { useFavorites } from '../context/FavoritesContext'
import { useAuth } from '../context/AuthContext'
import './SongCard.css'

export default function SongCard({ song }) {
  const { currentUser }              = useAuth()
  const { isFavorited, toggleFavorite } = useFavorites()

  const favorited = isFavorited(song.id)

  function handleFavClick(e) {
    e.stopPropagation()
    toggleFavorite(song.id)
  }

  return (
    <div className="song-card">
      {/* Album art */}
      <div
        className="song-art"
        style={song.albumArt
          ? { backgroundImage: `url(${song.albumArt})` }
          : { background: `linear-gradient(135deg, ${song.albumColor}, #0a0a0a)` }
        }
      >
        {!song.albumArt && (
          <span className="song-art-initial">{song.title.charAt(0)}</span>
        )}
      </div>

      {/* Info */}
      <div className="song-info">
        <p className="song-title">{song.title}</p>
        <p className="song-album">{song.album}</p>
      </div>

      {/* Duration + favorite button */}
      <div className="song-footer">
        <span className="song-duration">{song.duration}</span>
        {currentUser && (
          <button
            className={`song-fav-btn${favorited ? ' favorited' : ''}`}
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            onClick={handleFavClick}
          >
            {favorited ? '♥' : '♡'}
          </button>
        )}
      </div>
    </div>
  )
}
