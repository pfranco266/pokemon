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

Active development is on `battle-feature`. Push features to `battle-feature`, then merge to `main` for production. Netlify deploys from `main` automatically (`phillymon.netlify.app`).

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

### Context data stored per ability

```js
{ name, generation, shortEffect }
```

`generation` is `d.generation?.name ?? null` (e.g. `"generation-iii"`). Abilities have **no type field** in PokeAPI — do not add a type filter.

### Listing Page (`/abilities`)

- Page title, gold decorative line, styled quote block description (see Page Description Styling)
- Two filter controls in a flex row: search bar (`flex: 1`), generation dropdown — stack vertically below 700px
- 3-column table: **Ability | Generation | Effect** — grid `220px 140px 1fr` (~25% / ~15% / ~60%)
- Generation display: **"GEN I"**, **"GEN IV"** etc. (same abbreviation as /moves listing)
- Generation column hidden ≤500px; at ≤500px grid collapses to `220px 1fr`
- Alternating row backgrounds, gold left-border on hover, each row links to `/abilities/:name`
- `NoDescription` fallback for abilities with no effect text
- "No abilities found." shown when filters produce zero results

**Sortable columns** — `sortKey` / `sortDir` state, default `'name'` / `'asc'`:

| Column | Sort behavior |
|--------|--------------|
| Ability | A-Z / Z-A |
| Generation | oldest→newest / newest→oldest (alphabetical on raw API value) |

- Same gold highlight / ▲▼ indicator / `transition: color 0.15s` pattern as /moves
- `AbilityColHeader` and `AbilityColHeaderGen` in `Abilities.styled.jsx` accept `active` and `sortable` props (numeric)

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

- Page title, gold decorative line, styled quote block description (see Page Description Styling)
- Three filter controls in a flex row: search bar (`flex: 1`), type dropdown, generation dropdown — stack vertically below 700px
- 5-column responsive table: **Name | Type | Power | Gen | Effect** — Class, Accuracy, PP removed from listing (still on detail page)
- Grid: `200px 80px 80px 110px 1fr`; Effect hidden ≤700px, Gen hidden ≤500px; `gap: 0 1rem`
- Column alignment: Name left, Type center, Power center, Gen center, Effect left
- `TypeBadge` (color from `colorMap`); Class/Acc/PP still shown on detail page
- Each row is a `Link` to `/moves/:name`, alternating backgrounds, gold left-border on hover
- Generation display: **"GEN I"**, **"GEN IV"** etc. — `'GEN ' + gen.split('-').pop().toUpperCase()` — listing only (detail pages still use "Generation II" format)
- Filter dropdowns: type from `Object.keys(colorMap)`, generation derived dynamically via `useMemo` from loaded data; all three filters apply simultaneously; results always re-sorted after filtering
- "No moves found." shown when filters produce zero results against loaded data

**Sortable columns** — `sortKey` / `sortDir` state in `MovesLanding.jsx`:

| Column | Sort behavior |
|--------|--------------|
| Name | A-Z / Z-A (default A-Z) |
| Type | A-Z / Z-A by type name |
| Power | low→high / high→low; nulls always sink to bottom |
| Gen | oldest→newest / newest→oldest |

- Active column header highlighted gold; inactive muted gold; `transition: color 0.15s`
- ▲ / ▼ indicator rendered inline next to active header label
- `ColHeader` styled component accepts `active` and `sortable` props (numeric 0/1, not boolean) for prop-to-DOM safety; `ColHeaderPower`, `ColHeaderGen`, `ColHeaderEffect` extend it

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

Generation strings from the API (`"generation-ii"`, `"generation-viii"`) are formatted differently depending on context:

**Detail pages** (`/moves/:name`, `/abilities/:name`) — full label:
```js
`Generation ${name.split('-').pop().toUpperCase()}` // "Generation II"
```

**Listing pages** (`/moves`, `/abilities`) — abbreviated label:
```js
`GEN ${name.split('-').pop().toUpperCase()}` // "GEN II", "GEN VIII"
```

Do **not** use `capitalizeFirstLetter` on the Roman numeral segment — it produces "Ii", "Viii" etc. The `.toUpperCase()` pattern is the only correct approach.

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

**Click timing fix:** All three `NavDropdownItem`s use `onMouseDown` + `e.preventDefault()` + explicit `navigate(path)` instead of relying on the RouterLink click event. This bypasses a pointer-events timing race where `onMouseLeave` fires `setPokemonOpen(false)` → sets `pointer-events: none` on the dropdown → swallows the click before it registers.

```jsx
<NavDropdownItem to="/collection" onMouseDown={(e) => { e.preventDefault(); handleDropdownNav('/collection'); }}>
```

`handleDropdownNav(path)` calls `setPokemonOpen(false)` then `navigate(path)`.

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
| `/types` | Types listing |
| `/types/:name` | Type detail |

Provider nesting order in `App.jsx`:
```
CartProvider > PokemonCacheProvider > AbilitiesCacheProvider > MovesCacheProvider > TypesCacheProvider
```

---

## Page Description Styling (Quote Block)

**File:** `src/components/shared/PageQuoteBlock.styled.jsx`

Used on `/moves`, `/abilities`, and `/types` listing pages to replace the plain `PageDescription` paragraph.

```jsx
<PageQuoteBlock>
    <QuoteFirstSentence>First sentence here.</QuoteFirstSentence>{' '}
    Remaining text italic white...
</PageQuoteBlock>
```

Styles:
- `PageQuoteBlock`: `border-left: 3px solid #ffcc00`, `background: rgba(255,204,0,0.05)`, `padding: 1rem 1.25rem`, `border-radius: 0 8px 8px 0`, `max-width: 700px`, `margin: 0 auto 1.75rem`, `color: #ffffff`, `font-size: 1rem`, `line-height: 1.8`, `font-style: italic`
- `QuoteFirstSentence`: `color: #ffcc00`, `font-weight: 700`, `font-style: normal` — draws the eye to the opening line

The split at the first period is done manually in JSX (not automated). The `{' '}` between `</QuoteFirstSentence>` and the rest is required for the space before italic continuation text.

---

## `/collection` Search

**File:** `src/pages/Collection/Search/Search.jsx` + `Search.styled.jsx`

Real-time autocomplete dropdown replacing the old submit-button search.

**Behavior:**
- Reads from `usePokemonCache().listState.list` directly — no props needed from parent
- 150ms debounce on keystroke via `useEffect` + `clearTimeout`
- Results ranked: `startsWith` matches first, then `contains` matches; max 8 shown
- Query normalisation: spaces → hyphens before comparing against API names
- Enter key navigates to first result; Escape closes dropdown
- Click outside closes dropdown (`mousedown` listener on `document` with `wrapperRef`)
- Selecting a result: extracts numeric ID from `pokemon.url`, calls `navigate(\`/collection/${id}\`)`
- `query` and `results` both cleared on navigation

**Dropdown styling (`Search.styled.jsx`):**
- `SearchWrapper`: `position: relative; width: 100%; max-width: 450px`
- `SearchDropDown`: `#0a0a0a` bg, `1px solid #ffcc00` border, `max-height: 400px`, `overflow-y: auto`, `fadeIn` 0.15s animation, `z-index: 1000`
- `SearchDropDownItem`: flex row, gold left-border on hover (`border-left: 3px solid #ffcc00`)
- `ResultSprite` (32×32px) — dream-world SVG with `onError` fallback to official-artwork PNG
- `ResultName` — gold, Russo One, capitalized
- `ResultNumber` — muted `#XXX` format, `String(id).padStart(3, '0')`

**`SearchButton` export retained** — `Pokemon.styled.jsx` extends it as `AddtoCartButton`. Do not remove.

---

## Pokéball Transition Animation

**Files:** `src/components/PokeballTransition/PokeballTransition.jsx` + `PokeballTransition.styled.jsx`

Directional toast-style card that animates when the user clicks next/previous on a Pokémon detail page. No full-screen overlay, no white flash, no scroll position change.

**Direction:** clicking → (next) slides from the right; clicking ← (prev) slides from the left.

**Three phases (total ~3s):**

| Phase | Duration | What happens |
|-------|----------|--------------|
| 1 — Slide in | 0–300ms | Card enters from edge with `ease-out` |
| 2 — Hold | 300–2700ms | Card stays visible; `navigate()` fires at 300ms |
| 3 — Slide out | 2700–3000ms | Card exits to same edge with `ease-in`; `onComplete` fires at 3000ms |

**Card contents (top to bottom):**
- Spinning Pokéball SVG (70×70px, `rotate` keyframe, `0.6s linear infinite`)
- `"I choose you!"` — white, italic, 0.9rem
- Incoming Pokémon name — gold `#ffcc00`, Russo One, `clamp(1.5rem, 2.5vw, 2.2rem)`, falls back to `"..."` if list not yet loaded

**Card styling:** `rgba(10,10,10,0.92)` bg, `2px solid #ffcc00` border, `border-radius: 16px`, `padding: 1.5rem 2rem`, `pointer-events: none`, `z-index: 9999`. Positioned `fixed`, `top: 50%`, offset `2rem` from the entry edge.

**Styled component pattern:** Four separate components (`ToastSlideInRight`, `ToastSlideOutRight`, `ToastSlideInLeft`, `ToastSlideOutLeft`) extend a shared `ToastCardBase`. Switching from SlideIn to SlideOut on phase 3 remounts the component, which reliably restarts the CSS animation — same pattern as `WhiteFlashIn`/`WhiteFlashOut` from the previous approach.

**Integration in `MoreInfoLanding.jsx`:**
- `isTransitioning` + `transitionTarget: { id, name, direction }` state
- `handlePrev`/`handleNext` set the target and `setIsTransitioning(true)` instead of navigating directly
- `handleTransitionNavigate` calls `navigate()` only — no `window.scrollTo`
- `handleTransitionComplete` resets state and removes the component from DOM
- `PrevPokeButton`/`NextPokeButton` disabled during transition: `opacity: 0.5; cursor: not-allowed`

---

## Detail Page — Responsive Header

**File:** `src/pages/PokemonDetail/MoreInfo.styled.jsx`

The header banner (`Heading`) and its contents use `clamp()` values so they scale proportionally with viewport width rather than height — fixes the header being too tall on large portrait monitors where `vh`-based sizing was previously used.

| Element | Value |
|---------|-------|
| `Heading` height | `clamp(150px, 20vw, 350px)` |
| `LandingSVG` width/height | `clamp(120px, 15vw, 280px)` |
| `PokemonTitle` font-size | `clamp(1.5rem, 3vw, 3rem)` |
| `PokeNumber` font-size | `clamp(1rem, 2vw, 2rem)` |

---

## Detail Page — Name Lookup for Navigation

**File:** `src/pages/PokemonDetail/MoreInfoLanding.jsx`

`MoreInfoLanding` calls `fetchAllListPages()` on mount (guarded by `fullyLoaded` no-op inside the function). This ensures `listState.list` is always populated on the detail page, even when the user navigates directly to `/collection/:id` without first visiting `/collection`.

**Why this matters:** `fetchPokemonDetail()` only writes to the `detailCache` Map — it does not touch `listState.list`. Without the `fetchAllListPages()` call, `getNameForId(targetId)` returns `''` and the Pokéball transition toast shows `"..."` instead of the incoming Pokémon's name.

If the user arrived via `/collection`, `fetchAllListPages()` is already complete and the call returns immediately.

---

## Netlify Deployment

**SPA routing fix:** `public/_redirects` contains `/*    /index.html    200` so all client-side routes (e.g. `/collection/25`, `/moves/tackle`) work when typed directly or shared as links — without it Netlify returns 404 on any non-root URL.

**Production branch:** Netlify is configured to deploy from `main`. Push to `battle-feature` for development, merge to `main` to publish to `phillymon.netlify.app`.

---

## Detail Page — Compact Sticky Header

**Files:** `src/pages/PokemonDetail/MoreInfoLanding.jsx`, `MoreInfoHeading.jsx`, `MoreInfo.styled.jsx`

When the user scrolls past the full header banner on `/collection/:id`, a slim fixed banner slides down and stays pinned at the top of the viewport.

**Behavior:**
- Full header remains in normal document flow — it scrolls away naturally, no changes to its size or layout
- Compact banner appears via `IntersectionObserver` on the `<Heading>` element (`threshold: 0`)
- When heading exits viewport → `headerVisible = false` → banner slides in; when heading re-enters → banner slides out
- `headerVisible` resets to `true` on every `pokeId` change to prevent flicker on navigation
- Observer re-attaches in `useEffect([pokemonDetails.id])` so it targets the mounted element after data loads

**Compact banner contents:**
- Type-colored background matching the full header (`colorMap[primaryType]?.color`)
- Pokémon number and name only — sprite hidden entirely
- Font sizes match full header: `clamp(1rem, 2vw, 2rem)` for number, `clamp(1.5rem, 3vw, 3rem)` for name

**Styled components (`MoreInfo.styled.jsx`):**
- `CompactBanner`: `position: fixed; top: 0; z-index: 500`; `transform: translateY` toggled by `visible` prop (numeric 0/1); `transition: transform 0.2s ease` — always in DOM, CSS transition handles show/hide
- `CompactBannerNumber`, `CompactBannerName`: match full-header font sizes without the layout-specific padding-left from `PokeNumber`/`PokemonTitle`

---

## Radar Chart — Axis Spacing

**File:** `src/pages/PokemonDetail/Stats.jsx`

`NUM_R` (the radial distance at which stat numbers are positioned) increased from `132` to `137` to add ~5 SVG units of clearance between the bottom of each axis icon and its corresponding stat number. Icons remain at `LABEL_R = 112`. Prevents icons and numbers touching on smaller container sizes where 22px fixed icons take up a proportionally larger area.

---

## Legendary / Mythical Header Banner

**File:** `src/pages/PokemonDetail/MoreInfoHeading.jsx`, `MoreInfo.styled.jsx`

`MythicalBanner` and `LegendaryBanner` use a left-to-right shimmer/reveal animation only — no sparkle particles. The shine keyframe animates `background-position` across a gradient using the Pokémon's primary type color. Sparkle particles were implemented and then reverted; the self-contained `SparkleBadge` component was preserved for future use but is not currently rendered anywhere in `MoreInfoHeading`.

---

## SparkleBadge Component

**File:** `src/components/shared/SparkleBadge.jsx`

Self-contained animated badge for future use on the Pokémon detail page. Not currently rendered anywhere.

- Props: `label` (string to display), `active` (boolean — returns `null` when false)
- 10 `✦` particles positioned absolutely around the label text, each with staggered `animationDelay` and `animationDuration`; particles float upward and fade out via `sparkleFloat` keyframe
- Gold text with glow `text-shadow`; wrapper is `display: inline-block; position: relative`
- Comment at top of file: `// Reserved for use in Pokemon detail info section`

---

## Types System

### Routing

Two new routes added to `App.jsx`:

| Path | Component |
|------|-----------|
| `/types` | `TypesLanding` |
| `/types/:name` | `TypeDetail` |

Provider nesting order (updated):
```
CartProvider > PokemonCacheProvider > AbilitiesCacheProvider > MovesCacheProvider > TypesCacheProvider
```

Nav dropdown now has four items: Pokémon → `/collection`, Abilities → `/abilities`, Moves → `/moves`, **Types → `/types`**.

---

### Context (`TypesCacheContext.jsx`)

**File:** `src/context/TypesCacheContext.jsx`

Minimal cache — no listing state needed since all 18 types and their full effectiveness data are already in `colorMap.js`. Only the per-type Pokémon list requires an API call.

```js
const { fetchTypeDetail } = useTypesCache();
```

- **`fetchTypeDetail(name)`** — fetches `/type/:name`, caches raw response in `detailCacheRef` (`useRef(new Map())`); returns from cache on repeat calls
- No batch loading, no loading state — only called on `TypeDetail` mount

---

### Listing Page (`/types`)

**Files:** `src/pages/Types/TypesLanding.jsx` + `Types.styled.jsx`

**Layout (top to bottom):**
1. `TypePageTitle` + `TypeTitleLine` (matches `/moves` / `/abilities` header pattern)
2. `PageQuoteBlock` with `QuoteFirstSentence` — same styled quote block used on `/moves` and `/abilities`
3. Responsive type cards grid — 18 cards, one per type
4. 18×18 effectiveness chart with legend

**Type cards grid (`TypeCardsGrid`):**
- 6 columns desktop → 4 tablet (≤900px) → 3 mobile (≤600px) → 2 narrow (≤400px)
- Each `TypeCard` is a styled `RouterLink` to `/types/:name` with `background: colorMap[type].color`
- Card contents: type icon (from `colorMap[type].icon`, rendered as React component) + capitalized type name
- Hover: `translateY(-3px)` + deeper `box-shadow`

**18×18 effectiveness chart:**
- Rows = attacking type, columns = defending type
- Cell value: `colorMap[defType].typeChart[atkType] ?? 1`
- Cell size: `36×36px`; table `min-width: 720px`; `ChartSection` has `overflow-x: auto` for mobile
- `ChartSection` uses `display: flex; flex-direction: column; align-items: center` to center the table horizontally
- Color coding:

| Multiplier | Background | Text |
|------------|-----------|------|
| 2× | `rgba(76,175,80,0.85)` (green) | `#fff` |
| ½× | `rgba(239,83,80,0.75)` (red) | `#fff` |
| 0× | `rgba(60,60,60,0.9)` (dark grey) | `rgba(255,255,255,0.3)` |
| 1× | `rgba(30,30,30,0.5)` (transparent) | `rgba(255,255,255,0.15)` |

- Cell labels: `2×`, `½`, `0`, or empty string for 1×
- `ChartCell` hover: `outline: 1px solid rgba(255,204,0,0.7)` — no row/column highlight currently implemented
- **Axis labels are clickable `RouterLink`s** (`ChartLabelLink`) to `/types/:name` — inherit parent type color, turn gold with underline on hover
- Column header abbreviation: `defType.slice(0, 3).toUpperCase()` (e.g. `WAT`, `FIR`)
- Row label: full capitalized type name
- Legend below chart: four `LegendItem` entries with colored `LegendSwatch` squares

**No API calls on `/types`** — all data sourced from `colorMap.js`.

---

### Detail Page (`/types/:name`)

**Files:** `src/pages/Types/TypeDetail.jsx` + `TypeDetail.styled.jsx`

**Layout (top to bottom):**
1. `BackLink` → `/types`
2. `TypeBanner` — full-width colored banner (`colorMap[name].color` background) with type icon + capitalized type name
3. **Offense** section (`EffectivenessSection`) — what this type does when attacking
4. **Defense** section (`EffectivenessSection`) — what this type takes when defending
5. **Pokémon with this type** (`PokemonSection`) — alphabetical list linking to `/collection/:id`

**Offense subsections:**
- Super Effective Against (2×): `ALL_TYPES.filter(def => colorMap[def].typeChart[name] === 2)`
- Not Very Effective Against (½×): `colorMap[def].typeChart[name] === 0.5`
- No Effect Against (0×): `colorMap[def].typeChart[name] === 0`

**Defense subsections:**
- Weak To (2×): `ALL_TYPES.filter(atk => colorMap[name].typeChart[atk] === 2)`
- Resistant To (½×): `colorMap[name].typeChart[atk] === 0.5`
- Immune To (0×): `colorMap[name].typeChart[atk] === 0`

All effectiveness computed from `colorMap` with no API calls. `NoneLabel` shown when a category is empty.

**Type badge pills (`EffBadge`):** styled `RouterLink` to `/types/:otherType`; background `${typecolor}33` (20% alpha), solid border, colored text; hover brightens background to `55` alpha + `translateY(-1px)`.

**Pokémon list:** fetched from `/type/:name` via `fetchTypeDetail`, filtered to base forms (`parseInt(id) <= 1025`), sorted alphabetically. Uses `PokemonList` and `PokemonEntry` imported directly from `Moves.styled.jsx` — identical layout and styling to the "Pokémon that learn this Move" list on `/moves/:name`. Primary type fetched per Pokémon via the same module-level `typeFetchCache` + batch-fetch pattern as `MoveDetail.jsx`; passed as `typecolor` prop to `PokemonEntry` for type-colored bold text and gold glow on hover.

---

## Rules of Hooks — TypeDetail.jsx Fix

All `useState`, `useEffect`, and `useMemo` calls must appear at the top of the component function, before any conditional logic or early returns. A `useMemo` was incorrectly placed after the loading/not-found early returns, causing React's "change in order of hooks between renders" error.

**Correct order in `TypeDetail.jsx`:**
1. All `useState` declarations
2. `useEffect` for data fetch (sets `typeData`, `loading`, `pokemonTypeMap`)
3. `useMemo` for `pokemonList` (depends on `typeData?.pokemon`)
4. `useEffect` for batch type-fetch (depends on `pokemonList`)
5. Early returns (`if (loading)`, `if (!typeData || !typeInfo)`)
6. Derived constants and JSX

The `useMemo` for `pokemonList` safely references `typeData?.pokemon ?? []` — returns `[]` on the first render before data loads, which is correct.

---

## Nav Dropdown — Transient Prop Fix

**Files:** `src/components/Nav/Nav.jsx`, `Nav.styled.jsx`

The `isopen` prop on `NavDropdown` was forwarded to the underlying DOM `<div>`, causing a styled-components unknown-prop warning.

**Fix:** renamed to `$isopen` (styled-components transient prop syntax). The `$` prefix tells styled-components to consume the prop for styling only and never pass it to the DOM.

- `Nav.styled.jsx`: all three template literal references updated: `${({ $isopen }) => $isopen ? ... }`
- `Nav.jsx`: prop passed as `$isopen={pokemonOpen ? 1 : 0}`

Apply the same `$` prefix pattern to any other boolean/numeric styled-component props that are not valid HTML attributes (e.g. `typecolor`, `tiercolor`, `isopen`, `exceptional`), particularly when styled-components warns about them.

---

## Detail Page — Clickable Section Headings

**Files:** `src/pages/PokemonDetail/Moves.jsx`, `PokemonAbilities.jsx`, `About.jsx`

Three elements on `/collection/:id` are now navigable links:

**"Moves" and "Abilities" headings:**
- Both replaced with a local `TitleLink` (styled `RouterLink`) that visually matches all other section headings at base state
- "Moves" → `/moves`; "Abilities" → `/abilities`
- Hover: `text-shadow: 0 0 12px rgba(255,204,0,0.8)` gold glow, no underline, `cursor: pointer`
- `transition: text-shadow 0.15s ease`

**Type badges in About section:**
- Each `TypeBadge` wrapped in a `TypeBadgeLink` (styled `RouterLink`) to `/types/:typeName` (lowercase type name)
- `TypeBadge` styling unchanged — the wrapper provides the interaction
- Hover: `transform: scale(1.05)` + `filter: brightness(1.3)`, `transition: 0.15s ease`
- `key` prop moved to the outer `TypeBadgeLink`; `display: inline-block` on wrapper preserves flex layout in `TypeBadgesRow`

---

## Detail Page — Section Heading Consistency

**Files:** `src/pages/PokemonDetail/MoreInfo.styled.jsx`, `Stats.jsx`, `Evolution.jsx`, `Moves.jsx`, `PokemonAbilities.jsx`

All section headings on `/collection/:id` share a single consistent style:

| Property | Value |
|----------|-------|
| `font-family` | `'Russo One', sans-serif` |
| `font-size` | `1.8rem` |
| `color` | `#ffffff` |
| `text-align` | `center` |
| `margin` | `0 0 1rem` |
| `text-transform` | `capitalize` |

**Implementation:**
- `MoreInfoSubtitle` in `MoreInfo.styled.jsx` updated to the canonical style — used directly by `About.jsx` for "About [Name]"
- `Stats.jsx` and `Evolution.jsx` replaced their `Title` import from `Home.styled.jsx` with `MoreInfoSubtitle` from `MoreInfo.styled.jsx` — avoids changing `Title` globally (it is also used on the Home and PokemonCatalogue pages)
- `TitleLink` in `Moves.jsx` and `PokemonAbilities.jsx` updated to match the same properties; link-specific additions (`text-decoration: none`, `cursor: pointer`, hover glow) are on top of the base style

**Headings covered:** "About [Name]", "[Name] Stats", "Evolution Chain", "Evolves From", "Evolves Into", "Moves", "Abilities"

---

## Radar Chart — Axis Order

**File:** `src/pages/PokemonDetail/Stats.jsx`

`STAT_AXES` array reordered so the axes map to clock positions that group offense left / defense right:

| Position | Clock | Stat |
|----------|-------|------|
| 0° | 12 o'clock (top) | HP |
| 60° | 2 o'clock (top-right) | Defense |
| 120° | 4 o'clock (bottom-right) | Special Defense |
| 180° | 6 o'clock (bottom) | Speed |
| 240° | 8 o'clock (bottom-left) | Special Attack |
| 300° | 10 o'clock (top-left) | Attack |

Attack and Special Attack sit on the left; Defense and Special Defense on the right; HP at top; Speed at bottom. Only the array order changed — all rendering math, icon/number positioning, polygon, and grid lines are untouched.

---

## Battle System

### Route + Nav

Route `/battle` added to `App.jsx`. **"Battle"** appears as a top-level nav link in `Nav.jsx` between the Pokémon dropdown and "Pokemon Cards" — same `Link` styled component, Russo One gold.

Provider nesting (final):
```
CartProvider > PokemonCacheProvider > AbilitiesCacheProvider > MovesCacheProvider > TypesCacheProvider
```
`BattlePage` needs no additional context provider — it uses `usePokemonCache()` directly.

---

### `/battle` Page (`src/pages/Battle/BattlePage.jsx`)

**Layout (top to bottom):**
1. "⚔ Battle Arena" page title + gold gradient line
2. Two `SelectorPanel`s in a `SelectorRow` flex row with a gold "VS" divider — stack vertically ≤700px
3. Pulsing gold `BattleButton` (disabled until both panels filled)
4. `SuggestionsSection` — "Suggested Battles" heading + 3 cards + Shuffle button

**Selector panels:** Each panel contains:
- Autocomplete search input (same debounce/ranking/outside-click pattern as `/collection` search)
- Dropdown results with dream-world SVG sprite (fallback to official-artwork PNG), gold name, muted `#XXX` number
- `EmptySlot` placeholder when no Pokémon selected
- Once selected: official-artwork PNG (200px), capitalized name, type badges, lore tier badge, 3×2 mini stat grid (HP/Atk/Def/SpA/SpD/Spd)

**`extractPokemon(cacheResult)`** — converts `{ pokemonDetailData, pokemonSpeciesData }` from the cache into the battle-usable shape:
```js
{ id, name, types, stats, legendary, mythical, habitat, captureRate }
```
`habitat` = `s?.habitat?.name ?? null`; `captureRate` = `s?.capture_rate ?? null`. `stats` is an object `{ hp, attack, defense, specialAttack, specialDefense, speed }` built from the raw `stats` array.

**Suggested Battles:**
- 3 fully random pairs, regenerated on load and on "⟳ Shuffle"
- `buildSuggestions(list)` picks 6 unique IDs from 1–1025 using a `usedIds` Set — guarantees no Pokémon appears twice across all 3 pairs
- Names derived from `listState.list[id - 1]?.name`; falls back to `#${id}` before list loads
- Clicking a card calls `fetchPokemonDetail` for both IDs in parallel via `Promise.all`, then sets `pokemonA`/`pokemonB`; cards dim to `opacity: 0.6` while loading
- Card styling: `rgba(255,255,255,0.03)` bg, `1px solid rgba(255,204,0,0.3)` border, `border-radius: 8px`; hover lifts to `rgba(255,255,255,0.06)` with `border-color: #ffcc00`
- Each card shows two dream-world sprites (40px, with official-artwork `onError` fallback), gold names, "VS" divider, "Battle this matchup →" CTA in muted gold

---

### Battle Power Score Engine (`src/utils/battleEngine.js`)

**`calculateBPS(pokemonA, pokemonB)`** returns:
```js
{ aBPS, bBPS, aBestMulti, bBestMulti, aDamage, bDamage, aStatBreakdown, bStatBreakdown }
```

Three components sum to BPS:

**1. Offensive damage** — `(bestOffensiveStat / bestOpponentDefense) * bestTypeMultiplier * speedBonus`
- `speedBonus`: 1.1 if faster, 1.0 if tied, 0.95 if slower
- Type multiplier from `colorMap[defType].typeChart[atkType]` — best multiplier across all attacking types

**2. Durability** — `(HP / incomingDamageRate) * 2`

**3. Individual weighted stat score** (replaces old TBS component):
```
statsScore = (
  (hp/255 * 100 * 0.04) +
  (atk/255 * 100 * 0.05) +
  (def/255 * 100 * 0.04) +
  (spAtk/255 * 100 * 0.05) +
  (spDef/255 * 100 * 0.04) +
  (spd/255 * 100 * 0.03)
) * 100 / 25        // normalizes to 0-100
```
Added to BPS as `statsScore * 0.03` (scaled to ~0-3, same magnitude as other components).

`aStatBreakdown` / `bStatBreakdown`: `{ total, contributions: { hp, attack, defense, specialAttack, specialDefense, speed } }` — per-stat contribution values used by the Breakdown tab.

**`determineWinner(aBPS, bBPS)`** — returns `'A'`, `'B'`, or `'tie'`.

**`getLoreTierInfo(pokemon)`** — returns `{ label, color }` based on mythical > legendary > TBS thresholds (Pseudo-Legendary ≥600, Elite ≥500, Strong ≥400, Standard).

**`APEX_POKEMON`** set (18 cosmic-tier Pokémon, used for narrator tier 4):
`arceus, mewtwo, giratina, dialga, palkia, rayquaza, kyogre, groudon, zygarde, eternatus, necrozma, lunala, solgaleo, xerneas, yveltal, reshiram, zekrom, kyurem`

**`FAN_FAVOURITES`** set (used for narrator legacy note):
`charizard, gengar, lucario, eevee, umbreon, espeon, gardevoir, blaziken, greninja, mimikyu, sylveon, mewtwo, dragonite, tyranitar, garchomp, snorlax, mew`

---

### Battle Animation (`BattleOverlay` in BattlePage.jsx)

Full-screen `OverlayBackdrop` (`position: fixed; inset: 0; z-index: 9000`). Five phases driven by `setTimeout` chain:

| Phase | Fires at | What happens |
|-------|----------|--------------|
| 1 — intro | 50ms | Combatants appear (`floatIn` keyframe), HP bars visible at 100% |
| 2 — tension | 1050ms | Title text changes to `…` |
| 3 — drain | 1850ms | HP bars transition to final values over 1.5s CSS `transition: width 1.5s linear` |
| 4 — result flash | 3400ms | Title shows winner name or "It's a tie!" |
| complete | 4300ms | `onComplete()` fired, overlay removed |

**HP bar math:**
- Both bars start at `100%`
- **Loser** always drains to `0%`
- **Winner** drains to `max(1%, ((winnerBPS - loserBPS) / winnerBPS) * 100%)`
- Minimum 1% ensures winner always shows a sliver
- Tie: both stay at `100%`

**`HealthFill` color thresholds** (based on final `$pct`):
- `> 40%` → green `#4caf50`
- `15–40%` → orange `#ff9800`
- `< 15%` → red `#f44336` (close victory)

---

### Results Panel (`ResultsPanel` in BattlePage.jsx)

**Winner banner:** Pokémon artwork (90px) + "Winner" label + name as `PokemonNameLink` (type-colored, gold hover glow, links to `/collection/:id`). Tie shows plain white "It's a tie!".

**Two tabs:**

#### Tab 1 — Battle Narrative (AI)

Claude API called immediately on `ResultsPanel` mount via `runFetch()`. Uses `cancelledRef` (not a `let cancelled` closure) so `runFetch` can also be called from the "↺ Regenerate" button without stale closure issues.

**API call:** `POST https://api.anthropic.com/v1/messages` with:
- `system`: tiered narrator instruction (see below)
- `messages`: `[{ role: 'user', content: userPrompt }]`
- `model: 'claude-sonnet-4-6'`, `max_tokens: 450`
- Header: `anthropic-dangerous-direct-browser-access: true`

**Narrator awe tiers** (determined by `getSystemPrompt(pokemonA, pokemonB)`, apex check takes priority):

| Tier | Condition | Voice |
|------|-----------|-------|
| 1 — Standard | No legendary/mythical | Cold Pokédex analyst, no spectator language |
| 2 — One legendary | One legendary/mythical | Brief one-sentence rarity note, then clinical |
| 3 — Both legendary | Both legendary/mythical | Single understated rarity note, then data-only |
| 4 — Apex present | Either in APEX_POKEMON set | One sentence specific lore reference, then clinical |

Fan favourites (either Pokémon in `FAN_FAVOURITES`): appended to system prompt as one sentence — `"[Name] carries a legacy of trainer attachment that field data alone cannot quantify."`

**User prompt** (`buildNarrativePrompt` returns `{ system, userPrompt }`):
```
WINNER: [name]
Type: [types] | Lore: [loreTierLabel] | TBS: [tbs] | Habitat: [habitat] | Capture Rate: [captureRate]

LOSER: [name]
...same fields...

Victory margin: Decisive/Moderate/Narrow ([x.xx] point BPS differential)
Leading factors: [top 2-3 auto-derived: type advantage, speed, offense, TBS, defense]

Explain why [winner] prevailed. Reference the specific data above.
```

`dominance` label: `>40%` margin → Decisive, `>15%` → Moderate, else Narrow (based on `(winnerBPS - loserBPS) / winnerBPS * 100`).

Narrative text rendered via `renderNarrativeWithLinks(text, pokemonA, pokemonB)` — splits on either Pokémon's display name (case-insensitive regex), wraps matches in `PokemonNameLink` with primary type color.

Error state shows actual `err.message` in red italic. "↺ Retry" button reruns fetch. "↺ Regenerate" shown after success.

#### Tab 2 — Battle Breakdown

Instant (no API call). `BreakdownGrid` 2-column layout, one `BreakdownCard` per Pokémon:
- Name as `PokemonNameLink` (type-colored, links to `/collection/:id`)
- Battle Score (BPS value)
- Type Advantage (`MultiplierBadge`, colored green/orange/red by multiplier)
- Offense Rating (damage value)
- `StatBreakdownSection`: mini bar chart per stat showing individual weighted contributions; bars highlighted gold when winning that stat vs opponent

---

### Battle Styled Components (`src/pages/Battle/Battle.styled.jsx`)

All battle UI styled components. Key exports:
- `PokemonNameLink` — `styled(Link)`, `$typecolor` prop, gold hover glow — matches `/moves/:name` Pokémon list style
- `StatBreakdownFill` — `$highlight` prop (boolean-as-number); gold when winning stat, white-muted when losing
- `HealthFill` — `$pct` prop drives color threshold and CSS transition target width
- `ShuffleButton` — gold outlined, Russo One, gold `text-shadow` glow on hover

---

### API Key Security

- `VITE_ANTHROPIC_API_KEY` stored in `.env` only — never hardcoded anywhere
- `.env` listed in `.gitignore` (lines 14–15: `.env` and `.env.*`) — never git-tracked
- Accessed only via `import.meta.env.VITE_ANTHROPIC_API_KEY` in `BattlePage.jsx` inside `fetchNarrative()`
- Dev server must be restarted after editing `.env` (Vite reads env vars at startup only)

---

### Netlify Environment Variable

`VITE_ANTHROPIC_API_KEY` must be added in the Netlify dashboard for the AI narrative to work on the live site:

**Netlify dashboard → Site configuration → Environment variables → Add variable**

Key: `VITE_ANTHROPIC_API_KEY` | Value: the API key

The local `.env` file is never pushed to GitHub, so the live site has no key unless it is set here. Netlify injects `VITE_*` env vars at build time — after adding or changing the variable, trigger a redeploy.

---

### `fetchAllListPages` Infinite Loop Fix

**Symptom:** `/pokemon-species/` endpoint called hundreds of thousands of times; 530,000+ console log entries on the `/battle` page.

**Root cause:** `fetchAllListPages` was a plain `async` function defined inside `PokemonCacheProvider`. Every `listState` update (each page of Pokémon fetched) re-rendered the provider and created a **new function reference**. `BattlePage`'s `useEffect(..., [fetchAllListPages])` saw the new reference as a changed dependency and re-fired, calling `fetchAllListPages` again → which updated `listState` → new reference → infinite loop.

**Fix — `PokemonCacheContext.jsx`:**
- Added `useCallback` import
- Added `listStateRef` (`useRef`) — assigned `listStateRef.current = listState` on every render so async functions always read current state without listing `listState` as a dep
- Added `isFetchingAllRef` (`useRef(false)`) — guards against concurrent calls when multiple components mount simultaneously; reset in `finally`
- Wrapped `fetchNextListPage` and `fetchAllListPages` in `useCallback(fn, [])` — stable reference across all renders

**Fix — `BattlePage.jsx`:**
- Changed `useEffect(() => { fetchAllListPages(); }, [fetchAllListPages])` to `useEffect(() => { fetchAllListPages(); }, [])` (run once on mount only)

**Other pages** (`BrowsePokemon.jsx`, `MoreInfoLanding.jsx`) already used `[]` and were not affected.

**Rule:** Never put `fetchAllListPages` or `fetchNextListPage` in a `useEffect` dependency array. Always use `[]`.
