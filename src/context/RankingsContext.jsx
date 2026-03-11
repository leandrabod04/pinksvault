import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { getRankings, saveRankings } from '../services/rankingsService'

const RankingsContext = createContext(null)

export function RankingsProvider({ children }) {
  const { currentUser }         = useAuth()
  const [rankedIds, setRankedIds] = useState([])

  // Load (or clear) rankings whenever the logged-in user changes
  useEffect(() => {
    if (!currentUser) {
      setRankedIds([])
      return
    }
    getRankings(currentUser.id).then(({ data }) => {
      setRankedIds(data.rankings)
    })
  }, [currentUser])

  // Persist to service and update state in one step
  async function persist(nextIds) {
    if (!currentUser) return
    await saveRankings(currentUser.id, nextIds)
    setRankedIds(nextIds)
  }

  function isRanked(songId) {
    return rankedIds.includes(songId)
  }

  // Add a song to the bottom of the ranked list
  async function addToRanking(songId) {
    if (isRanked(songId)) return
    await persist([...rankedIds, songId])
  }

  // Remove a song from the ranked list entirely
  async function removeFromRanking(songId) {
    await persist(rankedIds.filter((id) => id !== songId))
  }

  // Swap a song one position up (toward rank #1)
  async function moveUp(songId) {
    const idx = rankedIds.indexOf(songId)
    if (idx <= 0) return
    const next = [...rankedIds]
    ;[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]
    await persist(next)
  }

  // Swap a song one position down (toward last place)
  async function moveDown(songId) {
    const idx = rankedIds.indexOf(songId)
    if (idx === -1 || idx === rankedIds.length - 1) return
    const next = [...rankedIds]
    ;[next[idx], next[idx + 1]] = [next[idx + 1], next[idx]]
    await persist(next)
  }

  return (
    <RankingsContext.Provider
      value={{ rankedIds, isRanked, addToRanking, removeFromRanking, moveUp, moveDown }}
    >
      {children}
    </RankingsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRankings() {
  const ctx = useContext(RankingsContext)
  if (!ctx) throw new Error('useRankings must be used inside <RankingsProvider>')
  return ctx
}
