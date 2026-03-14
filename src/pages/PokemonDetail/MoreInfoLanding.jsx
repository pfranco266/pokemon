import React, {useReducer,useMemo, useEffect} from "react";
import { useParams } from "react-router-dom";
import { pokemonReducer, initialPokeDetails } from "../../reducers/pokemonReducer";
import { fetchSinglePokemon, fetchEvolutionData } from "../../api/pokeAPI";
import MoreInfoHeading from "./MoreInfoHeading";
import MoreInfoBody from "./MoreInfoBody"
import { HomeContainer } from "../Home/Home.styled";
import { Link } from "react-router-dom";

function MoreInfoLanding () {
    const params = useParams();
    const pokeId = params?.id; 

    const [pokemonDetails, setPokemonDetails] = useReducer(pokemonReducer, initialPokeDetails);


    useEffect(() => {
        window.scrollTo(0, 0);
      }, [pokeId]);

    
    async function fetchData (pokeId) {
        setPokemonDetails({
            type: 'setLoading', 
        })
        try {
            const {pokemonSpeciesData, pokemonDetailData} = await fetchSinglePokemon(pokeId);
          
            if (pokemonSpeciesData.evolution_chain?.url) {
  
              const evolvesFromUrl = pokemonSpeciesData.evolves_from_species?.url || '';
              const evolutionData = await fetchEvolutionData(pokemonSpeciesData.evolution_chain.url, evolvesFromUrl);
  
              setPokemonDetails({
                  type: 'setPokemonDetails',
                  payload: { pokemonDetailData, pokemonSpeciesData, evolutionData }
              })
            }

  
        } catch (error) {
            setPokemonDetails({
                type: 'setError',
                payload: error.message
            })
        }
}
const memoPokemon = useMemo(() => pokemonDetails, [pokemonDetails]);


    useEffect(()=> {
        fetchData(pokeId);
    },[pokeId])


    console.log(memoPokemon.sprites)
    
    return (
        <>

         {memoPokemon.loading && <h2>Loading... Please wait</h2>  }
        

        {!memoPokemon?.id ? <HomeContainer>
            <h2>
            Sorry, we couldn't find {pokeId}. Try your search again
            </h2>
            <Link to="/collection">
            <h2>
            Back to all Pokemon
            </h2>
            </Link>
        </HomeContainer> : 
        <>
        <MoreInfoHeading memoPokemon={memoPokemon} />
        <MoreInfoBody memoPokemon={memoPokemon}/>
        </>
        }
        
        
        </>
    )
}

export default MoreInfoLanding;

