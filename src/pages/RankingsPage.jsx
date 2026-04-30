import { useState } from 'react'
import { useRankings } from '../context/RankingsContext'
import { songs } from '../data/songs'
import './RankingsPage.css'

// Small inline art square reused in both sections
function MiniArt({ song }) {
  return (
    <div
      className="rank-art"
      style={song.albumArt
        ? { backgroundImage: `url(${song.albumArt})` }
        : { background: `linear-gradient(135deg, ${song.albumColor}, #0a0a0a)` }
      }
    >
      {!song.albumArt && (
        <span className="rank-art-initial">{song.title.charAt(0)}</span>
      )}
    </div>
  )
}

export default function RankingsPage() {
  const { rankedIds, isRanked, addToRanking, removeFromRanking, moveUp, moveDown } = useRankings()
  const [query, setQuery] = useState('')

  // Resolve ranked IDs → song objects in order
  const rankedSongs = rankedIds
    .map((id) => songs.find((s) => s.id === id))
    .filter(Boolean)

  // Unranked songs, filtered by search query
  const unranked = songs.filter(
    (s) =>
      !isRanked(s.id) &&
      (s.title.toLowerCase().includes(query.toLowerCase()) ||
       s.album.toLowerCase().includes(query.toLowerCase()))
  )

  return (
    <div className="page-content">

      {/* ── Your Ranking ──────────────────────────────────────────── */}
      <div className="rank-header">
        <h1 className="section-title">My Rankings</h1>
        {rankedSongs.length > 0 && (
          <p className="text-muted">{rankedSongs.length} song{rankedSongs.length !== 1 ? 's' : ''} ranked</p>
        )}
      </div>

      {rankedSongs.length > 0 ? (
        <ol className="ranked-list">
          {rankedSongs.map((song, idx) => (
            <li key={song.id} className="ranked-item">
              <span className="rank-number">#{idx + 1}</span>
              <MiniArt song={song} />
              <div className="rank-info">
                <p className="rank-title">{song.title}</p>
                <p className="rank-album">{song.album}</p>
              </div>
              <div className="rank-controls">
                <button
                  className="rank-btn"
                  onClick={() => moveUp(song.id)}
                  disabled={idx === 0}
                  aria-label="Move up"
                >
                  ↑
                </button>
                <button
                  className="rank-btn"
                  onClick={() => moveDown(song.id)}
                  disabled={idx === rankedSongs.length - 1}
                  aria-label="Move down"
                >
                  ↓
                </button>
                <button
                  className="rank-btn rank-btn--remove"
                  onClick={() => removeFromRanking(song.id)}
                  aria-label="Remove from ranking"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <div className="rank-empty">
          <p className="rank-empty-icon">🏆</p>
          <p className="rank-empty-title">Your ranking is empty</p>
          <p className="text-muted">Add songs from the list below to get started.</p>
        </div>
      )}

      {/* ── Add Songs ─────────────────────────────────────────────── */}
      <div className="add-songs-header">
        <h2 className="section-title">Add Songs</h2>
        <p className="text-muted">{unranked.length} unranked</p>
      </div>

      <input
        className="input rank-search"
        type="search"
        placeholder="Search songs or albums…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {unranked.length > 0 ? (
        <ul className="unranked-list">
          {unranked.map((song) => (
            <li key={song.id} className="unranked-item">
              <MiniArt song={song} />
              <div className="rank-info">
                <p className="rank-title">{song.title}</p>
                <p className="rank-album">{song.album}</p>
              </div>
              <button
                className="btn-ghost rank-add-btn"
                onClick={() => addToRanking(song.id)}
              >
                + Add
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted rank-all-done">
          {query ? 'No songs match your search.' : 'All songs have been ranked!'}
        </p>
      )}

    </div>
  )
}
