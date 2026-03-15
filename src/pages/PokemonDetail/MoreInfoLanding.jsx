import React, { useReducer, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { pokemonReducer, initialPokeDetails } from "../../reducers/pokemonReducer";
import { usePokemonCache } from "../../context/PokemonCacheContext";
import MoreInfoHeading from "./MoreInfoHeading";
import MoreInfoBody from "./MoreInfoBody";
import { HomeContainer } from "../Home/Home.styled";
import { PrevPokeButton, NextPokeButton } from "./MoreInfo.styled";
import { IoMdArrowRoundBack } from "react-icons/io";
import colorMap from "../../utils/colorMap";

function MoreInfoLanding() {
    const params = useParams();
    const pokeId = params?.id;
    const navigate = useNavigate();
    const { fetchPokemonDetail, listState } = usePokemonCache();
    const totalCount = listState.totalCount;

    const [pokemonDetails, setPokemonDetails] = useReducer(pokemonReducer, initialPokeDetails);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pokeId]);

    useEffect(() => {
        setPokemonDetails({ type: 'setLoading' });
        const load = async () => {
            try {
                const result = await fetchPokemonDetail(pokeId);
                if (!result) {
                    setPokemonDetails({ type: 'setError', payload: 'Not found' });
                    return;
                }
                const { pokemonSpeciesData, pokemonDetailData, evolutionData } = result;
                setPokemonDetails({
                    type: 'setPokemonDetails',
                    payload: { pokemonDetailData, pokemonSpeciesData, evolutionData }
                });
            } catch (error) {
                setPokemonDetails({ type: 'setError', payload: error.message });
            }
        };
        load();
    }, [pokeId]);

    if (pokemonDetails.loading) {
        return <HomeContainer><h2>Loading... Please wait</h2></HomeContainer>;
    }

    if (!pokemonDetails?.id) {
        return (
            <HomeContainer>
                <h2>Sorry, we couldn't find {pokeId}. Try your search again</h2>
                <Link to="/collection"><h2>Back to all Pokemon</h2></Link>
            </HomeContainer>
        );
    }

    const pokemonId = pokemonDetails.id;
    const primaryType = pokemonDetails.types?.[0]?.type?.name;
    const typeColor = colorMap[primaryType]?.color ?? '#ffcc00';

    return (
        <>
            {pokemonId > 1 && (
                <PrevPokeButton
                    typecolor={typeColor}
                    onClick={() => navigate(`/collection/${pokemonId - 1}`)}
                    aria-label="Previous Pokémon"
                >
                    <IoMdArrowRoundBack />
                </PrevPokeButton>
            )}
            {pokemonId && (!totalCount || pokemonId < totalCount) && (
                <NextPokeButton
                    typecolor={typeColor}
                    onClick={() => navigate(`/collection/${pokemonId + 1}`)}
                    aria-label="Next Pokémon"
                >
                    <IoMdArrowRoundBack style={{ transform: 'rotateY(180deg)' }} />
                </NextPokeButton>
            )}
            <MoreInfoHeading memoPokemon={pokemonDetails} />
            <MoreInfoBody memoPokemon={pokemonDetails} />
        </>
    );
}

export default MoreInfoLanding;
