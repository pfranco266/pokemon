import React, { useReducer, useEffect } from "react";
import { useParams } from "react-router-dom";
import { pokemonReducer, initialPokeDetails } from "../../reducers/pokemonReducer";
import { usePokemonCache } from "../../context/PokemonCacheContext";
import MoreInfoHeading from "./MoreInfoHeading";
import MoreInfoBody from "./MoreInfoBody";
import { HomeContainer } from "../Home/Home.styled";
import { Link } from "react-router-dom";

function MoreInfoLanding() {
    const params = useParams();
    const pokeId = params?.id;
    const { fetchPokemonDetail } = usePokemonCache();

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

    return (
        <>
            <MoreInfoHeading memoPokemon={pokemonDetails} />
            <MoreInfoBody memoPokemon={pokemonDetails} />
        </>
    );
}

export default MoreInfoLanding;
