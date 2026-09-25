# CineMatch — Project Context & Documentation

## Overview
CineMatch is a movie discovery and personal tracking web application built with React 19, TypeScript, Vite, and Tailwind CSS v4, powered by The Movie Database (TMDB) API. It features real-time search with debouncing, multi-criteria filtering, genre discovery, deep movie details with YouTube trailer integration, local user collections (Favorites, Watchlist, Personal Ratings), a local user profile, and a rule-based recommendation engine.

---

## Design System & Aesthetics ("Midnight & Gold" Frosted Glass)
The entire site adheres to a cohesive, cinematic frosted-glass aesthetic:
- **Base Palette**: Midnight background (`#07080D`), dark surface (`#0E1018`), text (`#F4F2ED`), muted labels (`#A3A7B5`), subtle text (`#656978`).
- **Accents**: Warm cinematic Gold (`#F2B33D`, hover `#FFC65A`, text on accent `#1A1204`), Indigo (`#6D7CFF`) for secondary highlights, and Rose (`#FF5C7A`) for favorite heart and danger states.
- **Frosted Glass Utilities**:
  - `.glass`: standard blur (12px), translucent fill, subtle inner light, and delicate border.
  - `.glass-strong`: elevated blur (20px) for modals, mobile drawers, and sticky headers.
  - `@supports not (backdrop-filter: blur(1px))` fallbacks for older browser support.
  - **Performance Rule**: Large movie grids strictly avoid per-card `backdrop-filter: blur()`. Blur is reserved for persistent structural surfaces (navbar, drawer, filter panel, hero).
- **Typography**: Google Fonts `"Fraunces"` serif for expressive display headings and `"DM Sans"` for clean, legible body text.

---

## Technical Stack & Architecture
- **Framework & Runtime**: React 19, TypeScript, Vite 6.
- **Styling**: Tailwind CSS v4 with `@theme` design tokens in `src/index.css`.
- **Routing**: React Router v7 (`react-router-dom`).
- **Icons**: `lucide-react`.
- **State Management**:
  - `LibraryContext`: Favorites, Watchlist, Ratings (1–5 stars in 0.5 increments), and Recently Viewed.
  - `GenresContext`: TMDB genre definitions with fast name/ID lookup.
- **Storage**: LocalStorage only (`services/storage/`) — no backend or auth needed for full prototype functionality.
- **Data Source**: TMDB API v3 (`services/tmdb/`) with strict typed responses, request cancellation (`AbortController`), and no mock/fake data.

---

## Completed Phases & Feature Matrix

### Phase 1: Design Tokens, Layout & Core Components
- Floating sticky frosted glass Navbar with scroll-triggered opacity, gold route indicators, and mobile drawer.
- Trending Hero carousel with 8s auto-scroll, hover pause, and `prefers-reduced-motion` compliance.
- Responsive `MovieRow` with snap-scrolling, left/right desktop scroll arrows, and soft edge fades.
- High-performance `MovieCard` with top-left gold rating badge, hover action buttons, and poster zoom.
- Soft shimmer skeletons with 14px border radii.
- Slim, elegant glass footer.

### Phase 2: Pages, Full Indian Languages Support & Polish
- **Shared Languages System (`src/lib/languages.ts`)**:
  - **12 Indian Languages**: Hindi (`hi`), Tamil (`ta`), Telugu (`te`), Malayalam (`ml`), Kannada (`kn`), Bengali (`bn`), Marathi (`mr`), Punjabi (`pa`), Gujarati (`gu`), Odia (`or`), Assamese (`as`), Urdu (`ur`) with native script labels.
  - **13 World Languages**: English (`en`), Korean (`ko`), Japanese (`ja`), French (`fr`), Spanish (`es`), German (`de`), Italian (`it`), Chinese (`zh`), Portuguese (`pt`), Russian (`ru`), Arabic (`ar`), Thai (`th`), Turkish (`tr`).
  - Lookup utilities `getLanguageByCode` and `getLanguageName`.
- **Home Page (`/`)**:
  - Added dedicated **"Indian Cinema"** section featuring interactive tabs for Hindi, Tamil, Telugu, Malayalam, and Kannada, dynamically fetching live popularity data from TMDB.
  - Dynamic "Because you liked [Seed Title]" recommendation row appearing as soon as user saves favorites or highly rates titles.
- **Discover Page (`/discover`)**:
  - Desktop sticky glass filter sidebar; mobile slide-over glass drawer with backdrop overlay.
  - 1-click Indian language quick chips at the top of the catalogue.
  - Grouped language select with `<optgroup>` for Indian and World languages.
  - Active filter chips with single-click remove buttons.
  - Accurate result count from TMDB `total_results`.
  - Regional threshold adjustment: When sorting by rating with a language filter active, threshold is automatically relaxed to `vote_count.gte=25` (instead of 200) to ensure regional gems are never hidden.
- **Search Page (`/search`)**:
  - Large glass search bar with clear button, instant live debouncing (400ms), and AbortController request cancellation.
  - Quick clickable popular search suggestions when idle.
  - Skeletons, empty states, and results count.
- **Genres & Genre Movies (`/genres`, `/genres/:id`)**:
  - 16 glass tiles with curated soft tint color map (`src/lib/genreColors.ts`), Lucide icons, and hover lift.
  - Dedicated genre header banner rendered in the specific genre's tint.
- **Movie Details (`/movie/:id`)**:
  - Full-bleed backdrop fading into `#07080D` page background.
  - Poster with deep elevation shadow.
  - Glass info panel with stat chips for rating, runtime, release date, and original language name.
  - Cast rendered as scrollable glass cards with photo fallbacks.
  - Official YouTube trailer preview inside a glass frame, loading the `youtube-nocookie.com` iframe only on click.
  - Accessible gold rating stars (0.5 to 5.0 in half-steps) with clear button.
  - Similar and Recommended movie rows.
- **Favorites (`/favorites`) & Watchlist (`/watchlist`)**:
  - Frosted glass toolbar with item count and multi-criteria sorting (Recently Added, Oldest, Title A–Z, Release Year, Rating).
  - Clean movie grid with remove actions and styled empty states linking to Discover.
- **Profile (`/profile`)**:
  - Frosted glass cards, avatar with gold glowing ring (`border: 3px solid var(--color-accent)`), stat counters, and genre pills.
  - Preferred language selector powered by `ALL_LANGUAGES` (Indian & World groups) that feeds the recommendation boost.
  - Inline profile editing for name, avatar color, language, and favorite genres.
- **404 Page & Setup Required**:
  - Redesigned 404 "Scene Not Found" page with glass card, SVG clapperboard, and navigation CTA buttons.
  - Frosted glass Setup Required screen providing setup guidance when `VITE_TMDB_API_KEY` is not configured.
- **CSS Cleanup**:
  - `src/phase4.css` removed; all needed layout, filter, and genre classes migrated and enhanced in `src/index.css`.

---

## Key Directories & File Structure
```
src/
├── components/
│   ├── layout/       # Layout, Navbar, Footer, MobileMenu
│   ├── movie/        # HeroSection, MovieCard, MovieGrid, MovieRow
│   └── ui/           # Logo, GenreTag, ImageWithFallback, ErrorState, EmptyState, Skeleton, SetupRequired
├── context/          # LibraryContext (Favorites/Watchlist/Ratings/Recents), GenresContext
├── hooks/            # useDebounce, useFetch
├── lib/              # format.ts, genreColors.ts, languages.ts, movie.ts, recommend.ts
├── pages/            # Home, Discover, Search, Genres, GenreMovies, MovieDetails, Favorites, Watchlist, Profile, NotFound
├── services/
│   ├── storage/      # base, favorites, watchlist, ratings, recentlyViewed, profile
│   └── tmdb/         # client, movies, genres, images, types
└── types/            # App-wide interfaces and error classes
```
