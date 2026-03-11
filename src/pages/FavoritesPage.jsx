import { useFavorites } from '../context/FavoritesContext'
import { songs } from '../data/songs'
import SongCard from '../components/SongCard'
import './FavoritesPage.css'

export default function FavoritesPage() {
  const { favoriteIds } = useFavorites()

  const favoritedSongs = songs.filter((song) => favoriteIds.includes(song.id))

  return (
    <div className="page-content">
      <div className="fav-header">
        <h1 className="section-title">My Favorites</h1>
        {favoritedSongs.length > 0 && (
          <p className="text-muted">
            {favoritedSongs.length} song{favoritedSongs.length !== 1 ? 's' : ''} saved
          </p>
        )}
      </div>

      {favoritedSongs.length > 0 ? (
        <div className="song-grid">
          {favoritedSongs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      ) : (
        <div className="fav-empty">
          <p className="fav-empty-icon">♡</p>
          <p className="fav-empty-title">No favorites yet</p>
          <p className="text-muted">
            Head to the home page and tap the heart on any song to save it here.
          </p>
        </div>
      )}
    </div>
  )
}
