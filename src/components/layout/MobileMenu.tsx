import { useEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { X, Home, Compass, Grid2x2, Search, Heart, Bookmark, User } from 'lucide-react'
import { useLibrary } from '../../context/LibraryContext'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const NAV_ITEMS = [
  { to: '/',          label: 'Home',      icon: Home      },
  { to: '/discover',  label: 'Discover',  icon: Compass   },
  { to: '/genres',    label: 'Genres',    icon: Grid2x2   },
  { to: '/search',    label: 'Search',    icon: Search    },
  { to: '/favorites', label: 'Favorites', icon: Heart     },
  { to: '/watchlist', label: 'Watchlist', icon: Bookmark  },
  { to: '/profile',   label: 'Profile',   icon: User      },
]

export function MobileMenu({ isOpen, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const location = useLocation()
  const { favorites, watchlist } = useLibrary()

  // Close on route change
  useEffect(() => {
    onClose()
  }, [location.pathname, onClose])

  // Focus trap & Escape key
  useEffect(() => {
    if (!isOpen) return

    // Auto-focus close button on open
    closeBtnRef.current?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key === 'Tab' && panelRef.current) {
        const focusableEls = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        if (focusableEls.length === 0) return

        const firstEl = focusableEls[0]
        const lastEl = focusableEls[focusableEls.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault()
            lastEl.focus()
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault()
            firstEl.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Dim backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
      />

      {/* Slide-in frosted glass drawer */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="glass-strong"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 60,
          width: 280,
          background: 'rgba(14, 16, 24, 0.92)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.16)',
          boxShadow: '-8px 0 36px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 0',
        }}
      >
        {/* Close button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 20px 16px' }}>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Close navigation menu"
            className="btn-icon"
            style={{ width: 34, height: 34 }}
          >
            <X size={18} />
          </button>
        </div>

        <nav aria-label="Mobile navigation">
          <ul style={{ listStyle: 'none', padding: '0 12px', margin: 0 }}>
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
              const count =
                to === '/favorites'
                  ? favorites.length
                  : to === '/watchlist'
                  ? watchlist.length
                  : 0

              return (
                <li key={to} style={{ marginBottom: 4 }}>
                  <NavLink
                    to={to}
                    end={to === '/'}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-btn)',
                      textDecoration: 'none',
                      fontSize: 15,
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? 'var(--color-accent)' : 'var(--color-text)',
                      background: isActive ? 'rgba(242, 179, 61, 0.12)' : 'transparent',
                      border: isActive
                        ? '1px solid rgba(242, 179, 61, 0.25)'
                        : '1px solid transparent',
                      transition: 'background var(--duration-fast), color var(--duration-fast)',
                    })}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Icon size={18} />
                      {label}
                    </div>
                    {count > 0 && (
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-pill)',
                          background:
                            to === '/favorites'
                              ? 'var(--color-rose)'
                              : 'var(--color-accent)',
                          color: to === '/favorites' ? '#FFF' : '#1A1204',
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        {count}
                      </span>
                    )}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </>
  )
}
