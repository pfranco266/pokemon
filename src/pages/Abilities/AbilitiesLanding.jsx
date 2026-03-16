import React, { useState, useEffect, useMemo } from 'react';
import { HomeContainer } from '../Home/Home.styled';
import { useAbilitiesCache } from '../../context/AbilitiesCacheContext';
import { capitalizeFirstLetter } from '../../utils/stringUtils';
import { PageQuoteBlock, QuoteFirstSentence } from '../../components/shared/PageQuoteBlock.styled';
import {
    FilterControlsRow,
    AbilitySearchInput,
    FilterSelect,
    AbilityTable,
    AbilityHeaderRow,
    AbilityColHeader,
    AbilityColHeaderGen,
    AbilityRow,
    AbilityName,
    AbilityEffect,
    AbilityGenCell,
    AbilityPageTitle,
    AbilityTitleLine,
    NoDescription,
    LoadingText,
    NoAbilitiesText,
} from './Abilities.styled';

function formatAbilityName(name) {
    return name.split('-').map(word => capitalizeFirstLetter(word)).join(' ');
}

function formatGenLabel(gen) {
    return 'GEN ' + gen.split('-').pop().toUpperCase();
}

function AbilitiesLanding() {
    const { abilities, loading, fetchAbilities } = useAbilitiesCache();
    const [searchTerm, setSearchTerm] = useState('');
    const [genFilter, setGenFilter] = useState('');
    const [sortKey, setSortKey] = useState('name');
    const [sortDir, setSortDir] = useState('asc');

    useEffect(() => {
        fetchAbilities();
    }, [fetchAbilities]);

    const availableGens = useMemo(() => {
        const seen = new Set();
        abilities.forEach(a => { if (a.generation) seen.add(a.generation); });
        return [...seen].sort();
    }, [abilities]);

    function handleSort(key) {
        if (key === sortKey) {
            setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDir('asc');
        }
    }

    const filtered = useMemo(() => {
        const q = searchTerm.toLowerCase().replace(/\s+/g, '-');
        return abilities
            .filter(a => {
                if (q && !a.name.includes(q)) return false;
                if (genFilter && a.generation !== genFilter) return false;
                return true;
            })
            .sort((a, b) => {
                const av = a[sortKey] ?? '';
                const bv = b[sortKey] ?? '';
                const cmp = av.localeCompare(bv);
                return sortDir === 'asc' ? cmp : -cmp;
            });
    }, [abilities, searchTerm, genFilter, sortKey, sortDir]);

    function sortIndicator(key) {
        if (sortKey !== key) return null;
        return <span style={{ color: '#ffcc00', marginLeft: '0.3em' }}>{sortDir === 'asc' ? '▲' : '▼'}</span>;
    }

    return (
        <HomeContainer>
            <AbilityPageTitle>Abilities</AbilityPageTitle>
            <AbilityTitleLine />
            <PageQuoteBlock>
                <QuoteFirstSentence>Abilities are passive traits that affect a Pokémon in battle or in the overworld.</QuoteFirstSentence>{' '}
                Unlike moves, abilities are always active and do not need to be selected — they activate
                automatically based on conditions. Each Pokémon can have up to two standard abilities and
                one hidden ability, which is rarer and often more powerful.
            </PageQuoteBlock>
            <FilterControlsRow>
                <AbilitySearchInput
                    type="text"
                    placeholder="Search abilities..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <FilterSelect
                    value={genFilter}
                    onChange={e => setGenFilter(e.target.value)}
                >
                    <option value="">All Generations</option>
                    {availableGens.map(gen => (
                        <option key={gen} value={gen}>
                            {formatGenLabel(gen)}
                        </option>
                    ))}
                </FilterSelect>
            </FilterControlsRow>
            {loading && abilities.length === 0 && (
                <LoadingText>Loading abilities...</LoadingText>
            )}
            {!loading && filtered.length === 0 && abilities.length > 0 && (
                <NoAbilitiesText>No abilities found.</NoAbilitiesText>
            )}
            <AbilityTable>
                <AbilityHeaderRow>
                    <AbilityColHeader
                        sortable={1}
                        active={sortKey === 'name' ? 1 : 0}
                        onClick={() => handleSort('name')}
                    >
                        Ability{sortIndicator('name')}
                    </AbilityColHeader>
                    <AbilityColHeaderGen
                        sortable={1}
                        active={sortKey === 'generation' ? 1 : 0}
                        onClick={() => handleSort('generation')}
                    >
                        Generation{sortIndicator('generation')}
                    </AbilityColHeaderGen>
                    <AbilityColHeader>Effect</AbilityColHeader>
                </AbilityHeaderRow>
                {filtered.map((ability, idx) => (
                    <AbilityRow
                        key={ability.name}
                        to={`/abilities/${ability.name}`}
                        iseven={idx % 2 === 0 ? 1 : 0}
                    >
                        <AbilityName>{formatAbilityName(ability.name)}</AbilityName>
                        <AbilityGenCell>
                            {ability.generation ? formatGenLabel(ability.generation) : '—'}
                        </AbilityGenCell>
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
