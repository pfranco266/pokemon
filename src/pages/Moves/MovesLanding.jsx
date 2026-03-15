import React, { useState, useEffect } from 'react';
import { HomeContainer } from '../Home/Home.styled';
import { useMovesCache } from '../../context/MovesCacheContext';
import { capitalizeFirstLetter } from '../../utils/stringUtils';
import colorMap from '../../utils/colorMap';
import {
    MovePageTitle,
    MoveTitleLine,
    PageDescription,
    MoveSearchContainer,
    MoveSearchInput,
    MoveTable,
    MoveHeaderRow,
    MoveRow,
    ColHeader,
    ColHeaderPower,
    ColHeaderAcc,
    ColHeaderPP,
    ColHeaderGen,
    ColHeaderEffect,
    MoveNameCell,
    MoveTypeCell,
    MoveClassCell,
    MovePowerCell,
    MoveAccCell,
    MovePPCell,
    MoveGenCell,
    MoveEffectCell,
    TypeBadge,
    ClassBadge,
    LoadingText,
} from './Moves.styled';

function formatMoveName(name) {
    return name.split('-').map(w => capitalizeFirstLetter(w)).join(' ');
}

function truncate(text, max = 80) {
    if (!text) return null;
    return text.length > max ? text.slice(0, max) + '…' : text;
}

function MovesLanding() {
    const { moves, loading, fetchMoves } = useMovesCache();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchMoves();
    }, [fetchMoves]);

    const filtered = searchTerm
        ? moves.filter(m => m.name.includes(searchTerm.toLowerCase().replace(/\s+/g, '-')))
        : moves;

    return (
        <HomeContainer>
            <MovePageTitle>Moves</MovePageTitle>
            <MoveTitleLine />
            <PageDescription>
                Moves are actions a Pokémon performs in battle. Each move has a type, power, accuracy,
                and PP (the number of times it can be used). Moves can be Physical, Special, or Status —
                Physical moves use Attack and Defense stats, Special moves use Special Attack and Special
                Defense, and Status moves create effects without dealing direct damage.
            </PageDescription>
            <MoveSearchContainer>
                <MoveSearchInput
                    type="text"
                    placeholder="Search moves..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </MoveSearchContainer>
            {loading && moves.length === 0 && (
                <LoadingText>Loading moves...</LoadingText>
            )}
            <MoveTable>
                <MoveHeaderRow>
                    <ColHeader>Name</ColHeader>
                    <ColHeader>Type</ColHeader>
                    <ColHeader>Class</ColHeader>
                    <ColHeaderPower>Pwr</ColHeaderPower>
                    <ColHeaderAcc>Acc</ColHeaderAcc>
                    <ColHeaderPP>PP</ColHeaderPP>
                    <ColHeaderGen>Gen</ColHeaderGen>
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
                            <MoveClassCell>
                                {move.damageClass && (
                                    <ClassBadge damageclass={move.damageClass}>
                                        {capitalizeFirstLetter(move.damageClass)}
                                    </ClassBadge>
                                )}
                            </MoveClassCell>
                            <MovePowerCell>{move.power ?? '—'}</MovePowerCell>
                            <MoveAccCell>{move.accuracy != null ? `${move.accuracy}%` : '—'}</MoveAccCell>
                            <MovePPCell>{move.pp ?? '—'}</MovePPCell>
                            <MoveGenCell>{move.generation ? move.generation.replace(/-/g, ' ') : '—'}</MoveGenCell>
                            <MoveEffectCell>{truncate(move.shortEffect) ?? <span style={{ color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>—</span>}</MoveEffectCell>
                        </MoveRow>
                    );
                })}
            </MoveTable>
        </HomeContainer>
    );
}

export default MovesLanding;
