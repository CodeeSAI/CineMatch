import { storageGet, storageSet } from './base'
import type { UserProfile } from '../../types'

const KEY = 'profile'

const DEFAULT_PROFILE: UserProfile = {
  displayName: 'Movie Fan',
  avatarColor: '#E0A43A',
  favoriteGenreIds: [],
  preferredLanguage: 'en',
}

export function getProfile(): UserProfile {
  return { ...DEFAULT_PROFILE, ...storageGet<Partial<UserProfile>>(KEY, {}) }
}

export function saveProfile(profile: UserProfile): void {
  storageSet(KEY, profile)
}
