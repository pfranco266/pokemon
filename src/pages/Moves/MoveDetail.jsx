import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMovesCache } from '../../context/MovesCacheContext';
import { capitalizeFirstLetter, sanitizeFlavorText } from '../../utils/stringUtils';
import colorMap from '../../utils/colorMap';
import { HomeContainer } from '../Home/Home.styled';
import { LoadingText } from './Moves.styled';
import {
    BackLink,
    MovePageTitle,
    MoveTitleLine,
    BadgeRow,
    TypeBadge,
    ClassBadge,
    StatBlockRow,
    StatBlock,
    StatBlockValue,
    StatBlockLabel,
    MoveDetailSection,
    MoveDetailHeading,
    MoveDetailBody,
    FlavorRow,
    VersionBadge,
    FlavorText,
    PokemonList,
    PokemonEntry,
} from './Moves.styled';

// Module-level cache — persists for the full session without re-fetching
const typeFetchCache = new Map();

function formatName(name) {
    return name.split('-').map(w => capitalizeFirstLetter(w)).join(' ');
}

// "generation-ii" → "Generation II"
function formatGenLabel(name) {
    if (!name) return null;
    const roman = name.split('-').pop().toUpperCase();
    return `Generation ${roman}`;
}

function getIdFromUrl(url) {
    return url.split('/').filter(Boolean).pop();
}

function MoveDetail() {
    const { name } = useParams();
    const { fetchMoveDetail } = useMovesCache();
    const [move, setMove] = useState(null);
    const [loading, setLoading] = useState(true);
    const [typeMap, setTypeMap] = useState({});

    useEffect(() => {
        setLoading(true);
        setMove(null);
        setTypeMap({});
        fetchMoveDetail(name)
            .then(data => { setMove(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, [name, fetchMoveDetail]);

    // Compute list before early returns so the type-fetch effect can depend on it
    const learnedByPokemon = useMemo(() => {
        if (!move) return [];
        const isBaseForm = (p) => parseInt(p.url.split('/').filter(Boolean).pop()) <= 1025;
        const seen = new Set();
        return (move.learned_by_pokemon ?? [])
            .filter(p => {
                if (!isBaseForm(p)) return false;
                if (seen.has(p.name)) return false;
                seen.add(p.name);
                return true;
            })
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [move]);

    // Batch-fetch primary types for Pokémon in the list
    useEffect(() => {
        if (learnedByPokemon.length === 0) return;

        // Seed from module-level cache immediately
        const initialMap = {};
        learnedByPokemon.forEach(p => {
            if (typeFetchCache.has(p.name)) initialMap[p.name] = typeFetchCache.get(p.name);
        });
        setTypeMap(initialMap);

        const toFetch = learnedByPokemon.filter(p => !typeFetchCache.has(p.name));
        if (toFetch.length === 0) return;

        let cancelled = false;
        const BATCH = 20;

        (async () => {
            const map = { ...initialMap };
            for (let i = 0; i < toFetch.length; i += BATCH) {
                if (cancelled) break;
                const batch = toFetch.slice(i, i + BATCH);
                const results = await Promise.all(
                    batch.map(p =>
                        fetch(`https://pokeapi.co/api/v2/pokemon/${p.name}`)
                            .then(r => r.json())
                            .then(d => ({ name: p.name, type: d.types?.[0]?.type?.name ?? null }))
                            .catch(() => ({ name: p.name, type: null }))
                    )
                );
                results.forEach(({ name: pName, type }) => {
                    typeFetchCache.set(pName, type);
                    map[pName] = type;
                });
                if (!cancelled) setTypeMap({ ...map });
            }
        })();

        return () => { cancelled = true; };
    }, [learnedByPokemon]);

    if (loading) return <HomeContainer><LoadingText>Loading...</LoadingText></HomeContainer>;
    if (!move) return <HomeContainer><LoadingText>Move not found.</LoadingText></HomeContainer>;

    const typeColor = colorMap[move.type?.name]?.color ?? '#ffcc00';

    const enEffect = move.effect_entries?.find(e => e.language.name === 'en');
    let fullEffect = enEffect?.effect ? sanitizeFlavorText(enEffect.effect) : null;
    if (fullEffect && move.effect_chance != null) {
        fullEffect = fullEffect.replace(/\$effect_chance\$/g, move.effect_chance);
    }

    const enFlavors = move.flavor_text_entries?.filter(e => e.language.name === 'en') ?? [];
    const dedupedFlavors = enFlavors.reduce((acc, entry) => {
        const text = sanitizeFlavorText(entry.flavor_text);
        if (!text) return acc;
        if (acc.length === 0 || acc[acc.length - 1].text !== text) {
            acc.push({ version: entry.version_group.name, text });
        }
        return acc;
    }, []);

    return (
        <HomeContainer>
            <BackLink to="/moves">← Back to Moves</BackLink>

            <MovePageTitle>{formatName(name)}</MovePageTitle>
            <MoveTitleLine />

            <BadgeRow>
                {move.type && (
                    <TypeBadge typecolor={typeColor} style={{ fontSize: '0.9rem', padding: '0.3em 0.8em' }}>
                        {move.type.name}
                    </TypeBadge>
                )}
                {move.damage_class && (
                    <ClassBadge damageclass={move.damage_class.name} style={{ fontSize: '0.9rem', padding: '0.3em 0.8em' }}>
                        {capitalizeFirstLetter(move.damage_class.name)}
                    </ClassBadge>
                )}
            </BadgeRow>

            <StatBlockRow>
                <StatBlock>
                    <StatBlockValue typecolor={typeColor}>{move.power ?? '—'}</StatBlockValue>
                    <StatBlockLabel>Power</StatBlockLabel>
                </StatBlock>
                <StatBlock>
                    <StatBlockValue typecolor={typeColor}>
                        {move.accuracy != null ? `${move.accuracy}%` : '—'}
                    </StatBlockValue>
                    <StatBlockLabel>Accuracy</StatBlockLabel>
                </StatBlock>
                <StatBlock>
                    <StatBlockValue typecolor={typeColor}>{move.pp ?? '—'}</StatBlockValue>
                    <StatBlockLabel>PP</StatBlockLabel>
                </StatBlock>
                {move.generation?.name && (
                    <StatBlock>
                        <StatBlockValue typecolor={typeColor} style={{ fontSize: '1rem' }}>
                            {formatGenLabel(move.generation.name)}
                        </StatBlockValue>
                        <StatBlockLabel>Generation</StatBlockLabel>
                    </StatBlock>
                )}
            </StatBlockRow>

            {fullEffect && (
                <MoveDetailSection>
                    <MoveDetailHeading>Effect</MoveDetailHeading>
                    <MoveDetailBody>{fullEffect}</MoveDetailBody>
                </MoveDetailSection>
            )}

            {dedupedFlavors.length > 0 && (
                <MoveDetailSection>
                    <MoveDetailHeading>Game Descriptions</MoveDetailHeading>
                    {dedupedFlavors.map(({ version, text }) => (
                        <FlavorRow key={version}>
                            <VersionBadge>{formatName(version)}</VersionBadge>
                            <FlavorText>{text}</FlavorText>
                        </FlavorRow>
                    ))}
                </MoveDetailSection>
            )}

            {learnedByPokemon.length > 0 && (
                <MoveDetailSection>
                    <MoveDetailHeading>Pokémon that learn this Move</MoveDetailHeading>
                    <PokemonList>
                        {learnedByPokemon.map(p => (
                            <PokemonEntry
                                key={p.name}
                                to={`/collection/${getIdFromUrl(p.url)}`}
                                typecolor={colorMap[typeMap[p.name]]?.color ?? null}
                            >
                                {capitalizeFirstLetter(p.name)}
                            </PokemonEntry>
                        ))}
                    </PokemonList>
                </MoveDetailSection>
            )}
        </HomeContainer>
    );
}

export default MoveDetail;
