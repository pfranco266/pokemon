import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAbilitiesCache } from '../../context/AbilitiesCacheContext';
import { capitalizeFirstLetter, sanitizeFlavorText } from '../../utils/stringUtils';
import { HomeContainer } from '../Home/Home.styled';
import { AbilityPageTitle, AbilityTitleLine, NoDescription, LoadingText } from './Abilities.styled';
import {
    BackLink,
    GenBadge,
    DetailSection,
    DetailHeading,
    DetailSubHeading,
    DetailBody,
    FlavorRow,
    VersionBadge,
    FlavorText,
    PokemonList,
    PokemonEntry,
} from './AbilityDetail.styled';

function formatName(name) {
    return name.split('-').map(w => capitalizeFirstLetter(w)).join(' ');
}

function getIdFromUrl(url) {
    return url.split('/').filter(Boolean).pop();
}

function AbilityDetail() {
    const { name } = useParams();
    const { fetchAbilityDetail } = useAbilitiesCache();
    const [ability, setAbility] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        setAbility(null);
        fetchAbilityDetail(name)
            .then(data => { setAbility(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, [name, fetchAbilityDetail]);

    if (loading) return <HomeContainer><LoadingText>Loading...</LoadingText></HomeContainer>;
    if (!ability) return <HomeContainer><LoadingText>Ability not found.</LoadingText></HomeContainer>;

    const enEffect = ability.effect_entries?.find(e => e.language.name === 'en');
    const fullEffect = enEffect?.effect ? sanitizeFlavorText(enEffect.effect) : null;

    const genLabel = ability.generation?.name ? formatName(ability.generation.name) : null;

    const enFlavors = ability.flavor_text_entries?.filter(e => e.language.name === 'en') ?? [];
    const dedupedFlavors = enFlavors.reduce((acc, entry) => {
        const text = sanitizeFlavorText(entry.flavor_text);
        if (!text) return acc;
        if (acc.length === 0 || acc[acc.length - 1].text !== text) {
            acc.push({ version: entry.version_group.name, text });
        }
        return acc;
    }, []);

    const isBaseForm = (p) => parseInt(p.pokemon.url.split('/').filter(Boolean).pop()) <= 1025;

    const dedupeByName = (arr) => {
        const seen = new Set();
        return arr.filter(p => {
            if (seen.has(p.pokemon.name)) return false;
            seen.add(p.pokemon.name);
            return true;
        });
    };

    const standardPokemon = dedupeByName(
        (ability.pokemon ?? [])
            .filter(p => !p.is_hidden && isBaseForm(p))
            .sort((a, b) => a.pokemon.name.localeCompare(b.pokemon.name))
    );

    const hiddenPokemon = dedupeByName(
        (ability.pokemon ?? [])
            .filter(p => p.is_hidden && isBaseForm(p))
            .sort((a, b) => a.pokemon.name.localeCompare(b.pokemon.name))
    );

    return (
        <HomeContainer>
            <BackLink to="/abilities">← Back to Abilities</BackLink>

            <AbilityPageTitle>{formatName(name)}</AbilityPageTitle>
            <AbilityTitleLine />
            {genLabel && <GenBadge>Introduced in {genLabel}</GenBadge>}

            <DetailSection>
                <DetailHeading>Effect</DetailHeading>
                {fullEffect
                    ? <DetailBody>{fullEffect}</DetailBody>
                    : <NoDescription>No description available</NoDescription>
                }
            </DetailSection>

            {dedupedFlavors.length > 0 && (
                <DetailSection>
                    <DetailHeading>Game Descriptions</DetailHeading>
                    {dedupedFlavors.map(({ version, text }) => (
                        <FlavorRow key={version}>
                            <VersionBadge>{formatName(version)}</VersionBadge>
                            <FlavorText>{text}</FlavorText>
                        </FlavorRow>
                    ))}
                </DetailSection>
            )}

            {(standardPokemon.length > 0 || hiddenPokemon.length > 0) && (
                <DetailSection>
                    <DetailHeading>Pokémon with this Ability</DetailHeading>

                    {standardPokemon.length > 0 && (
                        <>
                            <DetailSubHeading>Standard Ability</DetailSubHeading>
                            <PokemonList>
                                {standardPokemon.map(p => (
                                    <PokemonEntry
                                        key={p.pokemon.name}
                                        to={`/collection/${getIdFromUrl(p.pokemon.url)}`}
                                    >
                                        {capitalizeFirstLetter(p.pokemon.name)}
                                    </PokemonEntry>
                                ))}
                            </PokemonList>
                        </>
                    )}

                    {hiddenPokemon.length > 0 && (
                        <>
                            <DetailSubHeading>Hidden Ability</DetailSubHeading>
                            <PokemonList>
                                {hiddenPokemon.map(p => (
                                    <PokemonEntry
                                        key={p.pokemon.name}
                                        to={`/collection/${getIdFromUrl(p.pokemon.url)}`}
                                    >
                                        {capitalizeFirstLetter(p.pokemon.name)}
                                    </PokemonEntry>
                                ))}
                            </PokemonList>
                        </>
                    )}
                </DetailSection>
            )}
        </HomeContainer>
    );
}

export default AbilityDetail;
