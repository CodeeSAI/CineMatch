// Cinema Neon color palette for the 16 primary movie genres
// Reused for pills, card glow, tiles, banners, and details

export interface GenreColorSpec {
  accent: string    // Vivid hex accent
  bg: string        // Translucent background
  border: string    // Border color
  gradient: string  // Multi-stop gradient
  glow: string      // Glow shadow for cards
  textColor: string // Contrast text color
}

export const DEFAULT_GENRE_COLOR: GenreColorSpec = {
  accent: '#FF3B5C',
  bg: 'rgba(255, 59, 92, 0.12)',
  border: 'rgba(255, 59, 92, 0.32)',
  gradient: 'linear-gradient(135deg, rgba(255, 59, 92, 0.22) 0%, rgba(255, 122, 69, 0.08) 100%)',
  glow: 'rgba(255, 59, 92, 0.35)',
  textColor: '#FF3B5C',
}

export const GENRE_COLORS: Record<string, GenreColorSpec> = {
  action: {
    accent: '#FF3B5C', // Crimson
    bg: 'rgba(255, 59, 92, 0.14)',
    border: 'rgba(255, 59, 92, 0.35)',
    gradient: 'linear-gradient(135deg, rgba(255, 59, 92, 0.25) 0%, rgba(255, 122, 69, 0.10) 100%)',
    glow: 'rgba(255, 59, 92, 0.40)',
    textColor: '#FF3B5C',
  },
  adventure: {
    accent: '#FF7A45', // Coral
    bg: 'rgba(255, 122, 69, 0.14)',
    border: 'rgba(255, 122, 69, 0.35)',
    gradient: 'linear-gradient(135deg, rgba(255, 122, 69, 0.25) 0%, rgba(255, 197, 51, 0.10) 100%)',
    glow: 'rgba(255, 122, 69, 0.38)',
    textColor: '#FF7A45',
  },
  animation: {
    accent: '#FF5FA2', // Neon Pink
    bg: 'rgba(255, 95, 162, 0.14)',
    border: 'rgba(255, 95, 162, 0.35)',
    gradient: 'linear-gradient(135deg, rgba(255, 95, 162, 0.25) 0%, rgba(139, 92, 246, 0.10) 100%)',
    glow: 'rgba(255, 95, 162, 0.38)',
    textColor: '#FF5FA2',
  },
  comedy: {
    accent: '#FFC533', // Sun Amber
    bg: 'rgba(255, 197, 51, 0.14)',
    border: 'rgba(255, 197, 51, 0.35)',
    gradient: 'linear-gradient(135deg, rgba(255, 197, 51, 0.25) 0%, rgba(255, 122, 69, 0.10) 100%)',
    glow: 'rgba(255, 197, 51, 0.38)',
    textColor: '#FFC533',
  },
  crime: {
    accent: '#FF3B5C', // Crimson
    bg: 'rgba(255, 59, 92, 0.14)',
    border: 'rgba(255, 59, 92, 0.35)',
    gradient: 'linear-gradient(135deg, rgba(255, 59, 92, 0.25) 0%, rgba(30, 20, 51, 0.40) 100%)',
    glow: 'rgba(255, 59, 92, 0.40)',
    textColor: '#FF3B5C',
  },
  documentary: {
    accent: '#14D3C6', // Teal
    bg: 'rgba(20, 211, 198, 0.14)',
    border: 'rgba(20, 211, 198, 0.35)',
    gradient: 'linear-gradient(135deg, rgba(20, 211, 198, 0.25) 0%, rgba(74, 222, 128, 0.10) 100%)',
    glow: 'rgba(20, 211, 198, 0.38)',
    textColor: '#14D3C6',
  },
  drama: {
    accent: '#8B5CF6', // Violet
    bg: 'rgba(139, 92, 246, 0.14)',
    border: 'rgba(139, 92, 246, 0.35)',
    gradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(56, 189, 248, 0.10) 100%)',
    glow: 'rgba(139, 92, 246, 0.40)',
    textColor: '#8B5CF6',
  },
  family: {
    accent: '#4ADE80', // Mint
    bg: 'rgba(74, 222, 128, 0.14)',
    border: 'rgba(74, 222, 128, 0.35)',
    gradient: 'linear-gradient(135deg, rgba(74, 222, 128, 0.25) 0%, rgba(20, 211, 198, 0.10) 100%)',
    glow: 'rgba(74, 222, 128, 0.38)',
    textColor: '#4ADE80',
  },
  fantasy: {
    accent: '#FF5FA2', // Pink Violet
    bg: 'rgba(255, 95, 162, 0.14)',
    border: 'rgba(255, 95, 162, 0.35)',
    gradient: 'linear-gradient(135deg, rgba(255, 95, 162, 0.25) 0%, rgba(139, 92, 246, 0.15) 100%)',
    glow: 'rgba(255, 95, 162, 0.38)',
    textColor: '#FF5FA2',
  },
  history: {
    accent: '#FF7A45', // Coral Amber
    bg: 'rgba(255, 122, 69, 0.14)',
    border: 'rgba(255, 122, 69, 0.35)',
    gradient: 'linear-gradient(135deg, rgba(255, 122, 69, 0.25) 0%, rgba(255, 197, 51, 0.12) 100%)',
    glow: 'rgba(255, 122, 69, 0.38)',
    textColor: '#FF7A45',
  },
  horror: {
    accent: '#8B5CF6', // Deep Violet
    bg: 'rgba(139, 92, 246, 0.14)',
    border: 'rgba(139, 92, 246, 0.35)',
    gradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(255, 59, 92, 0.12) 100%)',
    glow: 'rgba(139, 92, 246, 0.40)',
    textColor: '#8B5CF6',
  },
  music: {
    accent: '#38BDF8', // Sky
    bg: 'rgba(56, 189, 248, 0.14)',
    border: 'rgba(56, 189, 248, 0.35)',
    gradient: 'linear-gradient(135deg, rgba(56, 189, 248, 0.25) 0%, rgba(20, 211, 198, 0.10) 100%)',
    glow: 'rgba(56, 189, 248, 0.38)',
    textColor: '#38BDF8',
  },
  mystery: {
    accent: '#14D3C6', // Teal
    bg: 'rgba(20, 211, 198, 0.14)',
    border: 'rgba(20, 211, 198, 0.35)',
    gradient: 'linear-gradient(135deg, rgba(20, 211, 198, 0.25) 0%, rgba(139, 92, 246, 0.10) 100%)',
    glow: 'rgba(20, 211, 198, 0.38)',
    textColor: '#14D3C6',
  },
  romance: {
    accent: '#FF5FA2', // Pink
    bg: 'rgba(255, 95, 162, 0.14)',
    border: 'rgba(255, 95, 162, 0.35)',
    gradient: 'linear-gradient(135deg, rgba(255, 95, 162, 0.25) 0%, rgba(255, 59, 92, 0.12) 100%)',
    glow: 'rgba(255, 95, 162, 0.40)',
    textColor: '#FF5FA2',
  },
  'science fiction': {
    accent: '#38BDF8', // Sky / Cyan
    bg: 'rgba(56, 189, 248, 0.14)',
    border: 'rgba(56, 189, 248, 0.35)',
    gradient: 'linear-gradient(135deg, rgba(56, 189, 248, 0.25) 0%, rgba(139, 92, 246, 0.12) 100%)',
    glow: 'rgba(56, 189, 248, 0.40)',
    textColor: '#38BDF8',
  },
  thriller: {
    accent: '#FF3B5C', // Crimson
    bg: 'rgba(255, 59, 92, 0.14)',
    border: 'rgba(255, 59, 92, 0.35)',
    gradient: 'linear-gradient(135deg, rgba(255, 59, 92, 0.25) 0%, rgba(139, 92, 246, 0.10) 100%)',
    glow: 'rgba(255, 59, 92, 0.40)',
    textColor: '#FF3B5C',
  },
}

export function getGenreColor(genreName?: string): GenreColorSpec {
  if (!genreName) return DEFAULT_GENRE_COLOR
  const key = genreName.trim().toLowerCase()
  return GENRE_COLORS[key] ?? DEFAULT_GENRE_COLOR
}
