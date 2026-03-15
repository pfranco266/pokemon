import React, { useState, useEffect } from 'react';
import { HomeContainer } from '../Home/Home.styled';
import { useAbilitiesCache } from '../../context/AbilitiesCacheContext';
import { capitalizeFirstLetter } from '../../utils/stringUtils';
import {
    AbilitySearchContainer,
    AbilitySearchInput,
    AbilityTable,
    AbilityRow,
    AbilityName,
    AbilityEffect,
    AbilityPageTitle,
    AbilityTitleLine,
    PageDescription,
    NoDescription,
    LoadingText,
} from './Abilities.styled';

function formatAbilityName(name) {
    return name.split('-').map(word => capitalizeFirstLetter(word)).join(' ');
}

function AbilitiesLanding() {
    const { abilities, loading, fetchAbilities } = useAbilitiesCache();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchAbilities();
    }, [fetchAbilities]);

    const filtered = searchTerm
        ? abilities.filter(a => a.name.includes(searchTerm.toLowerCase().replace(/\s+/g, '-')))
        : abilities;

    return (
        <HomeContainer>
            <AbilityPageTitle>Abilities</AbilityPageTitle>
            <AbilityTitleLine />
            <PageDescription>
                Abilities are passive traits that affect a Pokémon in battle or in the overworld.
                Unlike moves, abilities are always active and do not need to be selected — they activate
                automatically based on conditions. Each Pokémon can have up to two standard abilities and
                one hidden ability, which is rarer and often more powerful.
            </PageDescription>
            <AbilitySearchContainer>
                <AbilitySearchInput
                    type="text"
                    placeholder="Search abilities..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </AbilitySearchContainer>
            {loading && abilities.length === 0 && (
                <LoadingText>Loading abilities...</LoadingText>
            )}
            <AbilityTable>
                {filtered.map((ability, idx) => (
                    <AbilityRow
                        key={ability.name}
                        to={`/abilities/${ability.name}`}
                        iseven={idx % 2 === 0 ? 1 : 0}
                    >
                        <AbilityName>{formatAbilityName(ability.name)}</AbilityName>
                        {ability.shortEffect
                            ? <AbilityEffect>{ability.shortEffect}</AbilityEffect>
                            : <NoDescription>No description available</NoDescription>
                        }
                    </AbilityRow>
                ))}
            </AbilityTable>
        </HomeContainer>
    );
}

export default AbilitiesLanding;
