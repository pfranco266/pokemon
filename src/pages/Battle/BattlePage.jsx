import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { usePokemonCache } from '../../context/PokemonCacheContext';
import { capitalizeFirstLetter } from '../../utils/stringUtils';
import colorMap from '../../utils/colorMap';
import { calculateBPS, determineWinner, getLoreTierInfo } from '../../utils/battleEngine';
import {
    BattlePageWrapper,
    BattlePageTitle,
    BattleTitleLine,
    SelectorRow,
    VsDivider,
    SelectorPanel,
    SelectorLabel,
    PanelSearchWrapper,
    PanelSearchInput,
    PanelDropDown,
    PanelDropDownItem,
    DropdownSprite,
    DropdownName,
    DropdownNumber,
    SelectedCard,
    SelectedArtwork,
    SelectedName,
    TypeBadgesRow,
    TypeBadge,
    TierBadge,
    StatsMini,
    StatMiniRow,
    StatMiniLabel,
    StatMiniValue,
    EmptySlot,
    BattleButton,
    OverlayBackdrop,
    OverlayTitle,
    CombatantsRow,
    CombatantSlot,
    CombatantSprite,
    CombatantName,
    HealthBarWrapper,
    HealthLabel,
    HealthTrack,
    HealthFill,
    OverlayVs,
    ResultsSection,
    WinnerBanner,
    WinnerSprite,
    WinnerText,
    WinnerLabel,
    WinnerName,
    TabRow,
    Tab,
    TabContent,
    NarrativeText,
    NarrativeLoading,
    Spinner,
    BreakdownGrid,
    BreakdownCard,
    BreakdownCardTitle,
    BreakdownRow,
    BreakdownValue,
    MultiplierBadge,
    StatBreakdownSection,
    StatBreakdownLabel,
    StatBreakdownRow,
    StatBreakdownTrack,
    StatBreakdownFill,
    StatBreakdownValue,
    PlayAgainButton,
    PokemonNameLink,
    RegenerateButton,
    SuggestionsSection,
    SuggestionsHeading,
    SuggestionsTitleLine,
    SuggestionsRow,
    SuggestionCard,
    SuggestionInner,
    SuggestionPoke,
    SuggestionSprite,
    SuggestionPokeName,
    SuggestionVs,
    SuggestionCta,
    ShuffleButton,
} from './Battle.styled';

// ── Helpers ──────────────────────────────────────────────────────────────────
function getIdFromUrl(url) {
    return parseInt(url.split('/').filter(Boolean).pop(), 10);
}

function artworkUrl(id) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

function dreamWorldUrl(id) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`;
}

// Extract the fields we need from the fetchPokemonDetail result shape:
// { pokemonDetailData, pokemonSpeciesData, evolutionData }
function extractPokemon(cacheResult) {
    if (!cacheResult) return null;
    const { pokemonDetailData: d, pokemonSpeciesData: s } = cacheResult;
    if (!d) return null;
    const statsRaw = d.stats ?? [];
    const stats = {
        hp:             statsRaw.find(st => st.stat.name === 'hp')?.base_stat ?? 0,
        attack:         statsRaw.find(st => st.stat.name === 'attack')?.base_stat ?? 0,
        defense:        statsRaw.find(st => st.stat.name === 'defense')?.base_stat ?? 0,
        specialAttack:  statsRaw.find(st => st.stat.name === 'special-attack')?.base_stat ?? 0,
        specialDefense: statsRaw.find(st => st.stat.name === 'special-defense')?.base_stat ?? 0,
        speed:          statsRaw.find(st => st.stat.name === 'speed')?.base_stat ?? 0,
    };
    return {
        id:          d.id,
        name:        d.name,
        types:       d.types ?? [],
        stats,
        legendary:   s?.is_legendary    ?? false,
        mythical:    s?.is_mythical      ?? false,
        habitat:     s?.habitat?.name   ?? null,
        captureRate: s?.capture_rate    ?? null,
    };
}

// ── Suggested battles data ───────────────────────────────────────────────────
const STAT_SHORT_NAMES = {
    hp: 'HP', attack: 'Atk', defense: 'Def',
    specialAttack: 'SpA', specialDefense: 'SpD', speed: 'Spd',
};

function buildSuggestions(list) {
    const maxId = list.length > 0 ? Math.min(list.length, 1025) : 1025;
    const usedIds = new Set();

    function pickUniqueId() {
        let id;
        do { id = Math.floor(Math.random() * maxId) + 1; } while (usedIds.has(id));
        usedIds.add(id);
        return id;
    }

    return Array.from({ length: 3 }, () => {
        const idA = pickUniqueId();
        const idB = pickUniqueId();
        return {
            a: { id: idA, name: list[idA - 1]?.name ?? `#${idA}` },
            b: { id: idB, name: list[idB - 1]?.name ?? `#${idB}` },
        };
    });
}

// ── PokémonSelector sub-component ────────────────────────────────────────────
function PokemonSelector({ label, pokemon, onSelect }) {
    const { listState, fetchPokemonDetail } = usePokemonCache();
    const [query, setQuery]     = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef(null);

    // Debounced search
    useEffect(() => {
        if (!query.trim()) { setResults([]); return; }
        const timer = setTimeout(() => {
            const q = query.toLowerCase().replace(/\s+/g, '-');
            const list = listState.list;
            const startsWith = list.filter(p => p.name.startsWith(q));
            const contains   = list.filter(p => !p.name.startsWith(q) && p.name.includes(q));
            setResults([...startsWith, ...contains].slice(0, 8));
        }, 150);
        return () => clearTimeout(timer);
    }, [query, listState.list]);

    // Close on outside click
    useEffect(() => {
        function handle(e) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setResults([]);
        }
        document.addEventListener('mousedown', handle);
        return () => document.removeEventListener('mousedown', handle);
    }, []);

    async function handleSelect(entry) {
        setResults([]);
        setQuery('');
        setLoading(true);
        try {
            const id = getIdFromUrl(entry.url);
            const raw = await fetchPokemonDetail(String(id));
            onSelect(extractPokemon(raw));
        } finally {
            setLoading(false);
        }
    }

    const tier = pokemon ? getLoreTierInfo(pokemon) : null;

    return (
        <SelectorPanel>
            <SelectorLabel>{label}</SelectorLabel>

            <PanelSearchWrapper ref={wrapperRef}>
                <PanelSearchInput
                    type="text"
                    placeholder="Search Pokémon…"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && results.length > 0) handleSelect(results[0]); if (e.key === 'Escape') setResults([]); }}
                    autoComplete="off"
                />
                {results.length > 0 && (
                    <PanelDropDown>
                        {results.map(entry => {
                            const id = getIdFromUrl(entry.url);
                            return (
                                <PanelDropDownItem key={entry.name} onMouseDown={e => { e.preventDefault(); handleSelect(entry); }}>
                                    <DropdownSprite
                                        src={dreamWorldUrl(id)}
                                        alt={entry.name}
                                        onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = artworkUrl(id); }}
                                    />
                                    <DropdownName>{capitalizeFirstLetter(entry.name)}</DropdownName>
                                    <DropdownNumber>#{String(id).padStart(3, '0')}</DropdownNumber>
                                </PanelDropDownItem>
                            );
                        })}
                    </PanelDropDown>
                )}
            </PanelSearchWrapper>

            {loading && <EmptySlot>Loading…</EmptySlot>}

            {!loading && !pokemon && (
                <EmptySlot>
                    <span style={{ fontSize: '2rem', opacity: 0.3 }}>?</span>
                    Choose a Pokémon
                </EmptySlot>
            )}

            {!loading && pokemon && (
                <SelectedCard>
                    <SelectedArtwork
                        src={artworkUrl(pokemon.id)}
                        alt={pokemon.name}
                    />
                    <SelectedName>{capitalizeFirstLetter(pokemon.name)}</SelectedName>

                    <TypeBadgesRow>
                        {pokemon.types.map(t => {
                            const typeName = t.type.name;
                            const color = colorMap[typeName]?.color;
                            return <TypeBadge key={typeName} $color={color}>{typeName}</TypeBadge>;
                        })}
                        <TierBadge $color={tier.color}>{tier.label}</TierBadge>
                    </TypeBadgesRow>

                    <StatsMini>
                        {[
                            ['HP',   pokemon.stats.hp],
                            ['Atk',  pokemon.stats.attack],
                            ['Def',  pokemon.stats.defense],
                            ['SpA',  pokemon.stats.specialAttack],
                            ['SpD',  pokemon.stats.specialDefense],
                            ['Spd',  pokemon.stats.speed],
                        ].map(([label, val]) => (
                            <StatMiniRow key={label}>
                                <StatMiniLabel>{label}</StatMiniLabel>
                                <StatMiniValue>{val}</StatMiniValue>
                            </StatMiniRow>
                        ))}
                    </StatsMini>
                </SelectedCard>
            )}
        </SelectorPanel>
    );
}

// ── Overlay animation phases ─────────────────────────────────────────────────
// 0 = hidden, 1 = intro, 2 = tension, 3 = drain, 4 = result flash
function BattleOverlay({ pokemonA, pokemonB, bpsResult, winner, onComplete }) {
    const [phase, setPhase] = useState(0);
    const [hpA, setHpA]     = useState(100);
    const [hpB, setHpB]     = useState(100);

    const winnerPokemon = winner === 'A' ? pokemonA : winner === 'B' ? pokemonB : null;

    // Winner remaining HP = (winnerBPS - loserBPS) / winnerBPS, clamped to min 1%
    // Loser always drains to 0%
    const { aBPS, bBPS } = bpsResult;
    const winnerBPS = winner === 'A' ? aBPS : winner === 'B' ? bBPS : Math.max(aBPS, bBPS);
    const loserBPS  = winner === 'A' ? bBPS : winner === 'B' ? aBPS : Math.min(aBPS, bBPS);
    const winnerPct = winnerBPS > 0
        ? Math.max(1, Math.round(((winnerBPS - loserBPS) / winnerBPS) * 100))
        : 100;
    // tie: both stay at 100%
    const finalHpA = winner === 'A' ? winnerPct : winner === 'B' ? 0 : 100;
    const finalHpB = winner === 'B' ? winnerPct : winner === 'A' ? 0 : 100;

    useEffect(() => {
        // Phase 1: intro — show combatants (1000ms)
        const t1 = setTimeout(() => setPhase(1), 50);
        // Phase 2: tension title text (800ms after phase 1)
        const t2 = setTimeout(() => setPhase(2), 1050);
        // Phase 3: drain HP bars (1500ms)
        const t3 = setTimeout(() => {
            setPhase(3);
            setHpA(finalHpA);
            setHpB(finalHpB);
        }, 1850);
        // Phase 4: result flash
        const t4 = setTimeout(() => setPhase(4), 3400);
        // Done
        const t5 = setTimeout(() => onComplete(), 4300);
        return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const overlayTitles = {
        1: '⚔ Battle begins!',
        2: '…',
        3: 'Fighting…',
        4: winnerPokemon ? `${capitalizeFirstLetter(winnerPokemon.name)} wins!` : "It's a tie!",
    };

    return (
        <OverlayBackdrop>
            <OverlayTitle $visible={phase >= 1}>{overlayTitles[phase] ?? ''}</OverlayTitle>

            {phase >= 1 && (
                <CombatantsRow>
                    <CombatantSlot>
                        <CombatantSprite src={artworkUrl(pokemonA.id)} alt={pokemonA.name} />
                        <CombatantName>{capitalizeFirstLetter(pokemonA.name)}</CombatantName>
                        <HealthBarWrapper>
                            <HealthLabel>HP</HealthLabel>
                            <HealthTrack><HealthFill $pct={hpA} /></HealthTrack>
                        </HealthBarWrapper>
                    </CombatantSlot>

                    <OverlayVs>VS</OverlayVs>

                    <CombatantSlot>
                        <CombatantSprite src={artworkUrl(pokemonB.id)} alt={pokemonB.name} />
                        <CombatantName>{capitalizeFirstLetter(pokemonB.name)}</CombatantName>
                        <HealthBarWrapper>
                            <HealthLabel>HP</HealthLabel>
                            <HealthTrack><HealthFill $pct={hpB} /></HealthTrack>
                        </HealthBarWrapper>
                    </CombatantSlot>
                </CombatantsRow>
            )}
        </OverlayBackdrop>
    );
}

// ── Narrator awe system ───────────────────────────────────────────────────────
const APEX_POKEMON = new Set([
    'arceus', 'mewtwo', 'giratina', 'dialga', 'palkia',
    'rayquaza', 'kyogre', 'groudon', 'zygarde',
    'eternatus', 'necrozma', 'lunala', 'solgaleo',
    'xerneas', 'yveltal', 'reshiram', 'zekrom', 'kyurem',
]);

const FAN_FAVOURITES = new Set([
    'charizard', 'gengar', 'lucario', 'eevee',
    'umbreon', 'espeon', 'gardevoir', 'blaziken',
    'greninja', 'mimikyu', 'sylveon', 'mewtwo',
    'dragonite', 'tyranitar', 'garchomp',
    'snorlax', 'mew',
]);

function getSystemPrompt(pokemonA, pokemonB) {
    const aName = pokemonA.name.toLowerCase();
    const bName = pokemonB.name.toLowerCase();
    const aIsApex = APEX_POKEMON.has(aName);
    const bIsApex = APEX_POKEMON.has(bName);
    const aIsSpecial = pokemonA.legendary || pokemonA.mythical || aIsApex;
    const bIsSpecial = pokemonB.legendary || pokemonB.mythical || bIsApex;

    let system;
    if (aIsApex || bIsApex) {
        system = `You are an analytical Pokémon battle chronicler. One subject in this record is among the most extraordinary specimens ever documented. Acknowledge its significance in one brief, understated sentence that references its specific lore — for Arceus reference its cosmic origin, for Mewtwo its engineered nature, for Rayquaza its atmospheric dominion. Then proceed with clinical analysis of why the winner prevailed: type data, stat differentials, habitat origin, capture resistance. 2-3 paragraphs. The weight of what is documented here should be felt through restraint, not drama.`;
    } else if (aIsSpecial && bIsSpecial) {
        system = `You are an analytical Pokémon battle chronicler writing in the style of an official Pokédex entry. Both subjects carry legendary or mythical classifications — note this in a single understated sentence ('Encounters of this nature are exceptionally rare in recorded field data.') then proceed analytically. Explain the outcome through the data: stats, type advantage, habitat, capture rate. 2-3 paragraphs. Authoritative and measured — never dramatic.`;
    } else if (aIsSpecial || bIsSpecial) {
        system = `You are an analytical Pokémon battle chronicler writing in the style of an official Pokédex entry — cold, authoritative, and factual. One of these Pokémon carries a designation rarely observed in the field. Acknowledge this briefly and matter-of-factly — a single sentence noting its rarity — then explain why the winner won through stats, type, habitat, and capture data. Write 2-3 concise paragraphs. Clinical and precise.`;
    } else {
        system = `You are an analytical Pokémon battle chronicler writing in the style of an official Pokédex entry — cold, authoritative, and factual. Explain why the winner won by referencing their specific stats, type matchup, habitat origin, and capture difficulty. Write 2-3 concise paragraphs. No excitement, no spectator language. State facts and draw conclusions from them.`;
    }

    // Fan favourite addendum
    const favs = [pokemonA, pokemonB]
        .filter(p => FAN_FAVOURITES.has(p.name.toLowerCase()))
        .map(p => capitalizeFirstLetter(p.name));
    if (favs.length > 0) {
        system += ` ${favs.map(n => `${n} carries a legacy of trainer attachment that field data alone cannot quantify.`).join(' ')}`;
    }

    return system;
}

// ── AI Narrative ─────────────────────────────────────────────────────────────
function pokeDataBlock(p) {
    const tbs     = Object.values(p.stats).reduce((s, v) => s + v, 0);
    const types   = p.types.map(t => t.type.name).join('/');
    const lore    = getLoreTierInfo(p).label;
    const habitat = p.habitat ? capitalizeFirstLetter(p.habitat.replace(/-/g, ' ')) : 'Unknown';
    const capture = p.captureRate ?? 'Unknown';
    return `Type: ${types} | Lore: ${lore} | TBS: ${tbs} | Habitat: ${habitat} | Capture Rate: ${capture}`;
}

function buildNarrativePrompt(pokemonA, pokemonB, winner, bpsResult) {
    const { aBPS, bBPS, aBestMulti, bBestMulti } = bpsResult;
    const system = getSystemPrompt(pokemonA, pokemonB);

    if (winner === 'tie') {
        const userPrompt =
`Document this battle outcome:

RESULT: TIE
SUBJECT A: ${capitalizeFirstLetter(pokemonA.name)}
${pokeDataBlock(pokemonA)}

SUBJECT B: ${capitalizeFirstLetter(pokemonB.name)}
${pokeDataBlock(pokemonB)}

BPS differential: ${Math.abs(aBPS - bBPS).toFixed(2)} (negligible margin)

Explain why this encounter produced no decisive winner. Reference the specific data above. Do not speculate beyond what the numbers support.`;
        return { system, userPrompt };
    }

    const w = winner === 'A' ? pokemonA : pokemonB;
    const l = winner === 'A' ? pokemonB : pokemonA;
    const wBPS = winner === 'A' ? aBPS : bBPS;
    const lBPS = winner === 'A' ? bBPS : aBPS;
    const winMulti = winner === 'A' ? aBestMulti : bBestMulti;
    const marginPct = wBPS > 0 ? ((wBPS - lBPS) / wBPS) * 100 : 0;
    const dominance = marginPct > 40 ? 'Decisive' : marginPct > 15 ? 'Moderate' : 'Narrow';

    // Top 2-3 contributing factors
    const factors = [];
    if (winMulti > 1) factors.push(`Type advantage (${winMulti}× effectiveness)`);
    if (w.stats.speed > l.stats.speed) factors.push(`Superior speed (${w.stats.speed} vs ${l.stats.speed})`);
    const wOff = Math.max(w.stats.attack, w.stats.specialAttack);
    const lOff = Math.max(l.stats.attack, l.stats.specialAttack);
    if (wOff > lOff) factors.push(`Higher offensive ceiling (${wOff} vs ${lOff})`);
    const wTbs = Object.values(w.stats).reduce((s, v) => s + v, 0);
    const lTbs = Object.values(l.stats).reduce((s, v) => s + v, 0);
    if (wTbs > lTbs && factors.length < 3) factors.push(`Higher base stat total (${wTbs} vs ${lTbs})`);
    const wDef = Math.max(w.stats.defense, w.stats.specialDefense);
    const lDef = Math.max(l.stats.defense, l.stats.specialDefense);
    if (wDef > lDef && factors.length < 3) factors.push(`Superior defensive stats (${wDef} vs ${lDef})`);
    if (factors.length === 0) factors.push('Marginal statistical advantage across multiple categories');

    const userPrompt =
`Document this battle outcome:

WINNER: ${capitalizeFirstLetter(w.name)}
${pokeDataBlock(w)}

LOSER: ${capitalizeFirstLetter(l.name)}
${pokeDataBlock(l)}

Victory margin: ${dominance} (${Math.abs(wBPS - lBPS).toFixed(2)} point differential in Battle Power Score)

Leading factors in outcome: ${factors.slice(0, 3).join('; ')}

Explain why ${capitalizeFirstLetter(w.name)} prevailed. Reference the specific data above. Do not speculate beyond what the numbers support.`;

    return { system, userPrompt };
}

async function fetchNarrative({ system, userPrompt }) {
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    console.log('[Battle] fetchNarrative called — apiKey present:', !!apiKey);
    if (!apiKey) throw new Error('VITE_ANTHROPIC_API_KEY is not set in .env');

    const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
            model: 'claude-sonnet-4-6',
            max_tokens: 450,
            system,
            messages: [{ role: 'user', content: userPrompt }],
        }),
    });
    if (!res.ok) {
        const errBody = await res.text().catch(() => '');
        throw new Error(`API error ${res.status}: ${errBody}`);
    }
    const data = await res.json();
    console.log('[Battle] API response content:', data.content);
    return data.content?.[0]?.text ?? '';
}

// ── Narrative text with clickable Pokémon names ───────────────────────────────
function renderNarrativeWithLinks(text, pokemonA, pokemonB) {
    const subjects = [pokemonA, pokemonB].map(p => ({
        displayName: capitalizeFirstLetter(p.name),
        id: p.id,
        typeColor: colorMap[p.types[0]?.type?.name]?.color ?? '#ffcc00',
    }));

    // Build regex matching either display name (case-insensitive)
    const escaped = subjects.map(s => s.displayName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) => {
        const match = subjects.find(s => s.displayName.toLowerCase() === part.toLowerCase());
        if (match) {
            return (
                <PokemonNameLink key={i} to={`/collection/${match.id}`} $typecolor={match.typeColor}>
                    {part}
                </PokemonNameLink>
            );
        }
        return part;
    });
}

// ── Results panel ─────────────────────────────────────────────────────────────
function ResultsPanel({ pokemonA, pokemonB, winner, bpsResult, onReset }) {
    const [activeTab, setActiveTab]   = useState('narrative');
    const [narrative, setNarrative]   = useState('');
    const [narLoading, setNarLoading] = useState(true);
    const [narError, setNarError]     = useState('');
    const cancelledRef = useRef(false);

    const winnerPokemon = winner === 'A' ? pokemonA : winner === 'B' ? pokemonB : null;
    const { aBPS, bBPS, aBestMulti, bBestMulti, aDamage, bDamage, aStatBreakdown, bStatBreakdown } = bpsResult;

    const winnerTypeColor = winnerPokemon
        ? (colorMap[winnerPokemon.types[0]?.type?.name]?.color ?? '#ffcc00')
        : '#ffcc00';

    function runFetch() {
        cancelledRef.current = false;
        setNarLoading(true);
        setNarError('');
        setNarrative('');
        const prompt = buildNarrativePrompt(pokemonA, pokemonB, winner, bpsResult);
        fetchNarrative(prompt)
            .then(text => { if (!cancelledRef.current) setNarrative(text); })
            .catch(err => {
                console.error('[Battle] narrative fetch error:', err);
                if (!cancelledRef.current) setNarError(err.message || String(err));
            })
            .finally(() => { if (!cancelledRef.current) setNarLoading(false); });
    }

    useEffect(() => {
        runFetch();
        return () => { cancelledRef.current = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ResultsSection>
            {winnerPokemon ? (
                <WinnerBanner>
                    <WinnerSprite src={artworkUrl(winnerPokemon.id)} alt={winnerPokemon.name} />
                    <WinnerText>
                        <WinnerLabel>Winner</WinnerLabel>
                        <WinnerName>
                            <PokemonNameLink
                                to={`/collection/${winnerPokemon.id}`}
                                $typecolor={winnerTypeColor}
                            >
                                {capitalizeFirstLetter(winnerPokemon.name)}
                            </PokemonNameLink>
                        </WinnerName>
                    </WinnerText>
                </WinnerBanner>
            ) : (
                <WinnerBanner>
                    <WinnerText>
                        <WinnerLabel>Result</WinnerLabel>
                        <WinnerName style={{ color: '#ffffff' }}>It's a tie!</WinnerName>
                    </WinnerText>
                </WinnerBanner>
            )}

            <TabRow>
                <Tab $active={activeTab === 'narrative' ? 1 : 0} onClick={() => setActiveTab('narrative')}>
                    Battle Narrative
                </Tab>
                <Tab $active={activeTab === 'breakdown' ? 1 : 0} onClick={() => setActiveTab('breakdown')}>
                    Breakdown
                </Tab>
            </TabRow>

            <TabContent>
                {activeTab === 'narrative' && (
                    <>
                        {narLoading ? (
                            <NarrativeLoading><Spinner /> Generating battle commentary…</NarrativeLoading>
                        ) : narError ? (
                            <>
                                <NarrativeText style={{ color: 'rgba(255,100,100,0.85)', fontStyle: 'italic' }}>
                                    {narError}
                                </NarrativeText>
                                <RegenerateButton onClick={runFetch}>↺ Retry</RegenerateButton>
                            </>
                        ) : (
                            <>
                                <NarrativeText>
                                    {renderNarrativeWithLinks(narrative, pokemonA, pokemonB)}
                                </NarrativeText>
                                <RegenerateButton onClick={runFetch}>↺ Regenerate</RegenerateButton>
                            </>
                        )}
                    </>
                )}

                {activeTab === 'breakdown' && (() => {
                    const sides = [
                        { poke: pokemonA, bps: aBPS, multi: aBestMulti, dmg: aDamage, statData: aStatBreakdown, side: 'A' },
                        { poke: pokemonB, bps: bBPS, multi: bBestMulti, dmg: bDamage, statData: bStatBreakdown, side: 'B' },
                    ];
                    // Max contribution per stat across both Pokémon (for bar scaling)
                    const maxContrib = Math.max(
                        ...sides.flatMap(({ statData }) => Object.values(statData.contributions))
                    );
                    return (
                        <BreakdownGrid>
                            {sides.map(({ poke, bps, multi, dmg, statData, side }) => {
                                const typeColor = colorMap[poke.types[0]?.type?.name]?.color ?? '#ffcc00';
                                const otherStatData = side === 'A' ? bStatBreakdown : aStatBreakdown;
                                return (
                                    <BreakdownCard key={side}>
                                        <BreakdownCardTitle>
                                            <PokemonNameLink to={`/collection/${poke.id}`} $typecolor={typeColor}>
                                                {capitalizeFirstLetter(poke.name)}
                                            </PokemonNameLink>
                                        </BreakdownCardTitle>
                                        <BreakdownRow>
                                            <span>Battle Score</span>
                                            <BreakdownValue>{bps.toFixed(2)}</BreakdownValue>
                                        </BreakdownRow>
                                        <BreakdownRow>
                                            <span>Type Advantage</span>
                                            <MultiplierBadge $multi={multi}>{multi}×</MultiplierBadge>
                                        </BreakdownRow>
                                        <BreakdownRow>
                                            <span>Offense Rating</span>
                                            <BreakdownValue>{dmg.toFixed(2)}</BreakdownValue>
                                        </BreakdownRow>
                                        <StatBreakdownSection>
                                            {Object.entries(statData.contributions).map(([stat, val]) => {
                                                const otherVal = otherStatData.contributions[stat];
                                                const isWinning = val >= otherVal;
                                                return (
                                                    <StatBreakdownRow key={stat}>
                                                        <StatBreakdownLabel>{STAT_SHORT_NAMES[stat]}</StatBreakdownLabel>
                                                        <StatBreakdownTrack>
                                                            <StatBreakdownFill
                                                                $pct={maxContrib > 0 ? (val / maxContrib) * 100 : 0}
                                                                $highlight={isWinning}
                                                            />
                                                        </StatBreakdownTrack>
                                                        <StatBreakdownValue $highlight={isWinning}>
                                                            {val.toFixed(1)}
                                                        </StatBreakdownValue>
                                                    </StatBreakdownRow>
                                                );
                                            })}
                                        </StatBreakdownSection>
                                    </BreakdownCard>
                                );
                            })}
                        </BreakdownGrid>
                    );
                })()}
            </TabContent>

            <PlayAgainButton onClick={onReset}>⟳ Battle Again</PlayAgainButton>
        </ResultsSection>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────
function BattlePage() {
    const { listState, fetchAllListPages, fetchPokemonDetail } = usePokemonCache();
    const [pokemonA, setPokemonA] = useState(null);
    const [pokemonB, setPokemonB] = useState(null);
    const [phase, setPhase]       = useState('select'); // 'select' | 'animating' | 'results'
    const [bpsResult, setBpsResult]   = useState(null);
    const [winner, setWinner]         = useState(null);
    const [suggestions, setSuggestions]       = useState(() => buildSuggestions([]));
    const [loadingSuggestion, setLoadingSuggestion] = useState(false);

    // Ensure list is loaded for autocomplete + random suggestion names (run once on mount)
    useEffect(() => { fetchAllListPages(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Refresh random suggestion once list is fully loaded
    useEffect(() => {
        if (listState.fullyLoaded) setSuggestions(buildSuggestions(listState.list));
    }, [listState.fullyLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

    async function handleSuggestionSelect(sugA, sugB) {
        if (loadingSuggestion) return;
        setLoadingSuggestion(true);
        try {
            const [rawA, rawB] = await Promise.all([
                fetchPokemonDetail(String(sugA.id)),
                fetchPokemonDetail(String(sugB.id)),
            ]);
            setPokemonA(extractPokemon(rawA));
            setPokemonB(extractPokemon(rawB));
        } finally {
            setLoadingSuggestion(false);
        }
    }

    function handleShuffle() {
        setSuggestions(buildSuggestions(listState.list));
    }

    function handleBattle() {
        if (!pokemonA || !pokemonB) return;
        const result = calculateBPS(pokemonA, pokemonB);
        const w = determineWinner(result.aBPS, result.bBPS);
        setBpsResult(result);
        setWinner(w);
        setPhase('animating');
    }

    function handleAnimationComplete() {
        setPhase('results');
    }

    function handleReset() {
        setPokemonA(null);
        setPokemonB(null);
        setBpsResult(null);
        setWinner(null);
        setPhase('select');
    }

    const canBattle = pokemonA && pokemonB && phase === 'select';

    return (
        <BattlePageWrapper>
            <BattlePageTitle>⚔ Battle Arena</BattlePageTitle>
            <BattleTitleLine />

            {phase !== 'results' && (
                <>
                    <SelectorRow>
                        <PokemonSelector label="Fighter 1" pokemon={pokemonA} onSelect={setPokemonA} />
                        <VsDivider>VS</VsDivider>
                        <PokemonSelector label="Fighter 2" pokemon={pokemonB} onSelect={setPokemonB} />
                    </SelectorRow>

                    <BattleButton onClick={handleBattle} disabled={!canBattle}>
                        BATTLE!
                    </BattleButton>

                    <SuggestionsSection>
                        <SuggestionsHeading>Suggested Battles</SuggestionsHeading>
                        <SuggestionsTitleLine />
                        <SuggestionsRow>
                            {suggestions.map((sug, i) => (
                                <SuggestionCard
                                    key={i}
                                    onClick={() => handleSuggestionSelect(sug.a, sug.b)}
                                    style={{ opacity: loadingSuggestion ? 0.6 : 1 }}
                                >
                                    <SuggestionInner>
                                        <SuggestionPoke>
                                            <SuggestionSprite
                                                src={dreamWorldUrl(sug.a.id)}
                                                alt={sug.a.name}
                                                onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = artworkUrl(sug.a.id); }}
                                            />
                                            <SuggestionPokeName>{capitalizeFirstLetter(sug.a.name)}</SuggestionPokeName>
                                        </SuggestionPoke>
                                        <SuggestionVs>VS</SuggestionVs>
                                        <SuggestionPoke>
                                            <SuggestionSprite
                                                src={dreamWorldUrl(sug.b.id)}
                                                alt={sug.b.name}
                                                onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = artworkUrl(sug.b.id); }}
                                            />
                                            <SuggestionPokeName>{capitalizeFirstLetter(sug.b.name)}</SuggestionPokeName>
                                        </SuggestionPoke>
                                    </SuggestionInner>
                                    <SuggestionCta>Battle this matchup →</SuggestionCta>
                                </SuggestionCard>
                            ))}
                        </SuggestionsRow>
                        <ShuffleButton onClick={handleShuffle}>⟳ Shuffle</ShuffleButton>
                    </SuggestionsSection>
                </>
            )}

            {phase === 'animating' && bpsResult && (
                <BattleOverlay
                    pokemonA={pokemonA}
                    pokemonB={pokemonB}
                    bpsResult={bpsResult}
                    winner={winner}
                    onComplete={handleAnimationComplete}
                />
            )}

            {phase === 'results' && bpsResult && (
                <ResultsPanel
                    pokemonA={pokemonA}
                    pokemonB={pokemonB}
                    winner={winner}
                    bpsResult={bpsResult}
                    onReset={handleReset}
                />
            )}
        </BattlePageWrapper>
    );
}

export default BattlePage;
