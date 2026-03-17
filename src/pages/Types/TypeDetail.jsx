import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTypesCache } from '../../context/TypesCacheContext';
import { capitalizeFirstLetter } from '../../utils/stringUtils';
import colorMap from '../../utils/colorMap';
import { HomeContainer } from '../Home/Home.styled';
import { PokemonList, PokemonEntry } from '../Moves/Moves.styled';
import {
    BackLink,
    TypeBanner,
    TypeBannerIcon,
    TypeBannerName,
    EffectivenessSection,
    SectionHeading,
    SubHeading,
    TypeBadgeRow,
    EffBadge,
    NoneLabel,
    PokemonSection,
    LoadingText,
} from './TypeDetail.styled';

// Module-level cache — persists for the full session without re-fetching
const typeFetchCache = new Map();

const ALL_TYPES = Object.keys(colorMap);

function getIdFromUrl(url) {
    return url.split('/').filter(Boolean).pop();
}

function isBaseForm(url) {
    return parseInt(getIdFromUrl(url)) <= 1025;
}

function TypeDetail() {
    const { name } = useParams();
    const { fetchTypeDetail } = useTypesCache();
    const [typeData, setTypeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pokemonTypeMap, setPokemonTypeMap] = useState({});

    useEffect(() => {
        setLoading(true);
        setTypeData(null);
        setPokemonTypeMap({});
        fetchTypeDetail(name)
            .then(data => { setTypeData(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, [name, fetchTypeDetail]);

    // Pokémon with this type — filter to base forms, sort alphabetically
    const rawPokemon = typeData?.pokemon ?? [];
    const pokemonList = useMemo(() => rawPokemon
        .filter(p => isBaseForm(p.pokemon.url))
        .sort((a, b) => a.pokemon.name.localeCompare(b.pokemon.name)),
    [rawPokemon]);

    // Batch-fetch primary types for Pokémon in the list
    useEffect(() => {
        if (pokemonList.length === 0) return;

        const initialMap = {};
        pokemonList.forEach(p => {
            if (typeFetchCache.has(p.pokemon.name)) initialMap[p.pokemon.name] = typeFetchCache.get(p.pokemon.name);
        });
        setPokemonTypeMap(initialMap);

        const toFetch = pokemonList.filter(p => !typeFetchCache.has(p.pokemon.name));
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
                        fetch(`https://pokeapi.co/api/v2/pokemon/${p.pokemon.name}`)
                            .then(r => r.json())
                            .then(d => ({ name: p.pokemon.name, type: d.types?.[0]?.type?.name ?? null }))
                            .catch(() => ({ name: p.pokemon.name, type: null }))
                    )
                );
                results.forEach(({ name: pName, type }) => {
                    typeFetchCache.set(pName, type);
                    map[pName] = type;
                });
                if (!cancelled) setPokemonTypeMap({ ...map });
            }
        })();

        return () => { cancelled = true; };
    }, [pokemonList]);

    const typeInfo = colorMap[name];

    if (loading) return <HomeContainer><LoadingText>Loading...</LoadingText></HomeContainer>;
    if (!typeData || !typeInfo) return <HomeContainer><LoadingText>Type not found.</LoadingText></HomeContainer>;

    const Icon = typeInfo.icon;
    const typeColor = typeInfo.color;

    // Offense: what does this type do when attacking?
    const superEffectiveAgainst = ALL_TYPES.filter(def => (colorMap[def].typeChart[name] ?? 1) === 2);
    const notVeryEffectiveAgainst = ALL_TYPES.filter(def => (colorMap[def].typeChart[name] ?? 1) === 0.5);
    const noEffectAgainst = ALL_TYPES.filter(def => (colorMap[def].typeChart[name] ?? 1) === 0);

    // Defense: what happens when this type is attacked?
    const weakTo = ALL_TYPES.filter(atk => (colorMap[name].typeChart[atk] ?? 1) === 2);
    const resistantTo = ALL_TYPES.filter(atk => (colorMap[name].typeChart[atk] ?? 1) === 0.5);
    const immuneTo = ALL_TYPES.filter(atk => (colorMap[name].typeChart[atk] ?? 1) === 0);

    function TypeLink({ type }) {
        const c = colorMap[type]?.color;
        return (
            <EffBadge to={`/types/${type}`} typecolor={c}>
                {capitalizeFirstLetter(type)}
            </EffBadge>
        );
    }

    return (
        <HomeContainer>
            <BackLink to="/types">← Back to Types</BackLink>

            <TypeBanner typecolor={typeColor}>
                <TypeBannerIcon><Icon /></TypeBannerIcon>
                <TypeBannerName>{capitalizeFirstLetter(name)}</TypeBannerName>
            </TypeBanner>

            <EffectivenessSection>
                <SectionHeading>Offense</SectionHeading>

                <SubHeading>Super Effective Against (2×)</SubHeading>
                <TypeBadgeRow>
                    {superEffectiveAgainst.length > 0
                        ? superEffectiveAgainst.map(t => <TypeLink key={t} type={t} />)
                        : <NoneLabel>None</NoneLabel>
                    }
                </TypeBadgeRow>

                <SubHeading>Not Very Effective Against (½×)</SubHeading>
                <TypeBadgeRow>
                    {notVeryEffectiveAgainst.length > 0
                        ? notVeryEffectiveAgainst.map(t => <TypeLink key={t} type={t} />)
                        : <NoneLabel>None</NoneLabel>
                    }
                </TypeBadgeRow>

                <SubHeading>No Effect Against (0×)</SubHeading>
                <TypeBadgeRow>
                    {noEffectAgainst.length > 0
                        ? noEffectAgainst.map(t => <TypeLink key={t} type={t} />)
                        : <NoneLabel>None</NoneLabel>
                    }
                </TypeBadgeRow>
            </EffectivenessSection>

            <EffectivenessSection>
                <SectionHeading>Defense</SectionHeading>

                <SubHeading>Weak To (2×)</SubHeading>
                <TypeBadgeRow>
                    {weakTo.length > 0
                        ? weakTo.map(t => <TypeLink key={t} type={t} />)
                        : <NoneLabel>None</NoneLabel>
                    }
                </TypeBadgeRow>

                <SubHeading>Resistant To (½×)</SubHeading>
                <TypeBadgeRow>
                    {resistantTo.length > 0
                        ? resistantTo.map(t => <TypeLink key={t} type={t} />)
                        : <NoneLabel>None</NoneLabel>
                    }
                </TypeBadgeRow>

                <SubHeading>Immune To (0×)</SubHeading>
                <TypeBadgeRow>
                    {immuneTo.length > 0
                        ? immuneTo.map(t => <TypeLink key={t} type={t} />)
                        : <NoneLabel>None</NoneLabel>
                    }
                </TypeBadgeRow>
            </EffectivenessSection>

            {pokemonList.length > 0 && (
                <PokemonSection>
                    <SectionHeading>Pokémon with {capitalizeFirstLetter(name)} type</SectionHeading>
                    <PokemonList>
                        {pokemonList.map(p => (
                            <PokemonEntry
                                key={p.pokemon.name}
                                to={`/collection/${getIdFromUrl(p.pokemon.url)}`}
                                typecolor={colorMap[pokemonTypeMap[p.pokemon.name]]?.color ?? null}
                            >
                                {capitalizeFirstLetter(p.pokemon.name)}
                            </PokemonEntry>
                        ))}
                    </PokemonList>
                </PokemonSection>
            )}
        </HomeContainer>
    );
}

export default TypeDetail;
