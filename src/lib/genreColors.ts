// Curated soft tint color map for the 16 primary movie genres

export interface GenreColorSpec {
  accent: string
  bg: string
  border: string
  gradient: string
}

export const DEFAULT_GENRE_COLOR: GenreColorSpec = {
  accent: '#F2B33D',
  bg: 'rgba(242, 179, 61, 0.10)',
  border: 'rgba(242, 179, 61, 0.28)',
  gradient: 'radial-gradient(circle at 10% 20%, rgba(242, 179, 61, 0.15), transparent 70%)',
}

export const GENRE_COLORS: Record<string, GenreColorSpec> = {
  action: {
    accent: '#FF5C7A',
    bg: 'rgba(255, 92, 122, 0.10)',
    border: 'rgba(255, 92, 122, 0.28)',
    gradient: 'radial-gradient(circle at 10% 20%, rgba(255, 92, 122, 0.18), transparent 70%)',
  },
  adventure: {
    accent: '#F2B33D',
    bg: 'rgba(242, 179, 61, 0.10)',
    border: 'rgba(242, 179, 61, 0.28)',
    gradient: 'radial-gradient(circle at 10% 20%, rgba(242, 179, 61, 0.18), transparent 70%)',
  },
  animation: {
    accent: '#C084FC',
    bg: 'rgba(192, 132, 252, 0.10)',
    border: 'rgba(192, 132, 252, 0.28)',
    gradient: 'radial-gradient(circle at 10% 20%, rgba(192, 132, 252, 0.18), transparent 70%)',
  },
  comedy: {
    accent: '#34D399',
    bg: 'rgba(52, 211, 153, 0.10)',
    border: 'rgba(52, 211, 153, 0.28)',
    gradient: 'radial-gradient(circle at 10% 20%, rgba(52, 211, 153, 0.18), transparent 70%)',
  },
  crime: {
    accent: '#F87171',
    bg: 'rgba(248, 113, 113, 0.10)',
    border: 'rgba(248, 113, 113, 0.28)',
    gradient: 'radial-gradient(circle at 10% 20%, rgba(248, 113, 113, 0.18), transparent 70%)',
  },
  documentary: {
    accent: '#38BDF8',
    bg: 'rgba(56, 189, 248, 0.10)',
    border: 'rgba(56, 189, 248, 0.28)',
    gradient: 'radial-gradient(circle at 10% 20%, rgba(56, 189, 248, 0.18), transparent 70%)',
  },
  drama: {
    accent: '#818CF8',
    bg: 'rgba(129, 140, 248, 0.10)',
    border: 'rgba(129, 140, 248, 0.28)',
    gradient: 'radial-gradient(circle at 10% 20%, rgba(129, 140, 248, 0.18), transparent 70%)',
  },
  family: {
    accent: '#FBBF24',
    bg: 'rgba(251, 191, 36, 0.10)',
    border: 'rgba(251, 191, 36, 0.28)',
    gradient: 'radial-gradient(circle at 10% 20%, rgba(251, 191, 36, 0.18), transparent 70%)',
  },
  fantasy: {
    accent: '#F472B6',
    bg: 'rgba(244, 114, 182, 0.10)',
    border: 'rgba(244, 114, 182, 0.28)',
    gradient: 'radial-gradient(circle at 10% 20%, rgba(244, 114, 182, 0.18), transparent 70%)',
  },
  history: {
    accent: '#FB923C',
    bg: 'rgba(251, 146, 60, 0.10)',
    border: 'rgba(251, 146, 60, 0.28)',
    gradient: 'radial-gradient(circle at 10% 20%, rgba(251, 146, 60, 0.18), transparent 70%)',
  },
  horror: {
    accent: '#A78BFA',
    bg: 'rgba(167, 139, 250, 0.10)',
    border: 'rgba(167, 139, 250, 0.28)',
    gradient: 'radial-gradient(circle at 10% 20%, rgba(167, 139, 250, 0.18), transparent 70%)',
  },
  music: {
    accent: '#60A5FA',
    bg: 'rgba(96, 165, 250, 0.10)',
    border: 'rgba(96, 165, 250, 0.28)',
    gradient: 'radial-gradient(circle at 10% 20%, rgba(96, 165, 250, 0.18), transparent 70%)',
  },
  mystery: {
    accent: '#2DD4BF',
    bg: 'rgba(45, 212, 191, 0.10)',
    border: 'rgba(45, 212, 191, 0.28)',
    gradient: 'radial-gradient(circle at 10% 20%, rgba(45, 212, 191, 0.18), transparent 70%)',
  },
  romance: {
    accent: '#FB7185',
    bg: 'rgba(251, 113, 133, 0.10)',
    border: 'rgba(251, 113, 133, 0.28)',
    gradient: 'radial-gradient(circle at 10% 20%, rgba(251, 113, 133, 0.18), transparent 70%)',
  },
  'science fiction': {
    accent: '#6366F1',
    bg: 'rgba(99, 102, 241, 0.10)',
    border: 'rgba(99, 102, 241, 0.28)',
    gradient: 'radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.18), transparent 70%)',
  },
  thriller: {
    accent: '#E11D48',
    bg: 'rgba(225, 29, 72, 0.10)',
    border: 'rgba(225, 29, 72, 0.28)',
    gradient: 'radial-gradient(circle at 10% 20%, rgba(225, 29, 72, 0.18), transparent 70%)',
  },
}

export function getGenreColor(genreName?: string): GenreColorSpec {
  if (!genreName) return DEFAULT_GENRE_COLOR
  const key = genreName.trim().toLowerCase()
  return GENRE_COLORS[key] ?? DEFAULT_GENRE_COLOR
}
