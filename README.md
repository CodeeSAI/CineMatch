# CineMatch

A vibrant, fast, and feature-rich movie discovery web application built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS v4**. Powered by **The Movie Database (TMDB) API**, CineMatch combines real-time movie exploration, multi-criteria filtering, local user collections, rich media trailers, and a transparent rule-based recommendation engine — all wrapped in an animated "Cinema Neon" aesthetic.

🔗 **Live Demo**: [https://cine-match-eight-swart.vercel.app](https://cine-match-eight-swart.vercel.app)

---

## Features

### 🎬 Home & Hero Showcase
- **Trending Hero Carousel**: Auto-rotating 3-slide showcase (8s interval, paused on hover and under `prefers-reduced-motion`) with Ken Burns backdrop zoom, dynamic animated glow borders, and time progress indicators.
- **Curated Movie Rows**: Snap-scrolling carousels with desktop arrow controls for *Trending*, *Popular*, *Top Rated* (rendered in a deep jewel-toned band), and *Upcoming*. Native scrollbars are hidden across browsers while retaining touch swipe, trackpad, and keyboard accessibility.
- **Indian Cinema Showcase**: Dedicated interactive section featuring language tabs (*Hindi*, *Tamil*, *Telugu*, *Malayalam*, *Kannada*) fetching live regional popularity data from TMDB.
- **Dynamic Recommendations Row**: Contextual "Because you liked [Movie Title]" row generated dynamically from user favorites and ratings.

### 🔍 Discover with URL-Synced Filters
- **Multi-Parameter Filtering**: Filter movies by genre, release year, minimum rating (slider), runtime range, and original language.
- **URL Parameter Sync**: All active filters, sorting preferences, and pagination sync directly to URL search queries (`useSearchParams`), enabling bookmarking, sharing, and browser back/forward history navigation.
- **1-Click Language Quick Chips**: Instant toggles for popular regional languages.
- **Regional Vote Count Adaptation**: When sorting by rating with a language filter selected, the minimum vote threshold automatically scales down from 200 to 25 (`vote_count.gte=25`), ensuring acclaimed regional cinema is never hidden by global vote volume disparities.

### ⚡ Live Search
- **Debounced Real-Time Search**: Live input querying TMDB with a 400ms debounce.
- **Request Cancellation**: Automated `AbortController` cancellation for previous in-flight requests on every keystroke.
- **Quick Suggestions**: Clickable popular search chips when idle, with clean zero-state and error-state fallbacks.

### 🎭 Explore Genres with Dynamic Backdrops
- **16 Curated Genre Tiles**: Action, Adventure, Animation, Comedy, Crime, Documentary, Drama, Family, Fantasy, History, Horror, Music, Mystery, Romance, Science Fiction, and Thriller.
- **Viewport-Deferred Fetching (`useInView`)**: TMDB backdrop images are only fetched when tiles enter within 120px of the viewport, preventing burst requests.
- **24-Hour Local Caching**: Successful backdrop image paths are cached in `localStorage` for 24 hours to minimize API usage.
- **Graceful Fallbacks**: On image loading or error, tiles smoothly display the genre-tinted gradient without broken layout or visual glitches.
- **Hover Micro-Interactions**: Slow image zoom (`scale(1.08)`) and 4px tile elevation with genre-colored glow shadows.

### 📽️ Movie Details Page
- **Full-Bleed Hero Backdrop**: High-resolution backdrop fading seamlessly into the plum page background.
- **Frosted Glass Info Panel**: Clean presentation of title, tagline, genres, director, release year, runtime, and original language.
- **Official YouTube Trailer**: Embedded inside a glass frame via `youtube-nocookie.com`, activated on click to preserve bandwidth.
- **Interactive 5-Star Rating**: User rating from 0.5 to 5.0 stars with instant clear toggle.
- **Top Cast Carousel**: Scrollable cards with actor photos and character names.
- **Related Movies**: Similar and recommended rows.

### 📚 Personal Collections & Library
- **Favorites & Watchlist**: One-click toggles with animated heart and bookmark buttons.
- **Multi-Criteria Sorting**: Sort saved collections by *Recently Added*, *Oldest*, *Title A–Z*, *Release Year*, or *Personal Rating*.
- **Recently Viewed**: Automatic tracking of the last 20 viewed titles.

### 👤 Profile Customization
- **Local User Profile**: Editable display name, avatar accent color picker, preferred language selector, and favorite genre selections.
- **Library Statistics**: Real-time counters for total favorites, watchlist items, and rated titles.
- **Recently Viewed Reel**: Interactive list with quick links to revisit movie detail pages.

### 🇮🇳 Indian & World Language Support
- **12 Indian Languages**: Hindi (`hi`), Tamil (`ta`), Telugu (`te`), Malayalam (`ml`), Kannada (`kn`), Bengali (`bn`), Marathi (`mr`), Punjabi (`pa`), Gujarati (`gu`), Odia (`or`), Assamese (`as`), and Urdu (`ur`) with native script labels.
- **13 World Languages**: English, Korean, Japanese, French, Spanish, German, Italian, Chinese, Portuguese, Russian, Arabic, Thai, and Turkish.

---

## Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Component architecture, state management, and modern hooks |
| **TypeScript** | Strict compile-time typing, TMDB response modeling, and zero `any` usage |
| **Vite 6** | Ultra-fast development server and optimized production bundling |
| **Tailwind CSS v4** | Modern styling using `@theme` design tokens in `src/index.css` |
| **React Router v7** | Client-side routing and URL search parameter synchronization |
| **Lucide React** | Lightweight, accessible SVG icon kit |

---

## Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/CodeeSAI/CineMatch.git
cd CineMatch
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Obtain a TMDB API Key
1. Register for a free account at [The Movie Database (TMDB)](https://www.themoviedb.org/signup).
2. Go to your account [API Settings](https://www.themoviedb.org/settings/api).
3. Request an **API Key (v3 auth)** under the Developer option.

### 4. Configure Environment Variables
Copy the `.env.example` template to `.env.local`:
```bash
cp .env.example .env.local
```
Open `.env.local` and paste your TMDB API Key:
```env
VITE_TMDB_API_KEY=your_actual_tmdb_api_key_here
```

### 5. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 6. Production Build & Type Checking
```bash
# Type check without emitting files
npx tsc --noEmit

# Build production bundle
npm run build
```

---

## Project Structure

```
CineMatch/
├── .vscode/               # VS Code workspace settings (CSS lint rules)
├── public/                # Static public assets
├── src/
│   ├── components/
│   │   ├── layout/        # Layout, Navbar, Footer, MobileMenu
│   │   ├── movie/         # HeroSection, MovieCard, MovieGrid, MovieRow
│   │   └── ui/            # BackButton, EmptyState, ErrorState, GenreTag,
│   │                      # ImageWithFallback, Logo, SetupRequired, Skeleton
│   ├── context/
│   │   ├── GenresContext.tsx   # Cached TMDB genre definitions and ID lookups
│   │   └── LibraryContext.tsx  # Global state for Favorites, Watchlist, Ratings & Recents
│   ├── hooks/
│   │   ├── useDebounce.ts      # Debounce utility for real-time search
│   │   ├── useFetch.ts         # Generic fetch lifecycle hook with AbortController
│   │   ├── useGenreBackdrop.ts # Viewport-deferred genre backdrops with 24h cache
│   │   └── useInView.ts        # IntersectionObserver hook for viewport visibility
│   ├── lib/
│   │   ├── format.ts           # Rating, date, runtime, and currency formatting helpers
│   │   ├── genreColors.ts      # Cinema Neon palette mapping for 16 primary genres
│   │   ├── languages.ts        # 12 Indian + 13 World language definitions and helpers
│   │   ├── movie.ts            # SavedMovie mappers and star rating calculation
│   │   └── recommend.ts        # Transparent rule-based recommendation scoring engine
│   ├── pages/
│   │   ├── Discover/           # Catalogue exploration with URL-synced FilterPanel
│   │   ├── Favorites/          # Saved favorites with multi-criteria sorting
│   │   ├── GenreMovies/        # Genre-specific movie listings with dynamic header banner
│   │   ├── Genres/             # 16 interactive genre cards with backdrop preview
│   │   ├── Home/               # Hero carousel, Indian Cinema tabs, and movie rows
│   │   ├── MovieDetails/       # Backdrop hero, YouTube trailer, cast, and rating
│   │   ├── NotFound/           # 404 Scene Not Found error page
│   │   ├── Profile/            # User settings, stats, and recently viewed movies
│   │   ├── Search/             # Instant debounced search with keyword suggestions
│   │   └── Watchlist/          # Saved watchlist titles with sorting
│   ├── services/
│   │   ├── storage/            # LocalStorage wrappers (favorites, watchlist, ratings, etc.)
│   │   └── tmdb/               # Strongly-typed TMDB API client and endpoint methods
│   ├── types/                  # App-wide domain models, API schemas, and error types
│   ├── App.tsx                 # Root application routes and SetupRequired guard
│   ├── index.css               # Tailwind v4 @theme design tokens and utility styles
│   └── main.tsx                # React DOM mount point
├── .env.example           # Environment template
├── package.json           # Dependencies and project scripts
├── tsconfig.json          # TypeScript compiler configuration
└── vite.config.ts         # Vite bundler configuration
```

---

## Data Flow Architecture

CineMatch follows a unidirectional, decoupled data flow:

```
┌────────────────┐      ┌─────────────────────────┐      ┌──────────────────────┐      ┌──────────────────┐
│ UI Components  │ ───> │ React Hooks & Contexts  │ ───> │ TMDB Service Layer   │ ───> │ The Movie Database│
│ (Pages, Cards) │ <─── │ (useFetch, LibraryCtx)  │ <─── │ (tmdbFetch, client)  │ <─── │ (api.themoviedb) │
└────────────────┘      └─────────────────────────┘      └──────────────────────┘      └──────────────────┘
        │
        ▼
┌─────────────────────────┐
│ LocalStorage Services   │
│ (cinematch_v1_* keys)   │
└─────────────────────────┘
```

1. **Component**: Renders UI, triggers user actions or mounts (e.g. `MovieRow`, `DiscoverPage`).
2. **Hook / Context**: Coordinates component state, listens to route changes (`useSearchParams`), manages abort signals (`AbortController`), or pulls from global context (`LibraryContext`, `GenresContext`).
3. **Service Layer**: Handles request serialization, URL search parameters, error wrapping (`ApiError`), and caching (`src/services/tmdb/*`, `src/services/storage/*`).
4. **TMDB API**: Returns JSON responses conforming strictly to TypeScript interfaces in `src/services/tmdb/types.ts`.

---

## Local Storage Persistence

All user personalization is stored locally in the browser under a versioned namespace prefix (`cinematch_v1_`) via `src/services/storage/base.ts`:

| Key Name | Type | Description |
| :--- | :--- | :--- |
| `cinematch_v1_favorites` | `SavedMovie[]` | Array of saved favorite movie records |
| `cinematch_v1_watchlist` | `SavedMovie[]` | Array of movies bookmarked for later |
| `cinematch_v1_ratings` | `Record<number, StarRating>` | Map of movie ID to personal score (0.5 to 5.0) |
| `cinematch_v1_recently_viewed` | `SavedMovie[]` | Last 20 movies viewed (deduplicated, newest first) |
| `cinematch_v1_profile` | `UserProfile` | Name, avatar color, preferred language, and favorite genre IDs |
| `cinematch_v1_genre_backdrop_<id>` | `{ path: string, timestamp: number }` | Cached TMDB backdrop image path per genre with a 24-hour expiration |

All reads and writes are wrapped in safe `try/catch` blocks to protect against private browsing limitations or storage quota exceptions.

---

## Recommendation Engine (Rule-Based Heuristic)

> **Important**: CineMatch does **NOT** use machine learning, neural networks, or artificial intelligence for recommendations. All suggestions are generated through a deterministic, transparent heuristic scoring algorithm implemented in [`src/lib/recommend.ts`](file:///c:/Users/R%20SAI%20GANESH/OneDrive/Documents/CineMatch/src/lib/recommend.ts).

### How It Works

1. **Seed Gathering**:
   - The engine selects up to **3 seed movies** (`MAX_SEEDS = 3`) from the user's favorites and titles rated **≥ 4.0 stars**.
2. **Exclusion List**:
   - Any movie already present in favorites, watchlist, or personal ratings is strictly excluded from candidate recommendations.
3. **Genre Profiling**:
   - A target genre set is assembled combining genres from seed movies, watchlist titles, and profile-selected favorite genres.
4. **Candidate Retrieval**:
   - For each seed, TMDB `/movie/{id}/recommendations` and `/movie/{id}/similar` are queried in parallel. Candidates with fewer than 100 votes (`vote_count < 100`) are dropped.
5. **Scoring Formula**:
   Every candidate movie receives a composite score between `0.0` and `1.05`:
   $$\text{Score} = (0.40 \times \text{GenreMatch}) + (0.30 \times \text{Rating}) + (0.20 \times \text{SeedOverlap}) + (0.10 \times \text{Popularity}) + \text{LanguageBoost}$$

   - **Genre Match ($0.40$)**: Fraction of the candidate's genres that intersect with the user's genre profile.
   - **Rating ($0.30$)**: TMDB average score scaled from $[0, 10]$ to $[0, 1]$.
   - **Seed Overlap ($0.20$)**: Proportion of the user's seed movies that independently suggested this candidate.
   - **Popularity ($0.10$)**: Normalized TMDB popularity index capped at 1.0.
   - **Preferred Language Boost ($+0.05$)**: Additive bonus if the candidate's `original_language` matches the user's preferred language in Profile.
6. **Result**:
   The top 15 highest-scoring candidates are presented in the recommendation carousel with a contextual reason tag (e.g., *"Because you liked Inception"*).

---

## TMDB Attribution

This product uses the TMDB API but is not endorsed or certified by TMDB.

[![TMDB Logo](https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg)](https://www.themoviedb.org/)

---

## Honest Limitations

As an academic and portfolio prototype, CineMatch has intentional architectural trade-offs:
- **Client-Side Environment Variables**: Because CineMatch runs as a static client application on Vite, `VITE_TMDB_API_KEY` is embedded in the compiled JavaScript bundle. In a commercial production environment, API keys should be held on a secure backend proxy server to prevent unauthorized extraction.
- **Single-Browser Local Storage**: Personalization, ratings, favorites, and watchlist items reside strictly in the browser's `localStorage`. They do not synchronize across devices or private browsing sessions.
- **No User Authentication**: There is no login, user database, or session management; each browser profile acts as an independent sandbox.
- **TMDB Rate Limiting**: The client relies directly on TMDB API rate limit allowances (typically ~40 requests per 10 seconds).

---

## Future Roadmap

- [ ] **Backend Proxy Service**: Lightweight Node/Express or Edge function proxy to hide API credentials and enforce server-side caching and rate limiting.
- [ ] **User Accounts & Cloud Sync**: Optional Firebase or Supabase authentication to synchronize favorites and ratings across devices.
- [ ] **Custom Lists**: Ability to create custom curated playlists (e.g., *"Halloween Marathons"*, *"Weekend Binge"*).
- [ ] **Reviews & Diary**: User review logs with date tracking and personal notes.
- [ ] **Offline PWA Support**: Service worker caching for offline library browsing.

---

## License

This project was built for educational and demonstration purposes. Source code is licensed under the [MIT License](LICENSE).
