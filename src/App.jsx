import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { FavoritesProvider } from './context/FavoritesContext'
import { RankingsProvider } from './context/RankingsContext'
import { ReviewsProvider }  from './context/ReviewsContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage    from './pages/LandingPage'
import LoginPage      from './pages/LoginPage'
import SignupPage     from './pages/SignupPage'
import HomePage       from './pages/HomePage'
import RankingsPage   from './pages/RankingsPage'
import FavoritesPage  from './pages/FavoritesPage'
import ReviewsPage    from './pages/ReviewsPage'
import CommunityPage  from './pages/CommunityPage'
import ProfilePage    from './pages/ProfilePage'

function AppLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FavoritesProvider>
        <RankingsProvider>
        <ReviewsProvider>
        <Routes>
          {/* Public — standalone, no navbar */}
          <Route path="/" element={<LandingPage />} />

          {/* Public — navbar, no auth required */}
          <Route element={<AppLayout />}>
            <Route path="/login"     element={<LoginPage />} />
            <Route path="/signup"    element={<SignupPage />} />
            <Route path="/community" element={<CommunityPage />} />
          </Route>

          {/* Protected — navbar + must be logged in */}
          <Route element={<AppLayout />}>
            <Route element={<ProtectedRoute />}>
              <Route path="/home"      element={<HomePage />} />
              <Route path="/rankings"  element={<RankingsPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/reviews"   element={<ReviewsPage />} />
              <Route path="/profile"   element={<ProfilePage />} />
            </Route>
          </Route>
        </Routes>
        </ReviewsProvider>
        </RankingsProvider>
        </FavoritesProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
