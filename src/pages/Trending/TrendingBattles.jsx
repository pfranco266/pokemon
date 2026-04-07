import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HomeContainer } from '../Home/Home.styled';
import { supabase } from '../../utils/supabaseClient';
import { capitalizeFirstLetter } from '../../utils/stringUtils';
import {
    TrendingPageTitle,
    TrendingTitleLine,
    TrendingSubtitle,
    LoadingText,
    EmptyText,
    ErrorText,
    TrendingList,
    RankNumber,
    PokemonSprite,
    PokemonName,
    RefreshButton,
    SectionTitle,
    SectionLine,
    TimeToggleRow,
    TimeToggleBtn,
    PickRightCol,
    PickCount,
    WinCount,
    WinRateBadge,
    MatchupRow,
    MatchupPoke,
    MatchupSprite,
    MatchupPokeName,
    MatchupVs,
    MatchupRight,
    MatchupCount,
    MatchupWinLine,
    TrendingRow,
    VisitCount,
} from './Trending.styled';

const ARTWORK = (id) =>
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

function aggregateData(data) {
    // ── Most Picked ───────────────────────────────────────────────────────────
    const pickCounts = {};
    (data ?? []).forEach((battle) => {
        const sides = [
            { id: battle.pokemon1_id, name: battle.pokemon1_name },
            { id: battle.pokemon2_id, name: battle.pokemon2_name },
        ];
        sides.forEach(({ id, name }) => {
            if (!pickCounts[id]) pickCounts[id] = { id, name, picks: 0, wins: 0 };
            pickCounts[id].picks++;
        });
        if (battle.winner_id && pickCounts[battle.winner_id]) {
            pickCounts[battle.winner_id].wins++;
        }
    });
    const topPicks = Object.values(pickCounts)
        .sort((a, b) => b.picks - a.picks)
        .slice(0, 10);

    // ── Most Common Matchups ──────────────────────────────────────────────────
    const matchupCounts = {};
    (data ?? []).forEach((battle) => {
        const idA = Math.min(battle.pokemon1_id, battle.pokemon2_id);
        const idB = Math.max(battle.pokemon1_id, battle.pokemon2_id);
        const nameA = battle.pokemon1_id <= battle.pokemon2_id
            ? battle.pokemon1_name : battle.pokemon2_name;
        const nameB = battle.pokemon1_id <= battle.pokemon2_id
            ? battle.pokemon2_name : battle.pokemon1_name;
        const key = `${idA}_${idB}`;
        if (!matchupCounts[key]) {
            matchupCounts[key] = { idA, nameA, idB, nameB, battles: 0, winsA: 0, winsB: 0 };
        }
        matchupCounts[key].battles++;
        if (battle.winner_id === idA) matchupCounts[key].winsA++;
        else if (battle.winner_id === idB) matchupCounts[key].winsB++;
    });
    const topMatchups = Object.values(matchupCounts)
        .sort((a, b) => b.battles - a.battles)
        .slice(0, 10);

    return { topPicks, topMatchups };
}

function winLineText(winsA, winsB, nameA, nameB) {
    if (winsA === winsB) return { text: `Even ${winsA}–${winsB}`, decisive: false };
    const leader = winsA > winsB ? nameA : nameB;
    const [hi, lo] = winsA > winsB ? [winsA, winsB] : [winsB, winsA];
    return { text: `${capitalizeFirstLetter(leader)} leads ${hi}–${lo}`, decisive: true };
}

function TrendingBattles() {
    const navigate = useNavigate();
    const [timeWindow, setTimeWindow] = useState('7days');
    const [topPicks, setTopPicks] = useState([]);
    const [topMatchups, setTopMatchups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchData = useCallback(async (window) => {
        setLoading(true);
        setError(false);
        try {
            let query = supabase.from('battle_history').select('*');
            if (window === '7days') {
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                query = query.gte('battled_at', sevenDaysAgo.toISOString());
            }
            const { data, error: supaError } = await query;
            if (supaError) throw supaError;
            const { topPicks: picks, topMatchups: matchups } = aggregateData(data);
            setTopPicks(picks);
            setTopMatchups(matchups);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData(timeWindow);
    }, [fetchData, timeWindow]);

    const isEmpty = !loading && !error && topPicks.length === 0 && topMatchups.length === 0;

    return (
        <HomeContainer>
            <TrendingPageTitle>Battle Trends</TrendingPageTitle>
            <TrendingTitleLine />
            <TrendingSubtitle>Most popular battles and Pokémon picks</TrendingSubtitle>

            <TimeToggleRow>
                <TimeToggleBtn
                    $active={timeWindow === '7days'}
                    onClick={() => setTimeWindow('7days')}
                >
                    Last 7 Days
                </TimeToggleBtn>
                <TimeToggleBtn
                    $active={timeWindow === 'alltime'}
                    onClick={() => setTimeWindow('alltime')}
                >
                    All Time
                </TimeToggleBtn>
            </TimeToggleRow>

            {loading && <LoadingText>Loading battle trends...</LoadingText>}
            {!loading && error && <ErrorText>Battle data unavailable right now.</ErrorText>}
            {isEmpty && <EmptyText>No battles recorded yet — start battling!</EmptyText>}

            {!loading && !error && topPicks.length > 0 && (
                <>
                    <SectionTitle>Most Picked Pokémon</SectionTitle>
                    <SectionLine />
                    <TrendingList>
                        {topPicks.map(({ id, name, picks, wins }, idx) => {
                            const rank = idx + 1;
                            const winRate = picks > 0 ? Math.round((wins / picks) * 100) : 0;
                            return (
                                <TrendingRow
                                    key={id}
                                    to={`/collection/${id}`}
                                    $rank={rank}
                                    $iseven={idx % 2 === 0 ? 1 : 0}
                                >
                                    <RankNumber $rank={rank}>#{rank}</RankNumber>
                                    <PokemonSprite src={ARTWORK(id)} alt={name} />
                                    <PokemonName>{capitalizeFirstLetter(name)}</PokemonName>
                                    <PickRightCol>
                                        <PickCount>{picks} {picks === 1 ? 'pick' : 'picks'}</PickCount>
                                        <WinCount>{wins} {wins === 1 ? 'win' : 'wins'}</WinCount>
                                        <WinRateBadge $rate={winRate}>{winRate}%</WinRateBadge>
                                    </PickRightCol>
                                </TrendingRow>
                            );
                        })}
                    </TrendingList>
                </>
            )}

            {!loading && !error && topMatchups.length > 0 && (
                <>
                    <SectionTitle>Most Common Matchups</SectionTitle>
                    <SectionLine />
                    <TrendingList>
                        {topMatchups.map(({ idA, nameA, idB, nameB, battles, winsA, winsB }, idx) => {
                            const rank = idx + 1;
                            const { text, decisive } = winLineText(winsA, winsB, nameA, nameB);
                            return (
                                <MatchupRow
                                    key={`${idA}_${idB}`}
                                    $rank={rank}
                                    $iseven={idx % 2 === 0 ? 1 : 0}
                                    onClick={() => navigate('/battle', { state: { pokemonAId: idA, pokemonBId: idB } })}
                                >
                                    <RankNumber $rank={rank}>#{rank}</RankNumber>

                                    <MatchupPoke>
                                        <Link
                                            to={`/collection/${idA}`}
                                            onClick={e => e.stopPropagation()}
                                            style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}
                                        >
                                            <MatchupSprite src={ARTWORK(idA)} alt={nameA} />
                                            <MatchupPokeName>{capitalizeFirstLetter(nameA)}</MatchupPokeName>
                                        </Link>
                                    </MatchupPoke>

                                    <MatchupVs>VS</MatchupVs>

                                    <MatchupPoke>
                                        <Link
                                            to={`/collection/${idB}`}
                                            onClick={e => e.stopPropagation()}
                                            style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}
                                        >
                                            <MatchupSprite src={ARTWORK(idB)} alt={nameB} />
                                            <MatchupPokeName>{capitalizeFirstLetter(nameB)}</MatchupPokeName>
                                        </Link>
                                    </MatchupPoke>

                                    <MatchupRight>
                                        <MatchupCount>{battles} {battles === 1 ? 'battle' : 'battles'}</MatchupCount>
                                        <MatchupWinLine $decisive={decisive}>{text}</MatchupWinLine>
                                    </MatchupRight>
                                </MatchupRow>
                            );
                        })}
                    </TrendingList>
                </>
            )}

            <RefreshButton onClick={() => fetchData(timeWindow)} disabled={loading}>
                ⟳ Refresh
            </RefreshButton>
        </HomeContainer>
    );
}

export default TrendingBattles;
