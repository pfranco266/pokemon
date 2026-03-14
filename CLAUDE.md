# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at localhost:5173
npm run build     # Production build
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

There are no tests configured in this project.

## Architecture

**Stack:** Vite + React 18, React Router v6, Styled-components, PokeAPI

**Routing** (`src/App.jsx`):
- `/` — Home
- `/collection` — Browse/search all Pokémon (full Pokédex, ~1025 entries)
- `/collection/:id` — Pokémon detail view (supports numeric ID or name string)
- `/pokemoncards` — Pokémon cards catalog (main shopping page)
- `/cart` — Shopping cart

`App.jsx` wraps the entire tree in `CartProvider` and `PokemonCacheProvider`.

**State Management:**
- Cart state: `src/context/CartContext.jsx` — React Context + useState, persisted to localStorage. Provides `cart`, `setCart`, `totalAmount`.
- Pokémon cache: `src/context/PokemonCacheContext.jsx` — single shared cache for the full list and individual detail data. Key API:
  - `fetchNextListPage()` — loads one page (20 entries); no-op if already loading/done
  - `fetchAllListPages()` — loads all pages sequentially with incremental updates; no-op once fully loaded
  - `fetchPokemonDetail(index)` — fetches + caches detail data by index or name string; returns `null` for out-of-range indices; cache hit returns instantly with no API call
- Individual Pokémon detail state: `useReducer(pokemonReducer)` in each component that displays a card

**Data Fetching** (`src/api/pokeAPI.js`):
1. `fetchPokeList(url)` — paginated species list from `/pokemon-species/` (1025 entries, no alternate forms)
2. `fetchSinglePokemon(index)` — fetches `/pokemon/{index}` + `/pokemon-species/{index}` in parallel
3. `fetchEvolutionData(chainUrl, evolvesFromUrl)` — builds evolution chain data

The list uses `/pokemon-species/` (not `/pokemon/`) to avoid the ~1302 alternate-form entries that would cause 404s on the species endpoint.

**Type System** (`src/utils/colorMap.js`):
Central mapping of all 18 Pokémon types to colors, icons, and weakness/resistance data. Used throughout for dynamic card styling and computing weaknesses via Set deduplication.

**Shared Utilities** (`src/utils/`):
- `colorMap.js` — 18-type color/icon/weakness map
- `stringUtils.js` — `capitalizeFirstLetter`, `sanitizeFlavorText` (cleans PokeAPI flavor text artifacts: `\f`, soft hyphens, unicode arrows)
- `theme.js` — `colors.formBorder` (`#3b4cca`) used in styled-components for form input borders

**Styling:** Styled-components throughout. Each component folder has a `*.styled.jsx` file. Shared theme constants are in `src/utils/theme.js`.

**Cart items** are keyed by Pokémon `index` (not UUID), so adding the same Pokémon increments its `amount` field rather than creating a new entry.

**Performance patterns:**
- `PokemonCard` uses `IntersectionObserver` (`rootMargin: 200px`) to defer API fetches until the card is near the viewport. Cards off-screen render an empty placeholder.
- The type filter dropdown options are memoized with `useMemo` since they derive from the static `colorMap`.
- Detail pages use `fetchPokemonDetail` from cache — revisiting a Pokémon renders instantly without re-fetching.
