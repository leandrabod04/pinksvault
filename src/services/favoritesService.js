// favoritesService.js — Phase 1: localStorage implementation
//
// Return shape matches the Supabase pattern: { data, error }
// Phase 2 swap: replace each function body with a supabase.from('favorites') query.
// The function signatures and return shapes must not change.
//
// Storage: pv_favorites → { [userId]: [songId, songId, ...] }

const FAVORITES_KEY = 'pv_favorites'

function readAll() {
  return JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? '{}')
}

function writeAll(all) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(all))
}

/**
 * Get all favorited song IDs for a user.
 * @returns {{ data: { favorites: string[] }, error: null }}
 */
export async function getFavorites(userId) {
  const all = readAll()
  return { data: { favorites: all[userId] ?? [] }, error: null }
}

/**
 * Add a song to the user's favorites. Silently ignores duplicates.
 * @returns {{ data: { favorites: string[] }, error: null }}
 */
export async function addFavorite(userId, songId) {
  const all     = readAll()
  const current = all[userId] ?? []
  if (!current.includes(songId)) {
    all[userId] = [...current, songId]
    writeAll(all)
  }
  return { data: { favorites: all[userId] }, error: null }
}

/**
 * Remove a song from the user's favorites.
 * @returns {{ data: { favorites: string[] }, error: null }}
 */
export async function removeFavorite(userId, songId) {
  const all = readAll()
  all[userId] = (all[userId] ?? []).filter((id) => id !== songId)
  writeAll(all)
  return { data: { favorites: all[userId] }, error: null }
}
