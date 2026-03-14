import React, { useEffect, useReducer } from "react";
import { pokemonReducer, initialPokeDetails } from "../../reducers/pokemonReducer";
import { PokemonSVG, SinglePokemonContainer, PokemonName, PokemonIndex } from "./Browse.styled";
import PokemonTypes from "./PokemonTypes";
import Pokeball from "../../components/Pokeball/Pokeball";
import { usePokemonCache } from "../../context/PokemonCacheContext";
import { capitalizeFirstLetter } from "../../utils/stringUtils";

function SinglePokeCard({ index, selectedOption = "" }) {
    const [pokemonDetails, dispatch] = useReducer(pokemonReducer, initialPokeDetails);
    const { fetchPokemonDetail } = usePokemonCache();

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'setLoading' });
            try {
                const result = await fetchPokemonDetail(index);
                if (!result) return; // index beyond valid species range
                const { pokemonSpeciesData, pokemonDetailData, evolutionData } = result;
                dispatch({
                    type: 'setPokemonDetails',
                    payload: { pokemonDetailData, pokemonSpeciesData, evolutionData }
                });
            } catch (error) {
                dispatch({ type: 'setError', payload: error.message });
            }
        };
        fetchData();
    }, [index, selectedOption]);

    if (!pokemonDetails.name) return null;

    const card = (
        <SinglePokemonContainer to={`/collection/${pokemonDetails?.id}`} type={pokemonDetails?.types[0]?.type?.name}>
            <PokemonIndex>#{pokemonDetails?.id}</PokemonIndex>
            <PokemonName>{capitalizeFirstLetter(pokemonDetails.name)}</PokemonName>
            <PokemonTypes types={pokemonDetails?.types} />
            <Pokeball />
            <PokemonSVG
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${index}.svg`}
                alt={pokemonDetails.name}
                onError={(e) => {
                    e.currentTarget.onError = null;
                    e.currentTarget.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${index}.png`;
                }}
            />
        </SinglePokemonContainer>
    );

    if (selectedOption === '') return card;
    if (selectedOption === 'Legendary') return pokemonDetails.legendary ? card : null;
    if (selectedOption === 'Mythical') return pokemonDetails.mythical ? card : null;
    if (selectedOption === pokemonDetails?.types[0]?.type?.name) return card;
    return null;
}

export default SinglePokeCard;
