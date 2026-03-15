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

---

## Pokémon Detail Page Features

### Prev / Next Navigation (`MoreInfoLanding.jsx`)

`PrevPokeButton` and `NextPokeButton` are fixed to the vertical center of the viewport edges. Both are styled with `typeColor` (`colorMap[primaryType]?.color ?? '#ffcc00'`) as the icon color and use `IoMdArrowRoundBack` (mirrored for Next via `rotateY(180deg)`).

- `PrevPokeButton` hidden when `pokemonId <= 1`
- `NextPokeButton` hidden when `pokemonId >= totalCount` (from `listState.totalCount`)
- Navigation calls `navigate(\`/collection/${pokemonId ± 1}\`)`

### Habitat Banner (`About.jsx`)

Rendered directly below the "About [Name]" subtitle, before the sprite/text section.

- Full-width banner, `border-radius: 8px`, `padding: 0.85rem`
- Background: `colorMap[primaryType].color`; border top/bottom: `colorMap[primaryType].darkerColor`
- Null habitat: grey background `#424242`, border `#333`, text "Unknown Habitat"
- Contains an inline SVG Google Maps–style pin (Material Design `location_on` path, white, 22px) + capitalized habitat name
- `HabitatBanner` in `MoreInfo.styled.jsx` is a flex row (`align-items: center; justify-content: center; gap: 0.5em`)
- Requires `colorMap` import in `About.jsx`; props: `typecolor`, `darkercolor`

### Capture Rate (`Stats.jsx`)

Stored in `pokemonReducer` state as `capture_rate: pokemonSpeciesData.capture_rate ?? null`.

- Displayed inside a collapsible accordion below the Base Stat Total bar
- `CAPTURE_MAX = 255`; bar percentage = `Math.round((rate / 255) * 100)`
- 6-tier difficulty label from `getCaptureLabel(rate)`:

| Rate | Label |
|------|-------|
| ≥ 200 | Very Easy |
| ≥ 150 | Easy |
| ≥ 100 | Moderate |
| ≥ 45 | Difficult |
| ≥ 10 | Very Difficult |
| < 10 | Near Impossible |

- Uses the same `TBSContainer` / `TBSBarTrack` / `TBSBarFill` styled components as the Base Stat Total
- Not rendered if `capture_rate` is null
- The accordion toggle (gold circular button, `AccordionToggle`) is at the bottom of the TBS card; `AccordionChevron` rotates ±90° via `isopen` prop

### Radar Chart (`Stats.jsx`)

Permanently visible below the accordion, never inside it. Wrapped in `BattleRoleContainer` (black bg, yellow border) alongside a stat legend.

**Layout:** `StatsSideBySide` flex row — chart left (55%), legend right (45%). Stacks vertically below 700px.

**SVG details:**
- `viewBox="0 0 300 300"`, `CX=150, CY=150, R=85` (chart radius), `LABEL_R=112` (icon radius), `NUM_R=132` (number radius)
- 6 axes at 60° intervals, starting at top (−90°): HP → Attack → Defense → Sp.Atk → Sp.Def → Speed
- Non-linear scale: `Math.pow(rawStat / 255, 0.6)` — amplifies differences between stats
- Grid rings at 25/50/75/100% of R, dashed except outermost: `rgba(255,255,255,0.4)`
- Axis lines center→tip: `rgba(255,255,255,0.8)`
- Data polygon: `fill="rgba(255,255,255,0.15)"`, `stroke="rgba(255,255,255,0.9)"`, `strokeWidth=2`
- Stat icons (22px, inline style override) positioned as absolute HTML overlays at `LABEL_R` percentage coords
- Stat values (0.95rem, white, bold) positioned as absolute `<span>` overlays at `NUM_R` — always outward from icons, never overlapping chart lines

**Legend (right side):** `StatLegendSection` — one `StatLegendRow` per stat: icon at 24px + full stat name. No numbers in the legend (numbers are on the chart).

### Attack Icon Color

`AttackIcon` (`LuSword`) color changed from `navy` to `#90caf9` (light blue) for visibility at small sizes against dark backgrounds. No other icon colors changed.

### Type Badges (`About.jsx`)

Rendered directly below the "About [Name]" subtitle, above the `HabitatBanner`.

- One `TypeBadge` per type (1 or 2), in a `TypeBadgesRow` flex row with `gap: 0.5em`
- Both components defined in `MoreInfo.styled.jsx`
- Color sourced from `colorMap[typeName]?.color`; badge background uses `${color}33` (20% alpha), border uses solid color
- `capitalizeFirstLetter` applied to each type name for display
- **Not** in the header — removed from `MoreInfoHeading.jsx` to avoid overlapping the legendary/mythical animated banner

### Detail Page Section Order (`MoreInfoBody.jsx`)

```
About → Stats → Moves → PokemonAbilities → Evolution
```

- "Natural Abilities" section renamed to **"Moves"** (`Moves.jsx`) — shows level-up moves sorted by level
- Each move name is a gold `Link` to `/moves/:name` (styled `MoveLink` in `Moves.jsx`)
- `PokemonAbilities` moved to after Moves:
  - Standard (non-hidden) abilities shown as gold `Link`s to `/abilities/:name`
  - Hidden abilities in a collapsible accordion (`AccordionToggle` / `AccordionChevron` / `AccordionContent` from `MoreInfo.styled.jsx`), default collapsed
  - Hidden ability names also link to `/abilities/:name` with `HiddenBadge` next to them
  - `abilities` field on `pokemonReducer` state: `[{ name, isHidden, slot }]`

### Sprite Fallback — Header (`MoreInfoHeading.jsx`)

Same pattern as `SinglePokeCard.jsx`: dream-world SVG attempted first, `onError` swaps to official-artwork PNG:

```jsx
onError={(e) => {
    e.currentTarget.onError = null;
    e.currentTarget.src = `...official-artwork/${memoPokemon.id}.png`;
}}
```

Fixes broken sprites for Gen 6+ Pokémon (Aegislash, Meowstic, Furfrou, etc.).

---

## Abilities System

### Context (`AbilitiesCacheContext.jsx`)

Wraps the full app in `App.jsx`. Exposes:

```js
const { abilities, loading, fullyLoaded, fetchAbilities, fetchAbilityDetail } = useAbilitiesCache();
```

- **`fetchAbilities()`** — fetches all ~400 abilities from `/ability?limit=400`, batch-fetches full detail in groups of 20, stores `{ name, shortEffect }` in state; falls back to `flavor_text_entries` if `effect_entries` is empty; incremental display as batches complete
- **`fetchAbilityDetail(name)`** — fetches `/ability/:name`, caches full raw response in `detailCacheRef` (separate `Map` from listing data); returns from cache on repeat calls

### Listing Page (`/abilities`)

- Page title, gold decorative line, clarification description paragraph below the line
- Real-time search filtering against ability name (spaces → hyphens before comparing)
- Alternating row backgrounds, gold left-border on hover, each row links to `/abilities/:name`
- `NoDescription` fallback for abilities with no effect text

### Detail Page (`/abilities/:name`)

Sections in order:
1. Back link, page title, gold line, generation badge ("Introduced in Generation X")
2. **Effect** — full `effect_entries[en].effect` with `$effect_chance$` not replaced (no `effect_chance` field on abilities)
3. **Game Descriptions** — `flavor_text_entries` filtered to English, consecutive duplicates removed, version badge + text in 2-column grid
4. **Pokémon with this Ability** — split into "Standard Ability" and "Hidden Ability" subsections; filtered to base forms only (ID ≤ 1025), deduplicated by name, each links to `/collection/:id`

### Alternate Form Filtering

Any Pokémon list that comes from an ability or move endpoint uses:

```js
const isBaseForm = (p) => parseInt(p.pokemon.url.split('/').filter(Boolean).pop()) <= 1025;
```

IDs > 1025 are alternate forms (mega evolutions, regional variants, battle bonds). After filtering, deduplicate by name in case the same base species appears twice.

---

## Moves System

### Context (`MovesCacheContext.jsx`)

Wraps the full app in `App.jsx` inside `AbilitiesCacheProvider`. Exposes:

```js
const { moves, loading, fullyLoaded, fetchMoves, fetchMoveDetail } = useMovesCache();
```

- **`fetchMoves()`** — fetches all ~1000 moves from `/move?limit=1000`, batch-fetches full detail in groups of 20; stores summary rows in state; **also caches full detail data** in `detailCacheRef` during the batch, so navigating to a detail page after the listing is loaded is instant; `$effect_chance$` placeholders replaced with `move.effect_chance` value at cache time
- **`fetchMoveDetail(name)`** — checks `detailCacheRef` first (populated during batch), fetches `/move/:name` only if not already cached

### Listing Page (`/moves`)

**File:** `src/pages/Moves/MovesLanding.jsx` + `Moves.styled.jsx`

- Page title, gold decorative line, description paragraph
- Real-time search
- 8-column responsive table: Name | Type | Class | Power | Acc | PP | Gen | Effect
- Grid breakpoints: Effect hidden < 950px, Gen hidden < 700px, Power/Acc/PP hidden < 500px
- `TypeBadge` (color from `colorMap`) and `ClassBadge` (Physical = orange `#e65100`, Special = blue `#3b4cca`, Status = grey `#757575`)
- Each row is a `Link` to `/moves/:name`, alternating backgrounds, gold left-border on hover

### Detail Page (`/moves/:name`)

**File:** `src/pages/Moves/MoveDetail.jsx`

Sections in order:
1. Back link ("← Back to Moves")
2. Move name title + gold line
3. Type badge + Class badge row
4. Stat blocks row: Power, Accuracy (with `%`), PP, Generation
5. **Effect** — full `effect_entries[en].effect`; `$effect_chance$` replaced with `move.effect_chance`
6. **Game Descriptions** — English flavor text, deduplicated, version badge + text
7. **Pokémon that learn this Move** — filtered to base forms (ID ≤ 1025), deduplicated, sorted alphabetically, each name **type-colored** (bold, type color default, gold on hover with glow), links to `/collection/:id`

### Generation Format Convention

Generation strings from the API (`"generation-ii"`, `"generation-viii"`) are formatted throughout moves and abilities pages as:

```js
const roman = name.split('-').pop().toUpperCase(); // "II", "VIII"
`Generation ${roman}` // "Generation II", "Generation VIII"
```

Used in move detail stat block and ability detail generation badge. Do **not** use `capitalizeFirstLetter` on the Roman numeral segment — it produces "Ii", "Viii" etc.

### Pokémon Type-Coloring in Move Detail

`MoveDetail.jsx` batch-fetches primary types for the Pokémon list after the move loads:

- Module-level `typeFetchCache = new Map()` — persists across navigations without React state
- Seeds from cache immediately, then fetches unknown types in batches of 20 from `/api/v2/pokemon/:name` (lightweight endpoint, no species or evolution calls)
- `cancelled` flag prevents stale state updates on unmount
- `learnedByPokemon` computed via `useMemo([move])` — must be declared before early returns so the type-fetch `useEffect` can depend on it
- `PokemonEntry` in `Moves.styled.jsx` accepts `typecolor` prop; default color = type color, hover = `#ffcc00` + `text-shadow` glow

---

## Nav Dropdown

**Files:** `Nav.jsx`, `Nav.styled.jsx`

The "Pokémon" nav link is a dropdown with three items:

| Label | Route |
|-------|-------|
| Pokémon | `/collection` |
| Abilities | `/abilities` |
| Moves | `/moves` |

**Hover gap fix:** Dropdown uses `top: 100%` (not `top: calc(100% + 5px)`) with `padding-top: 5px` on the dropdown itself. The padding is inside the `NavDropdownWrapper` hover zone, eliminating the dead zone that would close the menu.

**State:** `const [pokemonOpen, setPokemonOpen] = useState(false)` — `onMouseEnter/Leave` on `NavDropdownWrapper`, `onClick` on `NavDropdownTrigger` for mobile toggle.

`NavDropdownItem` is a styled `RouterLink`; clicking any item sets `setPokemonOpen(false)`.

---

## Routing (updated)

| Path | Component |
|------|-----------|
| `/` | Home |
| `/collection` | Browse/search all 1025 Pokémon |
| `/collection/:id` | Pokémon detail |
| `/pokemoncards` | Pokémon card catalog (shopping) |
| `/cart` | Shopping cart |
| `/abilities` | Abilities listing |
| `/abilities/:name` | Ability detail |
| `/moves` | Moves listing |
| `/moves/:name` | Move detail |

Provider nesting order in `App.jsx`:
```
CartProvider > PokemonCacheProvider > AbilitiesCacheProvider > MovesCacheProvider
```
