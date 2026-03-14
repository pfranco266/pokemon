import React, { createContext, useContext, useRef, useState } from 'react';
import { fetchPokeList, fetchSinglePokemon, fetchEvolutionData } from '../api/pokeAPI';

const PokemonCacheContext = createContext();

export const PokemonCacheProvider = ({ children }) => {
    const [listState, setListState] = useState({
        list: [],
        nextUrl: `https://pokeapi.co/api/v2/pokemon-species/`,
        fullyLoaded: false,
        loading: false,
        error: null,
        totalCount: null, // populated from data.count on first fetch
    });

    const detailCache = useRef(new Map());

    const fetchNextListPage = async () => {
        if (listState.loading || listState.fullyLoaded) return;

        setListState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const { data } = await fetchPokeList(listState.nextUrl);
            setListState(prev => ({
                ...prev,
                list: [...prev.list, ...data.results],
                nextUrl: data.next,
                fullyLoaded: !data.next,
                loading: false,
                totalCount: prev.totalCount ?? data.count,
            }));
        } catch (error) {
            setListState(prev => ({ ...prev, loading: false, error: error.message }));
        }
    };

    const fetchAllListPages = async () => {
        if (listState.fullyLoaded) return;

        setListState(prev => ({ ...prev, loading: true, error: null }));
        try {
            let url = listState.nextUrl;
            let accumulated = [...listState.list];
            let totalCount = listState.totalCount;

            while (url) {
                const { data } = await fetchPokeList(url);
                accumulated = [...accumulated, ...data.results];
                if (totalCount === null) totalCount = data.count;
                url = data.next;
                setListState(prev => ({
                    ...prev,
                    list: accumulated,
                    nextUrl: data.next,
                    fullyLoaded: !data.next,
                    loading: !!data.next,
                    totalCount,
                }));
            }
        } catch (error) {
            setListState(prev => ({ ...prev, loading: false, error: error.message }));
        }
    };

    // Returns null for any index beyond the valid species range so callers
    // can skip rendering rather than firing a request that will 404.
    const fetchPokemonDetail = async (index) => {
        if (listState.totalCount !== null && index > listState.totalCount) return null;

        if (detailCache.current.has(index)) {
            return detailCache.current.get(index);
        }

        const { pokemonSpeciesData, pokemonDetailData } = await fetchSinglePokemon(index);
        let evolutionData = {};
        if (pokemonSpeciesData.evolution_chain?.url) {
            const evolvesFromUrl = pokemonSpeciesData.evolves_from_species?.url || '';
            evolutionData = await fetchEvolutionData(pokemonSpeciesData.evolution_chain.url, evolvesFromUrl);
        }

        const result = { pokemonSpeciesData, pokemonDetailData, evolutionData };
        detailCache.current.set(index, result);
        return result;
    };

    return (
        <PokemonCacheContext.Provider value={{
            listState,
            fetchNextListPage,
            fetchAllListPages,
            fetchPokemonDetail,
        }}>
            {children}
        </PokemonCacheContext.Provider>
    );
};

export const usePokemonCache = () => useContext(PokemonCacheContext);

export default PokemonCacheContext;
