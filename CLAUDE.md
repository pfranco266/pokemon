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
- `/collection` — Browse/search all Pokemon
- `/collection/:id` — Pokemon detail view
- `/pokemoncards` — Pokemon cards catalog (main shopping page)
- `/cart` — Shopping cart

`App.jsx` also wraps the entire tree in `CartProvider`.

**State Management:**
- Cart state lives in `src/CartContext.jsx` using React Context + useState, persisted to localStorage. Provides `cart`, `setCart`, and `totalAmount`.
- Paginated Pokemon list state managed via `useReducer` in `src/assets/Reducers/pokemonListReducer.js` (tracks loading, error, list, nextUrl).
- Individual Pokemon detail state managed via `useReducer` in `src/assets/Reducers/pokemonReducer.js`.

**Data Fetching** (`src/assets/Reducers/pokeAPI.js`):
Three main functions called in sequence:
1. `fetchPokeList(url)` — paginated list (20 per page)
2. `fetchSinglePokemon(index)` — fetches Pokemon + species data in parallel
3. `fetchEvolutionData(chainUrl, evolvesFromUrl)` — cascading calls to build evolution chain

**Type System** (`src/assets/Pokemon/colorMap.js`):
Central mapping of all 18 Pokemon types to colors, icons, and weakness/resistance data. Used throughout for dynamic card styling and computing weaknesses via Set deduplication.

**Styling:** Styled-components throughout. Each component folder typically has a `*.styled.jsx` file alongside the component.

**Cart items** are keyed by Pokemon `index` (not UUID), so adding the same Pokemon increments its `amount` field rather than creating a new entry.
