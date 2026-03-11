// reviewsService.js — Phase 1: localStorage implementation
//
// Return shape matches the Supabase pattern: { data, error }
// Phase 2 swap: replace each function body with supabase.from('reviews') queries.
//   getReviews        → SELECT * FROM reviews ORDER BY created_at DESC
//   getReviewsForSong → SELECT * FROM reviews WHERE song_id = ?
//   addReview         → INSERT INTO reviews (...)
//   updateReview      → UPDATE reviews SET ... WHERE id = ? AND user_id = ?
//   deleteReview      → DELETE FROM reviews WHERE id = ? AND user_id = ?
// The function signatures and return shapes must not change.
//
// Storage: pv_reviews → Review[]
// Review shape: { id, userId, username, songId, rating, body, createdAt, updatedAt }

const REVIEWS_KEY = 'pv_reviews'

function readAll() {
  return JSON.parse(localStorage.getItem(REVIEWS_KEY) ?? '[]')
}

function writeAll(reviews) {
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews))
}

/**
 * Get every review across all songs (used by Community page).
 * @returns {{ data: { reviews: Review[] }, error: null }}
 */
export async function getReviews() {
  return { data: { reviews: readAll() }, error: null }
}

/**
 * Get all reviews for a single song, newest first.
 * @returns {{ data: { reviews: Review[] }, error: null }}
 */
export async function getReviewsForSong(songId) {
  const reviews = readAll()
    .filter((r) => r.songId === songId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  return { data: { reviews }, error: null }
}

/**
 * Add a new review. One review per user per song is enforced.
 * @returns {{ data: { review: Review } | null, error: { message: string } | null }}
 */
export async function addReview(userId, username, songId, rating, body) {
  const all = readAll()
  const existing = all.find((r) => r.userId === userId && r.songId === songId)
  if (existing) {
    return { data: null, error: { message: 'You have already reviewed this song.' } }
  }

  const review = {
    id:        crypto.randomUUID(),
    userId,
    username,
    songId,
    rating,
    body:      body.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  writeAll([...all, review])
  return { data: { review }, error: null }
}

/**
 * Update rating and/or body of an existing review.
 * Ownership is enforced — only the review's author can update it.
 * @returns {{ data: { review: Review } | null, error: { message: string } | null }}
 */
export async function updateReview(reviewId, userId, rating, body) {
  const all = readAll()
  const idx = all.findIndex((r) => r.id === reviewId)

  if (idx === -1) return { data: null, error: { message: 'Review not found.' } }
  if (all[idx].userId !== userId) return { data: null, error: { message: 'Not authorised.' } }

  const updated = {
    ...all[idx],
    rating,
    body:      body.trim(),
    updatedAt: new Date().toISOString(),
  }
  all[idx] = updated
  writeAll(all)
  return { data: { review: updated }, error: null }
}

/**
 * Delete a review. Ownership is enforced.
 * @returns {{ data: null, error: { message: string } | null }}
 */
export async function deleteReview(reviewId, userId) {
  const all = readAll()
  const target = all.find((r) => r.id === reviewId)

  if (!target)                    return { data: null, error: { message: 'Review not found.' } }
  if (target.userId !== userId)   return { data: null, error: { message: 'Not authorised.' } }

  writeAll(all.filter((r) => r.id !== reviewId))
  return { data: null, error: null }
}
