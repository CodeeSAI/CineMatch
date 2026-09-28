# CineMatch — Project Context & Documentation

## Overview
CineMatch is a movie discovery and personal tracking web application built with React 19, TypeScript, Vite, and Tailwind CSS v4, powered by The Movie Database (TMDB) API. It features real-time search with debouncing, multi-criteria filtering, genre discovery, deep movie details with YouTube trailer integration, local user collections (Favorites, Watchlist, Personal Ratings), a local user profile, and a rule-based recommendation engine.

---

## Design System & Aesthetics ("Cinema Neon" Vibrant & Animated)
The entire site adheres to a vivid, animated, and premium "Cinema Neon" aesthetic:
- **Base Palette**: Dark plum background (`#0B0714`), surface (`#150E24`), surface-2 (`#1E1433`), text (`#F7F3FF`), muted labels (`#B4AACB`).
- **Cinema Neon Accents**: Crimson (`#FF3B5C`), Coral (`#FF7A45`), Sun Amber (`#FFC533`), Violet (`#8B5CF6`), Teal (`#14D3C6`), Sky (`#38BDF8`), Mint (`#4ADE80`), and Neon Pink (`#FF5FA2`).
- **Deep Jewel Surfaces**: Jewel-toned dark bands (`.row-band--jewel`, e.g. violet-to-crimson gradient at 25–35% over `--color-surface` with 1px border and soft inner glow) and frosted glass panels matching the dark plum palette.
- **Gradient Tokens**:
  - `--grad-hot`: Crimson → Coral → Sun (`#FF3B5C` → `#FF7A45` → `#FFC533`)
  - `--grad-cool`: Violet → Sky → Teal (`#8B5CF6` → `#38BDF8` → `#14D3C6`)
  - `--grad-candy`: Pink → Violet (`#FF5FA2` → `#8B5CF6`)
  - `--grad-fresh`: Teal → Mint (`#14D3C6` → `#4ADE80`)
- **Genre Color Mapping (`src/lib/genreColors.ts`)**: 16 primary movie genres mapped to distinct cinema neon accents, backgrounds, borders, gradients, and card glow shadows.
- **Ambient Drifting Background**: Fixed background layer of 4 soft color blobs (violet, crimson, teal, sun) drifting slowly (transform only, 30–40s loops), paused below 768px and under `prefers-reduced-motion`. No backdrop-filter on this layer.
- **Typography & Gradient Text**: Google Fonts `"Fraunces"` serif for expressive display headings and `"DM Sans"` for UI. Animated `.gradient-text` (8s loop) for titles and hero.
- **Alternating Home Sections**: Dark rows, a vivid gradient band (Indian Cinema), and a deep jewel-toned dark band (Top Rated) with 48px spacing (32px on mobile) and hidden native scrollbars.
- **Interactive Navbar**: Floating glass bar with sliding gradient underline on hover/active, logo shimmer every 6s, gradient count badges, gradient avatar ring, and staggered mobile drawer items.
- **High-Performance MovieCard**: Strictly NO backdrop-filter. 6px lift, 1.05 poster zoom, first-genre glow shadow, gradient hover overlay, gradient rating badge, heart pop + ring burst on favorite, bookmark bounce, and viewport-staggered entrance.
- **Trending Hero Carousel**: 3 slides, 8s auto-rotation (paused on hover and reduced motion), Ken Burns backdrop zoom, animated gradient glow border on info panel, staggered content slide-ins, and active dot time progress fill.
- **Motion Kit (`src/hooks/useInView.ts` + `src/index.css`)**: IntersectionObserver `.reveal` (fade + translateY 16px) with CSS `--i` stagger, button hover shine sweep, press scale 0.97, tinted shimmer skeletons, and 250ms page transitions. All decorative motion respects `prefers-reduced-motion`.
- **Frosted Glass Utilities**: Blur reserved for structural persistent surfaces (navbar, mobile drawer, hero info panel, modal). Visible `:focus-visible` rings with Sun Amber contrast.

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
