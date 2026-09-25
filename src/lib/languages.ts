// ─── Shared Language Definitions ──────────────────────────────────────────────
// Indian and World languages supported across CineMatch

export interface LanguageOption {
  code: string
  name: string
  nativeName: string
  group: 'Indian' | 'World'
}

export const INDIAN_LANGUAGES: LanguageOption[] = [
  { code: 'hi', name: 'Hindi',      nativeName: 'हिन्दी',    group: 'Indian' },
  { code: 'ta', name: 'Tamil',      nativeName: 'தமிழ்',     group: 'Indian' },
  { code: 'te', name: 'Telugu',     nativeName: 'తెలుగు',    group: 'Indian' },
  { code: 'ml', name: 'Malayalam',  nativeName: 'മലയാളം',  group: 'Indian' },
  { code: 'kn', name: 'Kannada',    nativeName: 'ಕನ್ನಡ',    group: 'Indian' },
  { code: 'bn', name: 'Bengali',    nativeName: 'বাংলা',     group: 'Indian' },
  { code: 'mr', name: 'Marathi',    nativeName: 'मराठी',    group: 'Indian' },
  { code: 'pa', name: 'Punjabi',    nativeName: 'ਪੰਜਾਬੀ',   group: 'Indian' },
  { code: 'gu', name: 'Gujarati',   nativeName: 'ગુજરાતી',   group: 'Indian' },
  { code: 'or', name: 'Odia',       nativeName: 'ଓଡ଼ିଆ',     group: 'Indian' },
  { code: 'as', name: 'Assamese',   nativeName: 'অসমীয়া',   group: 'Indian' },
  { code: 'ur', name: 'Urdu',       nativeName: 'اردو',      group: 'Indian' },
]

export const WORLD_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English',    nativeName: 'English',   group: 'World' },
  { code: 'ko', name: 'Korean',     nativeName: '한국어',    group: 'World' },
  { code: 'ja', name: 'Japanese',   nativeName: '日本語',    group: 'World' },
  { code: 'fr', name: 'French',     nativeName: 'Français',  group: 'World' },
  { code: 'es', name: 'Spanish',    nativeName: 'Español',   group: 'World' },
  { code: 'de', name: 'German',     nativeName: 'Deutsch',   group: 'World' },
  { code: 'it', name: 'Italian',    nativeName: 'Italiano',  group: 'World' },
  { code: 'zh', name: 'Chinese',    nativeName: '中文',      group: 'World' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', group: 'World' },
  { code: 'ru', name: 'Russian',    nativeName: 'Русский',   group: 'World' },
  { code: 'ar', name: 'Arabic',     nativeName: 'العربية',   group: 'World' },
  { code: 'th', name: 'Thai',       nativeName: 'ไทย',       group: 'World' },
  { code: 'tr', name: 'Turkish',    nativeName: 'Türkçe',    group: 'World' },
]

export const ALL_LANGUAGES: LanguageOption[] = [
  ...INDIAN_LANGUAGES,
  ...WORLD_LANGUAGES,
]

export function getLanguageByCode(code: string): LanguageOption | undefined {
  return ALL_LANGUAGES.find((l) => l.code === code)
}

export function getLanguageName(code: string): string {
  const match = getLanguageByCode(code)
  if (!match) return code.toUpperCase()
  return match.nativeName !== match.name
    ? `${match.name} (${match.nativeName})`
    : match.name
}
