import React, { useState, useEffect, useMemo } from 'react';
import { HomeContainer } from '../Home/Home.styled';
import { useMovesCache } from '../../context/MovesCacheContext';
import { capitalizeFirstLetter } from '../../utils/stringUtils';
import colorMap from '../../utils/colorMap';
import { PageQuoteBlock, QuoteFirstSentence } from '../../components/shared/PageQuoteBlock.styled';
import {
    MovePageTitle,
    MoveTitleLine,
    FilterControlsRow,
    MoveSearchInput,
    FilterSelect,
    MoveTable,
    MoveHeaderRow,
    MoveRow,
    ColHeader,
    ColHeaderPower,
    ColHeaderGen,
    ColHeaderEffect,
    MoveNameCell,
    MoveTypeCell,
    MovePowerCell,
    MoveGenCell,
    MoveEffectCell,
    TypeBadge,
    LoadingText,
    NoMovesText,
} from './Moves.styled';

const ALL_TYPES = Object.keys(colorMap);

function formatMoveName(name) {
    return name.split('-').map(w => capitalizeFirstLetter(w)).join(' ');
}

function formatGenLabel(gen) {
    return 'GEN ' + gen.split('-').pop().toUpperCase();
}

function truncate(text, max = 80) {
    if (!text) return null;
    return text.length > max ? text.slice(0, max) + '…' : text;
}

function MovesLanding() {
    const { moves, loading, fetchMoves } = useMovesCache();
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [genFilter, setGenFilter] = useState('');
    const [sortKey, setSortKey] = useState('name');
    const [sortDir, setSortDir] = useState('asc');

    useEffect(() => {
        fetchMoves();
    }, [fetchMoves]);

    const availableGens = useMemo(() => {
        const seen = new Set();
        moves.forEach(m => { if (m.generation) seen.add(m.generation); });
        return [...seen].sort();
    }, [moves]);

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
        return moves
            .filter(m => {
                if (q && !m.name.includes(q)) return false;
                if (typeFilter && m.type !== typeFilter) return false;
                if (genFilter && m.generation !== genFilter) return false;
                return true;
            })
            .sort((a, b) => {
                if (sortKey === 'power') {
                    const av = a.power, bv = b.power;
                    if (av === null && bv === null) return 0;
                    if (av === null) return 1;
                    if (bv === null) return -1;
                    return sortDir === 'asc' ? av - bv : bv - av;
                }
                const av = a[sortKey] ?? '';
                const bv = b[sortKey] ?? '';
                const cmp = av.localeCompare(bv);
                return sortDir === 'asc' ? cmp : -cmp;
            });
    }, [moves, searchTerm, typeFilter, genFilter, sortKey, sortDir]);

    function sortIndicator(key) {
        if (sortKey !== key) return null;
        return <span style={{ color: '#ffcc00', marginLeft: '0.3em' }}>{sortDir === 'asc' ? '▲' : '▼'}</span>;
    }

    return (
        <HomeContainer>
            <MovePageTitle>Moves</MovePageTitle>
            <MoveTitleLine />
            <PageQuoteBlock>
                <QuoteFirstSentence>Moves are actions a Pokémon performs in battle.</QuoteFirstSentence>{' '}
                Each move has a type, power, accuracy, and PP (the number of times it can be used).
                Moves can be Physical, Special, or Status — Physical moves use Attack and Defense stats,
                Special moves use Special Attack and Special Defense, and Status moves create effects
                without dealing direct damage.
            </PageQuoteBlock>
            <FilterControlsRow>
                <MoveSearchInput
                    type="text"
                    placeholder="Search moves..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <FilterSelect
                    value={typeFilter}
                    onChange={e => setTypeFilter(e.target.value)}
                >
                    <option value="">All Types</option>
                    {ALL_TYPES.map(type => (
                        <option key={type} value={type}>
                            {capitalizeFirstLetter(type)}
                        </option>
                    ))}
                </FilterSelect>
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
            {loading && moves.length === 0 && (
                <LoadingText>Loading moves...</LoadingText>
            )}
            {!loading && filtered.length === 0 && moves.length > 0 && (
                <NoMovesText>No moves found.</NoMovesText>
            )}
            <MoveTable>
                <MoveHeaderRow>
                    <ColHeader sortable={1} active={sortKey === 'name' ? 1 : 0} onClick={() => handleSort('name')}>
                        Name{sortIndicator('name')}
                    </ColHeader>
                    <ColHeader sortable={1} active={sortKey === 'type' ? 1 : 0} onClick={() => handleSort('type')}>
                        Type{sortIndicator('type')}
                    </ColHeader>
                    <ColHeaderPower sortable={1} active={sortKey === 'power' ? 1 : 0} onClick={() => handleSort('power')}>
                        Pwr{sortIndicator('power')}
                    </ColHeaderPower>
                    <ColHeaderGen sortable={1} active={sortKey === 'generation' ? 1 : 0} onClick={() => handleSort('generation')}>
                        Gen{sortIndicator('generation')}
                    </ColHeaderGen>
                    <ColHeaderEffect>Effect</ColHeaderEffect>
                </MoveHeaderRow>
                {filtered.map((move, idx) => {
                    const typeColor = colorMap[move.type]?.color ?? null;
                    return (
                        <MoveRow
                            key={move.name}
                            to={`/moves/${move.name}`}
                            iseven={idx % 2 === 0 ? 1 : 0}
                        >
                            <MoveNameCell>{formatMoveName(move.name)}</MoveNameCell>
                            <MoveTypeCell>
                                <TypeBadge typecolor={typeColor}>{move.type ?? '—'}</TypeBadge>
                            </MoveTypeCell>
                            <MovePowerCell>{move.power ?? '—'}</MovePowerCell>
                            <MoveGenCell>{move.generation ? formatGenLabel(move.generation) : '—'}</MoveGenCell>
                            <MoveEffectCell>{truncate(move.shortEffect) ?? <span style={{ color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>—</span>}</MoveEffectCell>
                        </MoveRow>
                    );
                })}
            </MoveTable>
        </HomeContainer>
    );
}

export default MovesLanding;
