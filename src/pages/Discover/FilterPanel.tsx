import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { X, SlidersHorizontal, RotateCcw, Check } from 'lucide-react'
import { useGenres } from '../../context/GenresContext'
import { INDIAN_LANGUAGES, WORLD_LANGUAGES } from '../../lib/languages'

/** The set of URL-synced filter keys we use */
export interface FilterState {
  genre: string
  year: string
  ratingMin: string
  ratingMax: string
  language: string
  runtimeMin: string
  runtimeMax: string
  sortBy: string
  sortDir: string
}

export const EMPTY_FILTERS: FilterState = {
  genre: '',
  year: '',
  ratingMin: '',
  ratingMax: '',
  language: '',
  runtimeMin: '',
  runtimeMax: '',
  sortBy: 'popularity',
  sortDir: 'desc',
}

const SORT_OPTIONS = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'vote_average', label: 'Rating' },
  { value: 'primary_release_date', label: 'Release date' },
]

export function countActiveFilters(f: FilterState): number {
  let count = 0
  if (f.genre) count++
  if (f.year) count++
  if (f.ratingMin || f.ratingMax) count++
  if (f.language) count++
  if (f.runtimeMin || f.runtimeMax) count++
  if (f.sortBy !== 'popularity' || f.sortDir !== 'desc') count++
  return count
}

/** Reads current URL params and returns them as FilterState */
export function paramsToFilters(params: URLSearchParams): FilterState {
  let sortBy = params.get('sortBy') ?? ''
  let sortDir = params.get('sortDir') ?? ''

  // Support combined TMDB 'sort_by' parameter like "vote_average.desc"
  const combinedSort = params.get('sort_by')
  if (combinedSort) {
    const [field, dir] = combinedSort.split('.')
    if (!sortBy && field) sortBy = field
    if (!sortDir && dir) sortDir = dir
  }

  return {
    genre: params.get('genre') ?? params.get('with_genres') ?? '',
    year: params.get('year') ?? params.get('primary_release_year') ?? '',
    ratingMin: params.get('ratingMin') ?? params.get('vote_average.gte') ?? '',
    ratingMax: params.get('ratingMax') ?? params.get('vote_average.lte') ?? '',
    language: params.get('language') ?? params.get('with_original_language') ?? '',
    runtimeMin: params.get('runtimeMin') ?? params.get('with_runtime.gte') ?? '',
    runtimeMax: params.get('runtimeMax') ?? params.get('with_runtime.lte') ?? '',
    sortBy: sortBy || 'popularity',
    sortDir: sortDir || 'desc',
  }
}

/** Writes a FilterState back to URLSearchParams (omits empty values) */
export function filtersToParams(f: FilterState): URLSearchParams {
  const p = new URLSearchParams()
  if (f.genre) p.set('genre', f.genre)
  if (f.year) p.set('year', f.year)
  if (f.ratingMin) p.set('ratingMin', f.ratingMin)
  if (f.ratingMax) p.set('ratingMax', f.ratingMax)
  if (f.language) p.set('language', f.language)
  if (f.runtimeMin) p.set('runtimeMin', f.runtimeMin)
  if (f.runtimeMax) p.set('runtimeMax', f.runtimeMax)
  if (f.sortBy !== 'popularity') p.set('sortBy', f.sortBy)
  if (f.sortDir !== 'desc') p.set('sortDir', f.sortDir)
  return p
}

interface FilterPanelProps {
  onApply: (filters: FilterState) => void
  isMobileDrawer?: boolean
  onCloseMobile?: () => void
}

export function FilterPanel({ onApply, isMobileDrawer, onCloseMobile }: FilterPanelProps) {
  const [searchParams] = useSearchParams()
  const { genres } = useGenres()

  // Local draft state — committed to URL on Apply
  const [draft, setDraft] = useState<FilterState>(() => paramsToFilters(searchParams))

  // Sync draft whenever searchParams change
  useEffect(() => {
    setDraft(paramsToFilters(searchParams))
  }, [searchParams])

  const set = useCallback(<K extends keyof FilterState>(key: K, val: FilterState[K]) => {
    setDraft((prev) => ({ ...prev, [key]: val }))
  }, [])

  // Validation: min must not exceed max
  const ratingError =
    draft.ratingMin !== '' &&
    draft.ratingMax !== '' &&
    Number(draft.ratingMin) > Number(draft.ratingMax)
      ? 'Min rating cannot exceed max rating'
      : null

  const runtimeError =
    draft.runtimeMin !== '' &&
    draft.runtimeMax !== '' &&
    Number(draft.runtimeMin) > Number(draft.runtimeMax)
      ? 'Min runtime cannot exceed max runtime'
      : null

  function handleApply() {
    if (ratingError || runtimeError) return
    onApply(draft)
    if (isMobileDrawer && onCloseMobile) {
      onCloseMobile()
    }
  }

  function handleClear() {
    setDraft(EMPTY_FILTERS)
    onApply(EMPTY_FILTERS)
    if (isMobileDrawer && onCloseMobile) {
      onCloseMobile()
    }
  }

  return (
    <div
      className={isMobileDrawer ? 'filter-panel-drawer' : 'filter-panel'}
      role="search"
      aria-label="Movie filters"
    >
      {/* Header for mobile drawer */}
      {isMobileDrawer && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
            paddingBottom: 12,
            borderBottom: '1px solid var(--color-glass-border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SlidersHorizontal size={18} color="var(--color-accent)" />
            <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>
              Filters
            </h2>
          </div>
          <button
            type="button"
            onClick={onCloseMobile}
            className="btn-icon"
            aria-label="Close filters"
            style={{ width: 32, height: 32 }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {!isMobileDrawer && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 18,
            paddingBottom: 12,
            borderBottom: '1px solid var(--color-glass-border)',
          }}
        >
          <SlidersHorizontal size={16} color="var(--color-accent)" />
          <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>
            Filter Catalogue
          </h2>
        </div>
      )}

      <div className="filter-grid">
        {/* Genre */}
        <div>
          <label htmlFor="filter-genre" className="filter-label">Genre</label>
          <select
            id="filter-genre"
            className="filter-select"
            value={draft.genre}
            onChange={(e) => set('genre', e.target.value)}
          >
            <option value="">Any genre</option>
            {genres.map((g) => (
              <option key={g.id} value={String(g.id)}>{g.name}</option>
            ))}
          </select>
        </div>

        {/* Release year */}
        <div>
          <label htmlFor="filter-year" className="filter-label">Release year</label>
          <input
            id="filter-year"
            type="number"
            className="filter-input"
            placeholder="e.g. 2024"
            min={1900}
            max={new Date().getFullYear() + 1}
            value={draft.year}
            onChange={(e) => set('year', e.target.value)}
          />
        </div>

        {/* Language with Indian & World optgroups */}
        <div>
          <label htmlFor="filter-language" className="filter-label">Language</label>
          <select
            id="filter-language"
            className="filter-select"
            value={draft.language}
            onChange={(e) => set('language', e.target.value)}
          >
            <option value="">Any language</option>
            <optgroup label="Indian languages">
              {INDIAN_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name} ({l.nativeName})
                </option>
              ))}
            </optgroup>
            <optgroup label="World languages">
              {WORLD_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.nativeName !== l.name ? `${l.name} (${l.nativeName})` : l.name}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Rating range */}
        <div>
          <label className="filter-label">Rating (0 - 10)</label>
          <div className="filter-row-inline">
            <input
              type="number"
              className="filter-input"
              placeholder="Min"
              min={0}
              max={10}
              step={0.5}
              value={draft.ratingMin}
              onChange={(e) => set('ratingMin', e.target.value)}
              aria-label="Minimum rating"
            />
            <span>–</span>
            <input
              type="number"
              className="filter-input"
              placeholder="Max"
              min={0}
              max={10}
              step={0.5}
              value={draft.ratingMax}
              onChange={(e) => set('ratingMax', e.target.value)}
              aria-label="Maximum rating"
            />
          </div>
          {ratingError && <p className="filter-error" role="alert">{ratingError}</p>}
        </div>

        {/* Runtime range */}
        <div>
          <label className="filter-label">Runtime (minutes)</label>
          <div className="filter-row-inline">
            <input
              type="number"
              className="filter-input"
              placeholder="Min"
              min={0}
              value={draft.runtimeMin}
              onChange={(e) => set('runtimeMin', e.target.value)}
              aria-label="Minimum runtime in minutes"
            />
            <span>–</span>
            <input
              type="number"
              className="filter-input"
              placeholder="Max"
              min={0}
              value={draft.runtimeMax}
              onChange={(e) => set('runtimeMax', e.target.value)}
              aria-label="Maximum runtime in minutes"
            />
          </div>
          {runtimeError && <p className="filter-error" role="alert">{runtimeError}</p>}
        </div>

        {/* Sort by */}
        <div>
          <label htmlFor="filter-sort" className="filter-label">Sort by</label>
          <select
            id="filter-sort"
            className="filter-select"
            value={draft.sortBy}
            onChange={(e) => set('sortBy', e.target.value)}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Direction */}
        <div>
          <label htmlFor="filter-dir" className="filter-label">Order</label>
          <select
            id="filter-dir"
            className="filter-select"
            value={draft.sortDir}
            onChange={(e) => set('sortDir', e.target.value)}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      <div className="filter-actions">
        <button
          type="button"
          onClick={handleApply}
          disabled={!!ratingError || !!runtimeError}
          className="btn-primary"
          style={{
            flex: 1,
            opacity: ratingError || runtimeError ? 0.5 : 1,
            cursor: ratingError || runtimeError ? 'not-allowed' : 'pointer',
          }}
        >
          <Check size={15} /> Apply
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="btn-glass"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          <RotateCcw size={14} /> Clear
        </button>
      </div>
    </div>
  )
}
