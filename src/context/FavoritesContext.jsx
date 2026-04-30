import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from '../services/favoritesService'

const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
  const { currentUser }       = useAuth()
  const [favoriteIds, setFavoriteIds] = useState([])

  // Load (or clear) favorites whenever the logged-in user changes
  useEffect(() => {
    if (!currentUser) {
      setFavoriteIds([])
      return
    }
    getFavorites(currentUser.id).then(({ data }) => {
      setFavoriteIds(data.favorites)
    })
  }, [currentUser])

  function isFavorited(songId) {
    return favoriteIds.includes(songId)
  }

  async function toggleFavorite(songId) {
    if (!currentUser) return

    if (isFavorited(songId)) {
      const { data } = await removeFavorite(currentUser.id, songId)
      setFavoriteIds(data.favorites)
    } else {
      const { data } = await addFavorite(currentUser.id, songId)
      setFavoriteIds(data.favorites)
    }
  }

  return (
    <FavoritesContext.Provider value={{ favoriteIds, isFavorited, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used inside <FavoritesProvider>')
  return ctx
}
