# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at localhost:5173
npm run build     # Production build (Vite)
npm run lint      # ESLint
npm run preview   # Preview production build locally
```

No tests are configured.

## Branch state

Active development is on `battle-feature`. The `main` branch is untouched. Do not push to `main`.

Battle feature is planned for implementation:
- Select two Pokémon and simulate a winner
- Turn-based damage calculation using Attack/Defense stats
- Type effectiveness multipliers from colorMap.js typeChart
- Dynamic battle commentary

---

## Tech Stack

- **React 18** + **Vite 5**
- **React Router v6** — `<BrowserRouter>` with nested routes in `App.jsx`
- **Styled-components 6** — CSS-in-JS, prop-driven dynamic styles
- **PokeAPI** — public REST API, no auth required

---

## Directory Structure

```
src/
  api/              pokeAPI.js — all fetch functions
  components/       Reusable UI: PokemonCard/, Nav/, Footer/, Pokeball/
  context/          CartContext.jsx, PokemonCacheContext.jsx
  pages/            Route-level components
    Home/
    Collection/     Browse + filter (/collection)
    PokemonCatalogue/ Cards shopping page (/pokemoncards)
    PokemonDetail/  Detail view (/collection/:id)
    Cart/
  reducers/         pokemonReducer.js, pokemonListReducer.js
  utils/            colorMap.js, stringUtils.js, theme.js
```

Each component folder has a co-located `*.styled.jsx` file. Shared styled-components constants live in `src/utils/theme.js`.

---

## Routing

Defined in `src/App.jsx`, which wraps the full tree in `<CartProvider><PokemonCacheProvider>`:

| Path | Component |
|------|-----------|
| `/` | Home |
| `/collection` | Browse/search all 1025 Pokémon |
| `/collection/:id` | Pokémon detail (numeric ID or name string) |
| `/pokemoncards` | Pokémon card catalog (shopping) |
| `/cart` | Shopping cart |

---

## PokemonCacheContext

**File:** `src/context/PokemonCacheContext.jsx`

Single shared cache for the entire app — both the list and individual detail data. Eliminates redundant fetches across components.

### What it exposes

```js
const { listState, fetchNextListPage, fetchAllListPages, fetchPokemonDetail } = usePokemonCache();
```

- **`listState`** — `{ list, nextUrl, fullyLoaded, loading, error, totalCount }`
  - `list` — array of `{ name, url }` from the species endpoint
  - `totalCount` — populated from `data.count` on first fetch (1025)
- **`fetchNextListPage()`** — loads one page (20 entries), no-op if loading/done
- **`fetchAllListPages()`** — loads all pages sequentially with incremental updates, no-op once done
- **`fetchPokemonDetail(index)`** — fetches + caches detail data
  - Returns `null` for numeric indices beyond `totalCount`
  - String keys (e.g. `"eevee"`) bypass the numeric range guard
  - Cache hits return instantly from a `useRef(new Map())` — no re-fetch on revisit

### Caching strategy

Detail data is keyed by the `index` value passed in (number or string). Results are stored in a module-level `Map` via `useRef`. The cache persists for the full session and is shared across all components via context.

### Why `/pokemon-species/` not `/pokemon/`

The `/pokemon/` endpoint returns ~1302 entries including alternate forms (mega evolutions, regional variants). These cause 404s on the species endpoint. `/pokemon-species/` returns exactly 1025 canonical species.

---

## pokemonReducer

**File:** `src/reducers/pokemonReducer.js`

Used by `SinglePokeCard`, `PokemonCard`, and `MoreInfoLanding` via `useReducer(pokemonReducer, initialPokeDetails)`.

### Actions

- `setPokemonDetails` — populates all fields from `{ pokemonDetailData, pokemonSpeciesData, evolutionData }`
- `setError` — sets `loading: false`, `error: message`
- `setLoading` — (default case) sets `loading: false`

### Key fields on state

```js
{
  id, name, height, weight,
  types,           // raw PokeAPI types array
  stats,           // { hp, attack, defense, specialAttack, specialDefense, speed }
  moves,           // raw PokeAPI moves array
  sprites,         // array of { description, picture } objects (14 entries, Gen 1–8 + variants)
  legendary,       // boolean from pokemonSpeciesData.is_legendary
  mythical,        // boolean from pokemonSpeciesData.is_mythical
  description,     // sanitized flavor text entry [0]
  description2,    // sanitized flavor text entry [2]
  description3,    // sanitized flavor text entry [3]
  isLinearChain,   // boolean — true if every node has ≤1 evolution
  evolutionChainStages,  // ordered array for linear chains (all stages root→leaf)
  nextEvolutions,  // direct children for branching chains only
  evolutionTree,   // { evolvesFrom: { name, id } | null, nextEvolutions }
  loading, error
}
```

---

## Evolution Chain Parsing

The most complex part of the codebase. Handled entirely in `pokemonReducer.js` inside `setPokemonDetails`.

### How `evolutionData` is built

`fetchEvolutionData(chainUrl, evolvesFromUrl)` in `pokeAPI.js`:
1. Fetches the evolution chain (`/evolution-chain/{id}/`)
2. Fetches `evolves_from_species.url` from the species data (the immediate parent species)
3. Returns `{ ...evolutionChain, evolvesFrom: <parent species data or null> }`

`evolutionData.evolvesFrom` is therefore the **already-fetched** parent species object from PokeAPI — use it directly, do not re-derive it from the chain tree.

### Linear vs branching code paths

```
checkLinear(node) — returns true if every node has ≤1 evolves_to (recursive)
```

**LINEAR** (Charmander → Charmeleon → Charizard):
- `isLinearChain = true`
- `evolutionChainStages` = full ordered array from root to leaf via `extractLinearChain`
- `nextEvolutions = []`
- Every stage in the chain (Charmander, Charmeleon, Charizard) stores the same complete `evolutionChainStages` array
- `Evolution.jsx` renders "Evolution Chain" title + all stages

**BRANCHING** (Eevee → 8 Eeveelutions; Slowpoke → Slowbro + Slowking; Tyrogue → 3 branches):
- `isLinearChain = false`
- `evolutionChainStages = []`
- `nextEvolutions` = direct children of the current node, found via `findNode(chain, speciesId)` DFS
- `evolvesFrom` = from `evolutionData.evolvesFrom` directly (Eevee for all Eeveelutions)
- `Evolution.jsx` renders "Evolves From" card (if parent exists) + "Evolves Into" grid

### Eevee edge case

Eevee (id 133) has 8 simultaneous branches in `evolves_to`. The critical fix: **do not** try to derive `evolvesFrom` by searching the tree — use `evolutionData.evolvesFrom` which PokeAPI already provides via `evolves_from_species`. This correctly assigns Eevee as parent for all 8 Eeveelutions without any custom traversal logic.

---

## Evolution Display (`Evolution.jsx`)

Two explicit code paths based on `memoPokemon.isLinearChain`:

```jsx
// Linear: show full chain, same on every stage's page
if (isLinearChain) {
    if (evolutionChainStages.length <= 1) return null; // no-evolution Pokémon
    return <Title>Evolution Chain</Title> + <EvolutionGridContainer count={stages.length}>...
}

// Branching: show parent and children separately
return (
    evolvesFrom  → <Title>Evolves From</Title> + single card (count=1)
    nextEvolutions → <Title>Evolves Into</Title> + grid (count=nextEvolutions.length)
)
```

`EvolutionGridContainer` accepts a `count` prop to cap column count:
- `count=1` → always 1 column, centered
- `count=2` → max 2 columns at ≥1000px
- `count≥3` → up to 3 columns at ≥1350px, wraps to rows for 4+

---

## Sprite Fallback Strategy

Dream-world SVGs only exist for older Pokémon (roughly Gen 1–5). Gen 6+ use `official-artwork` PNGs.

**In `SinglePokeCard.jsx`:**
```jsx
<PokemonSVG
    src={`...dream-world/${index}.svg`}
    onError={(e) => {
        e.currentTarget.onError = null;
        e.currentTarget.src = `...official-artwork/${index}.png`;
    }}
/>
```

The `onError` is cleared after firing to prevent infinite loops. `index` here is the numeric species ID (1-based position in the list).

---

## Filter System (`/collection` page)

**`FilterPokemon.jsx`** manages a dropdown (`selectedOption` string) lifted up to `BrowseLanding.jsx` and passed down to `SinglePokeCard` via props.

**Options:**
- `''` — show all (default)
- Any type name (lowercase, e.g. `"fire"`) — from `colorMap` keys, rendered capitalized
- `"Legendary"` — filters on `pokemonDetails.legendary`
- `"Mythical"` — filters on `pokemonDetails.mythical`

**Filter logic in `SinglePokeCard.jsx`:**
```js
if (selectedOption === '') return card;
if (selectedOption === 'Legendary') return pokemonDetails.legendary ? card : null;
if (selectedOption === 'Mythical') return pokemonDetails.mythical ? card : null;
if (selectedOption === pokemonDetails?.types[0]?.type?.name) return card;
return null;
```

Filters only against the **primary type** (index 0). Type options are memoized with `useMemo([], [])` since `colorMap` is static.

---

## Base Stat Total Component (`Stats.jsx`)

Displayed on the detail page between the description and moves sections.

**TBS_MAX = 800** (used for the progress bar percentage)

### 7-Tier Approachability Scale

| TBS Range | Label | Color |
|-----------|-------|-------|
| ≤ 250 | Approachable | `#757575` |
| ≤ 330 | Beginner Friendly | `#78909c` |
| ≤ 420 | Moderate | `#66bb6a` |
| ≤ 500 | Intermediate | `#29b6f6` |
| ≤ 580 | Advanced | `#ab47bc` |
| ≤ 699 | Expert | `#ff7043` |
| 700+ | Untouchable | `#ffffff` |

**Color logic:**
- **TBS number** — uses `colorMap[primaryType].color` (the Pokémon's primary type color), falls back to `tier.color`
- **Progress bar fill** — same type color as the number
- **Tier label** — uses `tier.color` from the table above
- **Untouchable tier** — sets `exceptional=true` → font-size 4em + `text-shadow: 0 0 6px rgba(255,255,255,0.6)`

---

## Text Sanitization

`sanitizeFlavorText(text)` in `src/utils/stringUtils.js` cleans PokeAPI flavor text artifacts before storing:
- Replaces `\f` and `\n` with spaces
- Removes soft hyphens (`\u00AD`)
- Removes unicode arrow characters (`\u2190–\u21FF`)
- Collapses multiple spaces, trims

Applied in `pokemonReducer.js` to `description`, `description2`, `description3` (flavor text entries at indices 0, 2, 3).

---

## `capitalizeFirstLetter` Convention

**Source:** `src/utils/stringUtils.js`

```js
export function capitalizeFirstLetter(string) {
    if (typeof string !== 'string') return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}
```

Used anywhere a Pokémon name (lowercase from API) is displayed to the user:
- `SinglePokeCard.jsx` — card name
- `PokemonCard.jsx` — card name and special move
- `PreviousPokemon.jsx` — "evolves from" badge name
- `About.jsx` — detail page subtitle
- `MoreInfoHeading.jsx` — detail page heading
- `FilterPokemon.jsx` — dropdown option labels

Do not inline `.charAt(0).toUpperCase()` — always import from `stringUtils`.

---

## Design System

### Colors

- **Form borders / nav accent:** `#3b4cca` — defined as `colors.formBorder` in `src/utils/theme.js`
- **Type colors:** all sourced from `colorMap[typeName].color` (e.g. fire = `#FF6D00`, water = `#2389da`)
- **Darker type variants** for badges: `colorMap[typeName].darkerColor`
- **Background:** `#242424` (Vite dark default, used in card tracks and detail backgrounds)
- **Card borders:** `yellow` / `gold` throughout

### Styled-components Conventions

- Every component folder has a co-located `*.styled.jsx`; do not put styled components inline
- Dynamic props use the `${}` template syntax: `background-color: ${({ type }) => colorMap[type]?.color}`
- Prop names that are only for styling (not passed to DOM) use lowercase camelCase: `tiercolor`, `glowcolor`, `exceptional`, `backgroundType`, `count`
- The `Link` from react-router-dom is frequently extended: `styled(Link)` for navigable containers

### Responsive Breakpoints

Consistent breakpoints used across the app (mobile-first, `min-width`):

| Breakpoint | Usage |
|------------|-------|
| 360px | Narrow mobile (reduce card to 350px) |
| 400px | Standard mobile (card at 400px) |
| 700px / 768px | Tablet — stack layouts, adjust font sizes |
| 900px / 980px | Mid tablet |
| 1000px | 2-column grids |
| 1068px | Large tablet — detail page heading adjustments |
| 1350px | Desktop — 3-column grids |
| 1500px+ | Wide desktop — larger images |

---

## Performance Patterns

- **`IntersectionObserver`** in `PokemonCard.jsx` (`rootMargin: 200px`) — defers API fetch until card is near viewport; off-screen cards render an empty placeholder `<IndividualPokeContainer ref={containerRef} />`
- **Detail cache** — `useRef(new Map())` in `PokemonCacheContext`; revisiting any Pokémon detail page is instant
- **Type filter options** — memoized with `useMemo([], [])` in `FilterPokemon.jsx` since `colorMap` is static
- **List pagination** — `/pokemoncards` loads one page at a time (Load More button); `/collection` loads all pages on mount via `fetchAllListPages()`

