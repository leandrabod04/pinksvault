// rankingsService.js — Phase 2: Supabase implementation
//
// Function signatures and return shapes are identical to the Phase 1
// localStorage version so RankingsContext and CommunityPage need no changes.
//
// Return shape:
//   getRankings    → { data: { rankings: string[] }, error }
//   saveRankings   → { data: { rankings: string[] }, error }
//   getAllRankings  → { data: { rankings: { [userId]: string[] } }, error }
//
// Positions are stored as 0-based integers matching the array index,
// consistent with the localStorage version (index 0 = rank #1).

import { supabase } from '../lib/supabase'

/**
 * Get the current user's ranked song IDs in order (index 0 = rank #1).
 * @returns {{ data: { rankings: string[] }, error: null }}
 */
export async function getRankings(userId) {
  const { data, error } = await supabase
    .from('rankings')
    .select('song_id, position')
    .eq('user_id', userId)
    .order('position', { ascending: true })

  if (error) return { data: null, error: { message: error.message } }

  const rankings = data.map((row) => row.song_id)
  return { data: { rankings }, error: null }
}

/**
 * Replace all rankings for a user with the new ordered array.
 * Uses delete + insert because there is no partial-update operation that
 * cleanly handles reordering with the unique(user_id, position) constraint.
 *
 * @param {string}   userId
 * @param {string[]} rankedSongIds — full ordered array, index 0 = rank #1
 * @returns {{ data: { rankings: string[] }, error: null }}
 */
export async function saveRankings(userId, rankedSongIds) {
  // Step 1: remove all existing rows for this user
  const { error: deleteError } = await supabase
    .from('rankings')
    .delete()
    .eq('user_id', userId)

  if (deleteError) return { data: null, error: { message: deleteError.message } }

  // Step 2: if the new list is empty we are done
  if (rankedSongIds.length === 0) {
    return { data: { rankings: [] }, error: null }
  }

  // Step 3: insert each song with position = its array index
  const rows = rankedSongIds.map((songId, idx) => ({
    user_id:  userId,
    song_id:  songId,
    position: idx,
  }))

  const { error: insertError } = await supabase
    .from('rankings')
    .insert(rows)

  if (insertError) return { data: null, error: { message: insertError.message } }

  return { data: { rankings: rankedSongIds }, error: null }
}

/**
 * Get every user's rankings as { [userId]: [songId, ...] }.
 * Used by CommunityPage to compute the Borda-count leaderboard.
 * Ordering by user_id then position guarantees that when rows are pushed
 * into each user's array they arrive in the correct rank order.
 * @returns {{ data: { rankings: Object }, error: null }}
 */
export async function getAllRankings() {
  const { data, error } = await supabase
    .from('rankings')
    .select('user_id, song_id, position')
    .order('user_id',   { ascending: true })
    .order('position',  { ascending: true })

  if (error) return { data: null, error: { message: error.message } }

  // Reconstruct the map the Community page scoring function expects
  const rankings = {}
  data.forEach(({ user_id, song_id }) => {
    if (!rankings[user_id]) rankings[user_id] = []
    rankings[user_id].push(song_id)
  })

  return { data: { rankings }, error: null }
}
