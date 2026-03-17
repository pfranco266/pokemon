import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTypesCache } from '../../context/TypesCacheContext';
import { capitalizeFirstLetter } from '../../utils/stringUtils';
import colorMap from '../../utils/colorMap';
import { HomeContainer } from '../Home/Home.styled';
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
    PokemonGrid,
    PokemonEntry,
    LoadingText,
} from './TypeDetail.styled';

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

    useEffect(() => {
        setLoading(true);
        setTypeData(null);
        fetchTypeDetail(name)
            .then(data => { setTypeData(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, [name, fetchTypeDetail]);

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

    // Pokémon with this type — filter to base forms, sort alphabetically
    const rawPokemon = typeData.pokemon ?? [];
    const pokemonList = rawPokemon
        .filter(p => isBaseForm(p.pokemon.url))
        .sort((a, b) => a.pokemon.name.localeCompare(b.pokemon.name));

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
                    <PokemonGrid>
                        {pokemonList.map(p => (
                            <PokemonEntry
                                key={p.pokemon.name}
                                to={`/collection/${getIdFromUrl(p.pokemon.url)}`}
                            >
                                {capitalizeFirstLetter(p.pokemon.name)}
                            </PokemonEntry>
                        ))}
                    </PokemonGrid>
                </PokemonSection>
            )}
        </HomeContainer>
    );
}

export default TypeDetail;
