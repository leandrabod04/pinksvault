import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth }    from '../context/AuthContext'
import { useReviews } from '../context/ReviewsContext'
import { songs }      from '../data/songs'
import StarRating     from '../components/StarRating'
import './ReviewsPage.css'

// ── Review form (write or edit) ───────────────────────────────────────────────
function ReviewForm({ songId, existing, onDone }) {
  const { addReview, updateReview } = useReviews()

  const [rating,  setRating]  = useState(existing?.rating ?? 0)
  const [body,    setBody]    = useState(existing?.body   ?? '')
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const isEditing = Boolean(existing)

  async function handleSubmit(e) {
    e.preventDefault()
    if (rating === 0) { setError('Please select a star rating.'); return }
    if (!body.trim()) { setError('Please write something before submitting.'); return }

    setError('')
    setLoading(true)

    const { error } = isEditing
      ? await updateReview(existing.id, rating, body)
      : await addReview(songId, rating, body)

    setLoading(false)
    if (error) { setError(error.message); return }
    onDone()
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <div className="review-form-stars">
        <StarRating value={rating} onChange={setRating} />
        {rating > 0 && (
          <span className="text-muted review-rating-label">{rating}/5</span>
        )}
      </div>

      <textarea
        className="input review-textarea"
        placeholder="What do you think of this song?"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
      />

      {error && <p className="review-form-error">{error}</p>}

      <div className="review-form-actions">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving…' : isEditing ? 'Save Changes' : 'Post Review'}
        </button>
        {isEditing && (
          <button type="button" className="btn-ghost" onClick={onDone}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

// ── Single review card ────────────────────────────────────────────────────────
function ReviewCard({ review, onEdit, onDelete }) {
  const { currentUser } = useAuth()
  const isOwner = currentUser?.id === review.userId

  const date = new Date(review.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })

  return (
    <div className="review-card">
      <div className="review-card-header">
        <div>
          <span className="review-username">{review.username}</span>
          <span className="text-muted review-date"> · {date}</span>
        </div>
        <StarRating value={review.rating} readOnly size="sm" />
      </div>

      {review.body && <p className="review-body">{review.body}</p>}

      {isOwner && (
        <div className="review-card-actions">
          <button className="review-action-btn" onClick={onEdit}>Edit</button>
          <button className="review-action-btn review-action-btn--delete" onClick={onDelete}>
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

// ── Review panel (right column) ───────────────────────────────────────────────
function ReviewPanel({ song }) {
  const { currentUser }                            = useAuth()
  const { getReviewsForSong, getMyReview, deleteReview } = useReviews()

  const [editingId, setEditingId] = useState(null)

  const songReviews = getReviewsForSong(song.id)
  const myReview    = getMyReview(song.id)

  async function handleDelete(reviewId) {
    if (!window.confirm('Delete your review?')) return
    await deleteReview(reviewId)
  }

  return (
    <div className="review-panel">
      {/* Selected song header */}
      <div className="review-panel-song">
        <div
          className="review-panel-art"
          style={song.albumArt
            ? { backgroundImage: `url(${song.albumArt})` }
            : { background: `linear-gradient(135deg, ${song.albumColor}, #0a0a0a)` }
          }
        >
          {!song.albumArt && (
            <span className="review-panel-art-initial">{song.title.charAt(0)}</span>
          )}
        </div>
        <div>
          <p className="review-panel-title">{song.title}</p>
          <p className="text-muted">{song.album} · {song.year}</p>
        </div>
      </div>

      {/* Write / edit section */}
      {editingId ? (
        <>
          <h3 className="review-section-label">Edit Your Review</h3>
          <ReviewForm
            songId={song.id}
            existing={myReview}
            onDone={() => setEditingId(null)}
          />
        </>
      ) : myReview ? (
        <>
          <h3 className="review-section-label">Your Review</h3>
          <ReviewCard
            review={myReview}
            onEdit={() => setEditingId(myReview.id)}
            onDelete={() => handleDelete(myReview.id)}
          />
        </>
      ) : currentUser ? (
        <>
          <h3 className="review-section-label">Write a Review</h3>
          <ReviewForm songId={song.id} onDone={() => {}} />
        </>
      ) : null}

      {/* Community reviews */}
      {songReviews.filter((r) => r.userId !== currentUser?.id).length > 0 && (
        <>
          <h3 className="review-section-label" style={{ marginTop: '1.5rem' }}>
            Community Reviews
            <span className="text-muted" style={{ marginLeft: '0.5rem', fontWeight: 400 }}>
              ({songReviews.filter((r) => r.userId !== currentUser?.id).length})
            </span>
          </h3>
          <div className="review-list">
            {songReviews
              .filter((r) => r.userId !== currentUser?.id)
              .map((r) => (
                <ReviewCard
                  key={r.id}
                  review={r}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              ))}
          </div>
        </>
      )}

      {songReviews.length === 0 && (
        <p className="text-muted review-none">No reviews yet — be the first!</p>
      )}
    </div>
  )
}

// ── Page root ─────────────────────────────────────────────────────────────────
export default function ReviewsPage() {
  const [query, setQuery] = useState('')

  // Persist selected song in the URL so it survives navigation and refresh
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedSongId = searchParams.get('song')
  const selectedSong   = songs.find((s) => s.id === selectedSongId) ?? null

  function selectSong(song) {
    setSearchParams({ song: song.id })
  }

  const filtered = songs.filter(
    (s) =>
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.album.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="page-content">
      <h1 className="section-title" style={{ marginBottom: '1.25rem' }}>Reviews</h1>

      <div className="reviews-layout">
        {/* ── Left: song picker ── */}
        <aside className="song-picker">
          <input
            className="input"
            type="search"
            placeholder="Search songs…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <ul className="song-picker-list">
            {filtered.map((song) => (
              <li key={song.id}>
                <button
                  className={`song-picker-item${selectedSong?.id === song.id ? ' selected' : ''}`}
                  onClick={() => selectSong(song)}
                >
                  <div
                    className="picker-art"
                    style={song.albumArt
                      ? { backgroundImage: `url(${song.albumArt})` }
                      : { background: `linear-gradient(135deg, ${song.albumColor}, #0a0a0a)` }
                    }
                  />
                  <div className="picker-info">
                    <p className="picker-title">{song.title}</p>
                    <p className="picker-album">{song.album}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* ── Right: review panel ── */}
        <div className="reviews-main">
          {selectedSong ? (
            <ReviewPanel key={selectedSong.id} song={selectedSong} />
          ) : (
            <div className="reviews-placeholder">
              <p className="reviews-placeholder-icon">✍</p>
              <p className="reviews-placeholder-title">Select a song</p>
              <p className="text-muted">Choose any song on the left to read reviews or write your own.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
