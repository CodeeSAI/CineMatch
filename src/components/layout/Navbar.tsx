import { useState, useEffect, useCallback } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Menu, Search, Heart, Bookmark } from 'lucide-react'
import { Logo } from '../ui/Logo'
import { MobileMenu } from './MobileMenu'
import { useLibrary } from '../../context/LibraryContext'
import { getProfile } from '../../services/storage/profile'

const MAIN_NAV = [
  { to: '/',         label: 'Home'          },
  { to: '/discover', label: 'Discover'      },
  { to: '/genres',   label: 'Genres'        },
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
        className="navbar-container"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          width: '100%',
          pointerEvents: 'none',
        }}
      >
        <header
          className={`navbar-header ${scrolled ? 'glass-strong' : 'glass'}`}
          style={{
            borderRadius: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pointerEvents: 'auto',
            background: scrolled
              ? 'rgba(10, 12, 18, 0.85)'
              : 'rgba(10, 12, 18, 0.45)',
            boxShadow: scrolled
              ? '0 16px 40px rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.12)'
              : '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
            border: scrolled ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.06)',
            transition: 'background var(--duration-base) ease, box-shadow var(--duration-base) ease, border-color var(--duration-base) ease',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
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
              <Logo size={28} />
            </NavLink>

            {/* Desktop Navigation Links with Sliding Gradient Underline */}
            <nav
              aria-label="Main navigation"
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              className="hidden-mobile"
            >
              {MAIN_NAV.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  style={({ isActive }) => ({
                    position: 'relative',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-btn)',
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#FFFFFF' : 'var(--text-muted)',
                    transition: 'color var(--duration-fast) ease, background var(--duration-fast) ease',
                    textDecoration: 'none',
                  })}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.classList.contains('active')) {
                      e.currentTarget.style.color = '#FFFFFF'
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.currentTarget.classList.contains('active')) {
                      e.currentTarget.style.color = 'var(--text-muted)'
                      e.currentTarget.style.background = 'transparent'
                    }
                  }}
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Right section: Search + Icons + Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Compact Search Box (Desktop) */}
            <form
              onSubmit={handleSearchSubmit}
              role="search"
              aria-label="Quick search"
              className="hidden-mobile"
              style={{ position: 'relative', width: 260 }}
            >
              <Search
                size={15}
                style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  pointerEvents: 'none',
                  transition: 'color var(--duration-fast) ease',
                }}
              />
              <input
                type="search"
                placeholder="Search movies, actors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="navbar-search-input"
                style={{
                  width: '100%',
                  height: 38,
                  padding: '0 16px 0 38px',
                  borderRadius: 'var(--radius-pill)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: 'var(--text-primary)',
                  fontSize: 13,
                  fontWeight: 500,
                  outline: 'none',
                  transition: 'all var(--duration-fast) ease',
                  boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.2)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)'
                  e.currentTarget.style.background = 'rgba(20, 24, 34, 0.95)'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.15), inset 0 1px 2px rgba(0, 0, 0, 0.2)'
                  const icon = e.currentTarget.previousElementSibling as HTMLElement
                  if (icon) icon.style.color = '#3B82F6'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'
                  e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(0, 0, 0, 0.2)'
                  const icon = e.currentTarget.previousElementSibling as HTMLElement
                  if (icon) icon.style.color = 'var(--text-muted)'
                }}
              />
            </form>

            <div style={{ width: 1, height: 20, background: 'rgba(255, 255, 255, 0.1)' }} className="hidden-mobile" />

            {/* Favorites Icon with Gradient Count Badge */}
            <NavLink
              to="/favorites"
              aria-label={`Favorites (${favorites.length} saved)`}
              className="btn-icon hidden-mobile"
              style={{ position: 'relative' }}
            >
              <Heart
                size={18}
                fill={favorites.length > 0 ? 'currentColor' : 'none'}
                color={favorites.length > 0 ? 'var(--color-crimson)' : 'currentColor'}
              />
              {favorites.length > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    minWidth: 18,
                    height: 18,
                    padding: '0 5px',
                    borderRadius: 'var(--radius-pill)',
                    background: 'var(--grad-hot)',
                    color: '#FFFFFF',
                    fontSize: 10,
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.6)',
                  }}
                >
                  {favorites.length}
                </span>
              )}
            </NavLink>

            {/* Watchlist Icon with Gradient Count Badge */}
            <NavLink
              to="/watchlist"
              aria-label={`Watchlist (${watchlist.length} saved)`}
              className="btn-icon hidden-mobile"
              style={{ position: 'relative' }}
            >
              <Bookmark
                size={18}
                fill={watchlist.length > 0 ? 'currentColor' : 'none'}
                color={watchlist.length > 0 ? 'var(--color-sky)' : 'currentColor'}
              />
              {watchlist.length > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    minWidth: 18,
                    height: 18,
                    padding: '0 5px',
                    borderRadius: 'var(--radius-pill)',
                    background: 'var(--grad-cool)',
                    color: '#FFFFFF',
                    fontSize: 10,
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(56, 189, 248, 0.6)',
                  }}
                >
                  {watchlist.length}
                </span>
              )}
            </NavLink>

            {/* Avatar with Premium Ring linking to /profile */}
            <div className="avatar-premium-ring hidden-mobile" style={{ marginLeft: 8 }}>
              <NavLink
                to="/profile"
                aria-label={`Profile — ${profile.displayName}`}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: profile.avatarColor || 'var(--color-accent)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 800,
                  textDecoration: 'none',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                  transition: 'border-color var(--duration-fast) ease, transform var(--duration-fast) ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'
                  e.currentTarget.style.transform = 'scale(1.05)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                {initials}
              </NavLink>
            </div>

            {/* Mobile Search Button — visible only on mobile, navigates to /search */}
            <button
              onClick={() => navigate('/search')}
              aria-label="Search"
              className="btn-icon show-mobile"
              style={{
                display: 'none',
                width: 44,
                height: 44,
                minWidth: 44,
                minHeight: 44,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
              }}
            >
              <Search size={19} />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={openMenu}
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              className="btn-icon show-mobile"
              style={{
                display: 'none',
                width: 44,
                height: 44,
                minWidth: 44,
                minHeight: 44,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
              }}
            >
              <Menu size={22} />
            </button>
          </div>
        </header>
      </div>

      <MobileMenu isOpen={mobileOpen} onClose={closeMenu} />

      {/* Show/Hide responsive helper and custom active nav styling */}
      <style>{`
        .navbar-container {
          padding: 16px 24px 8px;
        }
        .navbar-header {
          max-width: 1400px;
          margin: 0 auto;
          height: 64px;
          padding: 0 24px;
        }
        @media (max-width: 768px) {
          .navbar-container {
            padding: 0 !important;
          }
          .navbar-header {
            width: calc(100% - 24px) !important;
            margin: 12px auto !important;
            height: 64px !important;
            padding: 0 16px !important;
          }
          .hidden-mobile { display: none !important; }
          .show-mobile   { display: inline-flex !important; }
        }
        
        .nav-link.active {
          background: rgba(255, 255, 255, 0.08) !important;
          color: #FFFFFF !important;
          box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </>
  )
}
