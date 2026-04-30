import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import {
  getReviews,
  addReview    as serviceAdd,
  updateReview as serviceUpdate,
  deleteReview as serviceDelete,
} from '../services/reviewsService'

const ReviewsContext = createContext(null)

export function ReviewsProvider({ children }) {
  const { currentUser }     = useAuth()
  const [reviews, setReviews] = useState([])

  // Load all reviews once on mount — reviews are public so no user dependency
  useEffect(() => {
    getReviews().then(({ data }) => setReviews(data.reviews))
  }, [])

  /** Reviews for a specific song, newest first */
  function getReviewsForSong(songId) {
    return reviews
      .filter((r) => r.songId === songId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  /** The current user's review for a song, or undefined */
  function getMyReview(songId) {
    if (!currentUser) return undefined
    return reviews.find((r) => r.songId === songId && r.userId === currentUser.id)
  }

  async function addReview(songId, rating, body) {
    if (!currentUser) return { error: { message: 'Must be logged in.' } }
    const { data, error } = await serviceAdd(
      currentUser.id, currentUser.username, songId, rating, body
    )
    if (data?.review) setReviews((prev) => [...prev, data.review])
    return { data, error }
  }

  async function updateReview(reviewId, rating, body) {
    if (!currentUser) return { error: { message: 'Must be logged in.' } }
    const { data, error } = await serviceUpdate(reviewId, currentUser.id, rating, body)
    if (data?.review) {
      setReviews((prev) => prev.map((r) => r.id === reviewId ? data.review : r))
    }
    return { data, error }
  }

  async function deleteReview(reviewId) {
    if (!currentUser) return { error: { message: 'Must be logged in.' } }
    const { error } = await serviceDelete(reviewId, currentUser.id)
    if (!error) setReviews((prev) => prev.filter((r) => r.id !== reviewId))
    return { error }
  }

  return (
    <ReviewsContext.Provider
      value={{ reviews, getReviewsForSong, getMyReview, addReview, updateReview, deleteReview }}
    >
      {children}
    </ReviewsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useReviews() {
  const ctx = useContext(ReviewsContext)
  if (!ctx) throw new Error('useReviews must be used inside <ReviewsProvider>')
  return ctx
}
