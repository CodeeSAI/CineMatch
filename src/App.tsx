import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LibraryProvider } from './context/LibraryContext'
import { GenresProvider } from './context/GenresContext'
import { SetupRequired } from './components/ui/SetupRequired'

// Pages
import HomePage         from './pages/Home'
import DiscoverPage     from './pages/Discover'
import SearchPage       from './pages/Search'
import GenresPage       from './pages/Genres'
import GenreMoviesPage  from './pages/GenreMovies'
import MovieDetailsPage from './pages/MovieDetails'
import FavoritesPage    from './pages/Favorites'
import WatchlistPage    from './pages/Watchlist'
import ProfilePage      from './pages/Profile'
import NotFoundPage     from './pages/NotFound'

// Check for API key before rendering anything
const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string | undefined

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"             element={<HomePage />} />
        <Route path="/discover"     element={<DiscoverPage />} />
        <Route path="/search"       element={<SearchPage />} />
        <Route path="/genres"       element={<GenresPage />} />
        <Route path="/genres/:id"   element={<GenreMoviesPage />} />
        <Route path="/movie/:id"    element={<MovieDetailsPage />} />
        <Route path="/favorites"    element={<FavoritesPage />} />
        <Route path="/watchlist"    element={<WatchlistPage />} />
        <Route path="/profile"      element={<ProfilePage />} />
        <Route path="*"             element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default function App() {
  // Show setup screen if API key is missing — no fake data shown
  if (!API_KEY || API_KEY === 'your_tmdb_api_key_here') {
    return <SetupRequired />
  }

  return (
    <LibraryProvider>
      <GenresProvider>
        <AppRoutes />
      </GenresProvider>
    </LibraryProvider>
  )
}
