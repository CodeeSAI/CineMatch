import { useState, useEffect, useCallback } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Menu, Search, Heart, Bookmark } from 'lucide-react'
import { Logo } from '../ui/Logo'
import { MobileMenu } from './MobileMenu'
import { useLibrary } from '../../context/LibraryContext'
import { getProfile } from '../../services/storage/profile'

const MAIN_NAV = [
  { to: '/',         label: 'Home'     },
  { to: '/discover', label: 'Discover' },
  { to: '/genres',   label: 'Genres'   },
]

export function Navbar() {
  const navigate = useNavigate()
  const { favorites, watchlist } = useLibrary()
  const profile = getProfile()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const openMenu = useCallback(() => setMobileOpen(true), [])
  const closeMenu = useCallback(() => setMobileOpen(false), [])

  // Listen to window scroll — more opaque after scrolling 20px
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = searchQuery.trim()
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`)
      setSearchQuery('')
    }
  }

  // Profile initials
  const initials = (profile.displayName.trim() || 'U')
    .slice(0, 2)
    .toUpperCase()

  return (
    <>
      {/* Sticky container providing the floating gap from top */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          padding: '10px 16px 6px',
          width: '100%',
          pointerEvents: 'none',
        }}
      >
        <header
          className={scrolled ? 'glass-strong' : 'glass'}
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            borderRadius: 16,
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            pointerEvents: 'auto',
            background: scrolled
              ? 'rgba(14, 16, 24, 0.90)'
              : 'rgba(14, 16, 24, 0.72)',
            boxShadow: scrolled
              ? '0 12px 36px rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.14)'
              : '0 8px 30px rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
            transition: 'background var(--duration-base) ease, box-shadow var(--duration-base) ease, border-color var(--duration-base) ease',
          }}
        >
          {/* Skip to content (accessibility) */}
          <a
            href="#main-content"
            style={{
              position: 'absolute',
              top: -100,
              left: 20,
              padding: '8px 14px',
              background: 'var(--color-accent)',
              color: 'var(--color-text-on-accent)',
              borderRadius: 'var(--radius-btn)',
              fontWeight: 600,
              fontSize: 13,
              textDecoration: 'none',
              zIndex: 100,
              transition: 'top var(--duration-fast)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.top = '12px'
            }}
            onBlur={(e) => {
              e.currentTarget.style.top = '-100px'
            }}
          >
            Skip to content
          </a>

          {/* Left section: Logo + Primary Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            <NavLink
              to="/"
              aria-label="CineMatch — Home"
              style={{
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0,
                textDecoration: 'none',
              }}
            >
              <Logo size={26} />
            </NavLink>

            {/* Desktop Navigation Links with Gold Indicator */}
            <nav
              aria-label="Main navigation"
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              className="hidden-mobile"
            >
              {MAIN_NAV.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  style={({ isActive }) => ({
                    position: 'relative',
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-btn)',
                    textDecoration: 'none',
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'var(--color-accent)' : 'var(--color-muted)',
                    transition:
                      'color var(--duration-fast) ease, background var(--duration-fast) ease',
                  })}
                >
                  {({ isActive }) => (
                    <>
                      <span>{label}</span>
                      {isActive && (
                        <span
                          style={{
                            position: 'absolute',
                            bottom: 2,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 18,
                            height: 2.5,
                            borderRadius: 2,
                            background: 'var(--color-accent)',
                            boxShadow: '0 0 8px var(--color-accent)',
                          }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Right section: Search + Icons + Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Compact Search Box (Desktop) */}
            <form
              onSubmit={handleSearchSubmit}
              role="search"
              aria-label="Quick search"
              className="hidden-mobile"
              style={{ position: 'relative', width: 190 }}
            >
              <Search
                size={14}
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-muted)',
                  pointerEvents: 'none',
                }}
              />
              <input
                type="search"
                placeholder="Search movies…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  height: 36,
                  padding: '0 12px 0 34px',
                  borderRadius: 'var(--radius-pill)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--color-glass-border)',
                  color: 'var(--color-text)',
                  fontSize: 13,
                  outline: 'none',
                  transition: 'all var(--duration-fast) ease',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-accent)'
                  e.currentTarget.style.background = 'rgba(14, 16, 24, 0.95)'
                  e.currentTarget.style.boxShadow =
                    '0 0 0 3px rgba(242, 179, 61, 0.25)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-glass-border)'
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </form>

            {/* Favorites Icon with Count Badge */}
            <NavLink
              to="/favorites"
              aria-label={`Favourites (${favorites.length} saved)`}
              className="btn-icon hidden-mobile"
              style={{ position: 'relative' }}
            >
              <Heart
                size={16}
                fill={favorites.length > 0 ? 'currentColor' : 'none'}
                color={favorites.length > 0 ? 'var(--color-rose)' : 'currentColor'}
              />
              {favorites.length > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: -3,
                    right: -3,
                    minWidth: 16,
                    height: 16,
                    padding: '0 4px',
                    borderRadius: 'var(--radius-pill)',
                    background: 'var(--color-rose)',
                    color: '#FFF',
                    fontSize: 10,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
                  }}
                >
                  {favorites.length}
                </span>
              )}
            </NavLink>

            {/* Watchlist Icon with Count Badge */}
            <NavLink
              to="/watchlist"
              aria-label={`Watchlist (${watchlist.length} saved)`}
              className="btn-icon hidden-mobile"
              style={{ position: 'relative' }}
            >
              <Bookmark
                size={16}
                fill={watchlist.length > 0 ? 'currentColor' : 'none'}
                color={watchlist.length > 0 ? 'var(--color-accent)' : 'currentColor'}
              />
              {watchlist.length > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: -3,
                    right: -3,
                    minWidth: 16,
                    height: 16,
                    padding: '0 4px',
                    borderRadius: 'var(--radius-pill)',
                    background: 'var(--color-accent)',
                    color: '#1A1204',
                    fontSize: 10,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
                  }}
                >
                  {watchlist.length}
                </span>
              )}
            </NavLink>

            {/* Avatar linking to /profile */}
            <NavLink
              to="/profile"
              aria-label={`Profile — ${profile.displayName}`}
              className="hidden-mobile"
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: profile.avatarColor || 'var(--color-accent)',
                color: '#1A1204',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 700,
                textDecoration: 'none',
                border: '1.5px solid rgba(255, 255, 255, 0.28)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                marginLeft: 4,
                transition: 'transform var(--duration-fast) ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.08)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              {initials}
            </NavLink>

            {/* Mobile Search Button — visible only on mobile, navigates to /search */}
            <button
              onClick={() => navigate('/search')}
              aria-label="Search"
              className="btn-icon show-mobile"
              style={{ display: 'none' }}
            >
              <Search size={18} />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={openMenu}
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              className="btn-icon show-mobile"
              style={{ display: 'none' }}
            >
              <Menu size={20} />
            </button>
          </div>
        </header>
      </div>

      <MobileMenu isOpen={mobileOpen} onClose={closeMenu} />

      {/* Show/Hide responsive helper */}
      <style>{`
        @media (max-width: 680px) {
          .hidden-mobile { display: none !important; }
          .show-mobile   { display: inline-flex !important; }
        }
      `}</style>
    </>
  )
}
