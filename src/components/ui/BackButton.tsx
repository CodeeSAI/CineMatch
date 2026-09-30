import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

interface Props {
  /** Override the fallback route when there's no history. Defaults to '/'. */
  fallback?: string
}

/**
 * Small round glass back button.
 * Calls navigate(-1); falls back to `fallback` (default '/') when the user
 * arrived directly (no previous history entry in this session).
 */
export function BackButton({ fallback = '/' }: Props) {
  const navigate = useNavigate()

  function handleBack() {
    // history.length <= 1 means no previous page in this session
    if (window.history.length <= 1) {
      navigate(fallback, { replace: true })
    } else {
      navigate(-1)
    }
  }

  return (
    <button
      onClick={handleBack}
      aria-label="Go back"
      className="btn-icon"
      style={{
        width: 44,
        height: 44,
        minWidth: 44,
        minHeight: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <ArrowLeft size={18} />
    </button>
  )
}
