// favoritesService.js — Phase 2: Supabase implementation
//
// Function signatures and return shapes are identical to the Phase 1
// localStorage version so FavoritesContext needs no changes.
//
// Return shape: { data: { favorites: string[] } | null, error: { message } | null }
// favorites is always a flat array of songId strings.

import { supabase } from '../lib/supabase'

// ─── helper ───────────────────────────────────────────────────────────────────
// Fetches the current favorites list for a user and returns it in the
// expected shape. Called internally after every mutation so the context
// always receives a fresh, authoritative array.

async function fetchFavorites(userId) {
  const { data, error } = await supabase
    .from('favorites')
    .select('song_id')
    .eq('user_id', userId)

  if (error) return { data: null, error: { message: error.message } }

  const favorites = data.map((row) => row.song_id)
  return { data: { favorites }, error: null }
}

// ─── public API ───────────────────────────────────────────────────────────────

/**
 * Get all favorited song IDs for a user.
 * @returns {{ data: { favorites: string[] }, error: null }}
 */
export async function getFavorites(userId) {
  return fetchFavorites(userId)
}

/**
 * Add a song to the user's favorites.
 * Uses ignoreDuplicates so calling it on an already-favorited song is a no-op.
 * @returns {{ data: { favorites: string[] } | null, error: { message } | null }}
 */
export async function addFavorite(userId, songId) {
  const { error } = await supabase
    .from('favorites')
    .upsert(
      { user_id: userId, song_id: songId },
      { onConflict: 'user_id,song_id', ignoreDuplicates: true }
    )

  if (error) return { data: null, error: { message: error.message } }

  return fetchFavorites(userId)
}

/**
 * Remove a song from the user's favorites.
 * @returns {{ data: { favorites: string[] } | null, error: { message } | null }}
 */
export async function removeFavorite(userId, songId) {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('song_id', songId)

  if (error) return { data: null, error: { message: error.message } }

  return fetchFavorites(userId)
}
