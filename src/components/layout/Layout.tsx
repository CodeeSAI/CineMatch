import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  title?: string
}

/** Wraps every page with Navbar, main content area, and Footer */
export function Layout({ children, title }: Props) {
  const location = useLocation()

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])

  // Update document title
  useEffect(() => {
    document.title = title ? `${title} — CineMatch` : 'CineMatch'
  }, [title])

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main
        id="main-content"
        className="page-enter"
        style={{ flex: 1 }}
        // Key forces re-animation on route change
        key={location.pathname}
      >
        {children}
      </main>
      <Footer />
    </div>
  )
}
