// reviewsService.js — Phase 2: Supabase implementation
//
// Function signatures and return shapes are identical to the Phase 1
// localStorage version so ReviewsContext and ReviewsPage need no changes.
//
// Review shape the rest of the app expects (camelCase):
//   { id, userId, username, songId, rating, body, createdAt, updatedAt }
//
// Supabase returns snake_case columns — normalizeReview() maps them before
// anything leaves this file.
//
// Ownership is enforced at two levels:
//   1. RLS policies on the reviews table (server-enforced)
//   2. .eq('user_id', userId) filter on UPDATE/DELETE (belt-and-suspenders)

import { supabase } from '../lib/supabase'

// ─── helper ───────────────────────────────────────────────────────────────────

function normalizeReview(row) {
  return {
    id:        row.id,
    userId:    row.user_id,
    username:  row.username,
    songId:    row.song_id,
    rating:    row.rating,
    body:      row.body ?? '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

// ─── public API ───────────────────────────────────────────────────────────────

/**
 * Get every review across all songs, newest first.
 * Called once on ReviewsProvider mount — publicly readable via RLS.
 * @returns {{ data: { reviews: Review[] }, error: null }}
 */
export async function getReviews() {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return { data: null, error: { message: error.message } }

  return { data: { reviews: data.map(normalizeReview) }, error: null }
}

/**
 * Add a new review.
 * The unique(user_id, song_id) constraint enforces one review per user per song.
 * A Postgres error code 23505 (unique violation) is translated to a
 * user-friendly message instead of surfacing the raw DB error.
 * @returns {{ data: { review: Review } | null, error: { message } | null }}
 */
export async function addReview(userId, username, songId, rating, body) {
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      user_id:  userId,
      username,
      song_id:  songId,
      rating,
      body:     body.trim(),
    })
    .select()
    .single()

  if (error) {
    const message = error.code === '23505'
      ? 'You have already reviewed this song.'
      : error.message
    return { data: null, error: { message } }
  }

  return { data: { review: normalizeReview(data) }, error: null }
}

/**
 * Update an existing review's rating and body.
 * Ownership enforced by both RLS and the user_id filter.
 * updated_at is set explicitly because the table has no auto-update trigger.
 * @returns {{ data: { review: Review } | null, error: { message } | null }}
 */
export async function updateReview(reviewId, userId, rating, body) {
  const { data, error } = await supabase
    .from('reviews')
    .update({
      rating,
      body:       body.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq('id',      reviewId)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) return { data: null, error: { message: error.message } }

  return { data: { review: normalizeReview(data) }, error: null }
}

/**
 * Delete a review.
 * Ownership enforced by both RLS and the user_id filter.
 * @returns {{ data: null, error: { message } | null }}
 */
export async function deleteReview(reviewId, userId) {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id',      reviewId)
    .eq('user_id', userId)

  if (error) return { data: null, error: { message: error.message } }

  return { data: null, error: null }
}
