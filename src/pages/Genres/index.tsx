import { Link } from 'react-router-dom'
import {
  Flame,
  Compass,
  Sparkles,
  Smile,
  ShieldAlert,
  Film,
  Theater,
  Users,
  Wand2,
  BookOpen,
  Ghost,
  Music,
  Search,
  Heart,
  Rocket,
  Zap,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react'
import { Layout } from '../../components/layout/Layout'
import { useGenres } from '../../context/GenresContext'
import { getGenreColor } from '../../lib/genreColors'

interface GenreDefinition {
  name: string
  fallbackId: number
  icon: LucideIcon
  description: string
}

const GENRE_TILES: GenreDefinition[] = [
  { name: 'Action',          fallbackId: 28,    icon: Flame,       description: 'High-octane spectacles & edge-of-your-seat thrills' },
  { name: 'Adventure',       fallbackId: 12,    icon: Compass,     description: 'Epic quests, breathtaking landscapes & journeys' },
  { name: 'Animation',       fallbackId: 16,    icon: Sparkles,    description: 'Imaginative animation & visual storytelling' },
  { name: 'Comedy',          fallbackId: 35,    icon: Smile,       description: 'Laughter, clever satire & lighthearted humor' },
  { name: 'Crime',           fallbackId: 80,    icon: ShieldAlert, description: 'Underworld heists, mobsters & criminal intrigue' },
  { name: 'Documentary',     fallbackId: 99,    icon: Film,        description: 'True stories, human perspectives & real insights' },
  { name: 'Drama',           fallbackId: 18,    icon: Theater,     description: 'Deep emotional stakes & character-driven narratives' },
  { name: 'Family',          fallbackId: 10751, icon: Users,       description: 'Feel-good entertainment for audiences of all ages' },
  { name: 'Fantasy',         fallbackId: 14,    icon: Wand2,       description: 'Mythical realms, ancient sorcery & wonder' },
  { name: 'History',         fallbackId: 36,    icon: BookOpen,    description: 'Echoes of monumental events & historic figures' },
  { name: 'Horror',          fallbackId: 27,    icon: Ghost,       description: 'Spine-chilling scares, monsters & uncanny dread' },
  { name: 'Music',           fallbackId: 10402, icon: Music,       description: 'Rhythmic journeys, concerts & musical brilliance' },
  { name: 'Mystery',         fallbackId: 9648,  icon: Search,      description: 'Twisting puzzles, detectives & unsolved secrets' },
  { name: 'Romance',         fallbackId: 10749, icon: Heart,       description: 'Passionate connections, heartbreak & true love' },
  { name: 'Science Fiction', fallbackId: 878,   icon: Rocket,      description: 'Futuristic frontiers, quantum realms & outer space' },
  { name: 'Thriller',        fallbackId: 53,    icon: Zap,         description: 'Relentless suspense, nail-biting twists & tension' },
]

export default function GenresPage() {
  const { genres } = useGenres()

  return (
    <Layout title="Genres">
      <div className="page-container">
        <div className="page-header" style={{ marginBottom: 32 }}>
          <h1 className="page-title">Explore Genres</h1>
          <p className="page-subtitle">
            Dive into movies curated across 16 iconic cinematic genres.
          </p>
        </div>

        <div className="genre-grid">
          {GENRE_TILES.map((item) => {
            const matched = genres.find(
              (g) => g.name.toLowerCase() === item.name.toLowerCase(),
            )
            const genreId = matched ? matched.id : item.fallbackId
            const genreName = matched ? matched.name : item.name
            const Icon = item.icon
            const colors = getGenreColor(genreName)

            return (
              <Link
                key={genreId}
                to={`/genres/${genreId}`}
                className="genre-tile glass"
                style={{
                  minHeight: 160,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '22px 20px',
                  background: `linear-gradient(135deg, ${colors.bg} 0%, rgba(14, 16, 24, 0.75) 100%)`,
                  border: `1px solid ${colors.border}`,
                  textDecoration: 'none',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: colors.bg,
                      border: `1px solid ${colors.border}`,
                      color: colors.accent,
                      flexShrink: 0,
                      boxShadow: `0 4px 14px ${colors.bg}`,
                    }}
                  >
                    <Icon size={22} strokeWidth={1.8} />
                  </div>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-muted)',
                    }}
                  >
                    <ArrowRight size={14} />
                  </div>
                </div>

                <div>
                  <h2
                    style={{
                      fontSize: 17,
                      fontWeight: 600,
                      color: 'var(--color-text)',
                      marginBottom: 6,
                    }}
                  >
                    {genreName}
                  </h2>
                  <p
                    style={{
                      fontSize: 12,
                      color: 'var(--color-muted)',
                      lineHeight: 1.45,
                      margin: 0,
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </Layout>
  )
}
