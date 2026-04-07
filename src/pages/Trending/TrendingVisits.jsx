import React, { useState, useEffect, useCallback } from 'react';
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
    TrendingRow,
    RankNumber,
    PokemonSprite,
    PokemonName,
    VisitCount,
    RefreshButton,
} from './Trending.styled';

function TrendingVisits() {
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchTrending = useCallback(async () => {
        setLoading(true);
        setError(false);

        try {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const { data, error: supaError } = await supabase
                .from('pokemon_visits')
                .select('pokemon_id, pokemon_name')
                .gte('visited_at', sevenDaysAgo.toISOString());

            if (supaError) {
                console.log('Supabase error:', JSON.stringify(supaError));
                throw supaError;
            }

            const counts = {};
            (data ?? []).forEach(({ pokemon_id, pokemon_name }) => {
                if (!counts[pokemon_id]) {
                    counts[pokemon_id] = { pokemon_id, pokemon_name, visits: 0 };
                }
                counts[pokemon_id].visits += 1;
            });

            const sorted = Object.values(counts)
                .sort((a, b) => b.visits - a.visits)
                .slice(0, 10);

            setRankings(sorted);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTrending();
    }, [fetchTrending]);

    return (
        <HomeContainer>
            <TrendingPageTitle>Most Visited Pokémon</TrendingPageTitle>
            <TrendingTitleLine />
            <TrendingSubtitle>Most visited Pokémon pages in the last 7 days</TrendingSubtitle>

            {loading && <LoadingText>Loading trending Pokémon...</LoadingText>}

            {!loading && error && (
                <ErrorText>Trending data unavailable right now.</ErrorText>
            )}

            {!loading && !error && rankings.length === 0 && (
                <EmptyText>No visits recorded yet — start exploring Pokémon!</EmptyText>
            )}

            {!loading && !error && rankings.length > 0 && (
                <TrendingList>
                    {rankings.map(({ pokemon_id, pokemon_name, visits }, idx) => {
                        const rank = idx + 1;
                        return (
                            <TrendingRow
                                key={pokemon_id}
                                to={`/collection/${pokemon_id}`}
                                $rank={rank}
                                $iseven={idx % 2 === 0 ? 1 : 0}
                            >
                                <RankNumber $rank={rank}>#{rank}</RankNumber>
                                <PokemonSprite
                                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon_id}.png`}
                                    alt={pokemon_name}
                                />
                                <PokemonName>{capitalizeFirstLetter(pokemon_name)}</PokemonName>
                                <VisitCount>{visits} {visits === 1 ? 'visit' : 'visits'}</VisitCount>
                            </TrendingRow>
                        );
                    })}
                </TrendingList>
            )}

            <RefreshButton onClick={fetchTrending} disabled={loading}>
                ⟳ Refresh
            </RefreshButton>
        </HomeContainer>
    );
}

export default TrendingVisits;
