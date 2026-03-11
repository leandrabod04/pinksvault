import { useEffect, useState } from 'react'
import { getAllRankings } from '../services/rankingsService'
import { songs }          from '../data/songs'
import './CommunityPage.css'

// ── Scoring ───────────────────────────────────────────────────────────────────
//
// Borda count: for a user who ranked n songs, their #1 pick gets n points,
// #2 gets n-1, … last gets 1. Totals are summed across every user.
// This rewards songs that appear high in many users' lists, not just any list.
//
// Phase 2 note: replace getAllRankings() with a Supabase query:
//   SELECT user_id, song_id, position FROM rankings ORDER BY user_id, position

function computeLeaderboard(allRankings) {
  // allRankings = { [userId]: [songId, ...] }
  const scores = {} // songId → { totalScore, fanCount }

  Object.values(allRankings).forEach((rankedIds) => {
    const n = rankedIds.length
    rankedIds.forEach((songId, idx) => {
      if (!scores[songId]) scores[songId] = { totalScore: 0, fanCount: 0 }
      scores[songId].totalScore += n - idx   // top slot = n pts, last = 1 pt
      scores[songId].fanCount   += 1
    })
  })

  const ranked = songs
    .filter((s)  => scores[s.id])
    .map((s)     => ({ ...s, ...scores[s.id] }))
    .sort((a, b) => b.totalScore - a.totalScore)

  const maxScore = ranked[0]?.totalScore ?? 1
  return ranked.map((s) => ({ ...s, scorePct: Math.round((s.totalScore / maxScore) * 100) }))
}

// ── Rank badge colours ────────────────────────────────────────────────────────
function rankStyle(position) {
  if (position === 1) return { color: '#f5c518' }           // gold
  if (position === 2) return { color: '#aaaaaa' }           // silver
  if (position === 3) return { color: '#cd7f32' }           // bronze
  return {}
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CommunityPage() {
  const [leaderboard, setLeaderboard] = useState([])
  const [userCount,   setUserCount]   = useState(0)
  const [loading,     setLoading]     = useState(true)

  useEffect(() => {
    getAllRankings().then(({ data }) => {
      const allRankings = data.rankings
      setUserCount(Object.keys(allRankings).length)
      setLeaderboard(computeLeaderboard(allRankings))
      setLoading(false)
    })
  }, [])

  if (loading) return null

  return (
    <div className="page-content">
      {/* Header */}
      <div className="community-header">
        <h1 className="section-title">Community Rankings</h1>
        <p className="text-muted community-meta">
          {userCount > 0
            ? `Aggregated from ${userCount} fan${userCount !== 1 ? 's' : ''} · ${leaderboard.length} songs ranked`
            : 'No rankings yet'}
        </p>
      </div>

      {/* Explanation pill */}
      {leaderboard.length > 0 && (
        <p className="community-method text-muted">
          Scored by Borda count — higher placement in personal rankings earns more points.
        </p>
      )}

      {leaderboard.length > 0 ? (
        <ol className="community-list">
          {leaderboard.map((song, idx) => {
            const position = idx + 1
            return (
              <li key={song.id} className="community-item">
                {/* Rank number */}
                <span className="community-rank" style={rankStyle(position)}>
                  #{position}
                </span>

                {/* Album art */}
                <div
                  className="community-art"
                  style={song.albumArt
                    ? { backgroundImage: `url(${song.albumArt})` }
                    : { background: `linear-gradient(135deg, ${song.albumColor}, #0a0a0a)` }
                  }
                >
                  {!song.albumArt && (
                    <span className="community-art-initial">{song.title.charAt(0)}</span>
                  )}
                </div>

                {/* Song info + score bar */}
                <div className="community-info">
                  <p className="community-title">{song.title}</p>
                  <p className="community-album">{song.album}</p>
                  <div className="score-bar-track">
                    <div
                      className="score-bar-fill"
                      style={{ width: `${song.scorePct}%` }}
                    />
                  </div>
                </div>

                {/* Fan count */}
                <div className="community-stats">
                  <span className="community-fans">{song.fanCount}</span>
                  <span className="text-muted community-fans-label">
                    {song.fanCount === 1 ? 'fan' : 'fans'}
                  </span>
                </div>
              </li>
            )
          })}
        </ol>
      ) : (
        <div className="community-empty">
          <p className="community-empty-icon">🌐</p>
          <p className="community-empty-title">No community rankings yet</p>
          <p className="text-muted">
            Be the first — head to the Rankings page and rank some songs.
          </p>
        </div>
      )}
    </div>
  )
}
