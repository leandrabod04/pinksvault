import { useState } from 'react'
import { songs, albums } from '../data/songs'
import SongCard from '../components/SongCard'
import './HomePage.css'

export default function HomePage() {
  const [query,       setQuery]       = useState('')
  const [albumFilter, setAlbumFilter] = useState('All')

  const filtered = songs.filter((song) => {
    const matchesSearch = song.title.toLowerCase().includes(query.toLowerCase()) ||
                          song.album.toLowerCase().includes(query.toLowerCase())
    const matchesAlbum  = albumFilter === 'All' || song.album === albumFilter
    return matchesSearch && matchesAlbum
  })

  return (
    <div className="page-content">
      {/* Header */}
      <div className="home-header">
        <h1 className="section-title">Discover Songs</h1>
        <p className="text-muted">{filtered.length} song{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Search + filter bar */}
      <div className="home-controls">
        <input
          className="input home-search"
          type="search"
          placeholder="Search songs or albums…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="input home-filter"
          value={albumFilter}
          onChange={(e) => setAlbumFilter(e.target.value)}
        >
          <option value="All">All albums</option>
          {albums.map((album) => (
            <option key={album} value={album}>{album}</option>
          ))}
        </select>
      </div>

      {/* Song grid */}
      {filtered.length > 0 ? (
        <div className="song-grid">
          {filtered.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      ) : (
        <p className="text-muted home-empty">No songs match your search.</p>
      )}
    </div>
  )
}
