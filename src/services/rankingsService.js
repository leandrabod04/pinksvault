// rankingsService.js — Phase 1: localStorage implementation
//
// Return shape matches the Supabase pattern: { data, error }
// Phase 2 swap: replace each function body with supabase.from('rankings') queries.
//   getRankings  → SELECT song_id, position WHERE user_id = ? ORDER BY position
//   saveRankings → DELETE existing rows, then INSERT new rows with positions
// The function signatures and return shapes must not change.
//
// Storage: pv_rankings → { [userId]: [songId, songId, ...] }
//   Array index = rank position (index 0 = rank #1)

const RANKINGS_KEY = 'pv_rankings'

function readAll() {
  return JSON.parse(localStorage.getItem(RANKINGS_KEY) ?? '{}')
}

function writeAll(all) {
  localStorage.setItem(RANKINGS_KEY, JSON.stringify(all))
}

/**
 * Get the user's ranked song IDs in order (index 0 = rank #1).
 * @returns {{ data: { rankings: string[] }, error: null }}
 */
export async function getRankings(userId) {
  const all = readAll()
  return { data: { rankings: all[userId] ?? [] }, error: null }
}

/**
 * Get every user's rankings as a map { [userId]: [songId, ...] }.
 * Used by the Community page to compute aggregate scores.
 * Phase 2 swap: SELECT user_id, song_id, position FROM rankings ORDER BY position
 * @returns {{ data: { rankings: Object }, error: null }}
 */
export async function getAllRankings() {
  return { data: { rankings: readAll() }, error: null }
}

/**
 * Persist the full ordered rankings array for a user.
 * Replaces any previously saved rankings.
 * @param {string}   userId
 * @param {string[]} rankedSongIds  — ordered array, index 0 = rank #1
 * @returns {{ data: { rankings: string[] }, error: null }}
 */
export async function saveRankings(userId, rankedSongIds) {
  const all = readAll()
  all[userId] = rankedSongIds
  writeAll(all)
  return { data: { rankings: rankedSongIds }, error: null }
}
