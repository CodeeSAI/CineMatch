# CineMatch — Project Context & Documentation

## Overview
CineMatch is a movie discovery and personal tracking web application built with React 19, TypeScript, Vite, and Tailwind CSS v4, powered by The Movie Database (TMDB) API. It features real-time search with debouncing, multi-criteria filtering, genre discovery, deep movie details with YouTube trailer integration, local user collections (Favorites, Watchlist, Personal Ratings), a local user profile, and a rule-based recommendation engine.

---

## Design System & Aesthetics ("Cinematic Blue & Crimson")
The application adheres to a dark, cinematic, and movie-first streaming aesthetic:
- **Base Palette**: Deep black/midnight navy background (`#05060B`), midnight slate surface (`#090B14`), elevated surface (`#0E111C`, `#141827`), card background (`#0D101B`), crisp white text (`#F8FAFC`), muted labels (`#A7ADBC`), subtle captions (`#697184`).
- **Cinematic Accents**: Royal Blue (`#3B82F6` / `#2563EB`) and Crimson Red (`#EF4444` / `#DC2626`) applied with restraint for atmospheric lighting, focus rings, hover glows, and active indicators.
- **Frosted Glass Utilities**: Applied to the floating sticky navbar, mobile drawer, hero info panel, and card info overlays with `backdrop-filter: blur(16px–24px)` and subtle 1px translucent borders (`rgba(255, 255, 255, 0.09)`).
- **Gradient Tokens**:
  - `--grad-hot`: Deep Blue → Crimson accent (`#2563EB` → `#1D4ED8` → `#DC2626`)
  - `--grad-cool`: Subdued Blue Glass (`rgba(59, 130, 246, 0.18)` → `rgba(239, 68, 68, 0.08)`)
  - `--grad-blue`: Royal Blue (`#3B82F6` → `#1D4ED8`)
  - `--grad-red`: Crimson Red (`#EF4444` → `#B91C1C`)
- **Ambient Drifting Background**: Fixed background layer with soft blurred blue (`rgba(37, 99, 235, 0.07)`) and crimson (`rgba(220, 38, 38, 0.065)`) atmospheric lighting drifting slowly (transform only, 38–42s loops), paused below 768px and under `prefers-reduced-motion`.
- **Interactive Navbar**: Floating translucent glass bar with subtle blue/crimson gradient underline on active links, expanded search input with `"Search for films, directors, actors..."` placeholder and blue focus glow, favorites/watchlist badges, and avatar.
- **Cinematic Hero (`HeroSection`)**: Integrated seamlessly into the backdrop artwork without boxy floating panels. Utilizes 3-stage dark scrim gradients (vertical, horizontal, and subtle blue/crimson radial atmospheric light). Features Flame `TRENDING #1` eyebrow badge, Fraunces editorial title, refined gold star rating badge, gradient primary "Watch Now" button, dark glass watchlist toggle, left/right slide arrows, and auto-rotation progress tracks.
- **Image-First Streaming Card (`StreamCard` / `MovieCard`)**: Fully redesigned 16px border-radius streaming card where high-resolution poster artwork dominates. Features floating glass gold star rating badge, hover scrim overlay, centered quick-action Play button, top-right heart pop and watchlist bounce action buttons, and clean single-line metadata (`2024 • Action`) with contextual recommendation badge.
- **Movie Rows (`MovieRow`)**: Smooth horizontal snap-scrolling strip with responsive card widths revealing a partial peek of the next card on desktop and mobile. Animated "View all →" header link with slide-on-hover arrow.
- **Curated Indian Cinema Showcase**: Replaced basic filter box with a luxury curated collection section featuring an atmospheric ambient glow, Fraunces headline, and compact glass language tabs (Hindi, Tamil, Telugu, Malayalam, Kannada) with glowing active borders.
- **Pages Overhaul**: Uniform integration of `.stream-card` across Discover, Search, Genres, Favorites, Watchlist, and Profile pages. All TMDB API data connections, local storage, rating, and filtering behaviors strictly preserved.

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
