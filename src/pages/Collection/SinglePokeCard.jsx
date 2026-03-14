import React, {useEffect, useReducer, useMemo, isValidElement} from "react";
import { fetchSinglePokemon, fetchEvolutionData } from "../../api/pokeAPI";
import { pokemonReducer, initialPokeDetails } from "../../reducers/pokemonReducer";
import {PokemonSVG, SinglePokemonContainer, PokemonName, PokemonIndex} from "./Browse.styled"
import PokemonTypes from "./PokemonTypes"
import Pokeball from "../../components/Pokeball/Pokeball";
import { BsWrenchAdjustableCircleFill } from "react-icons/bs";



function SinglePokeCard({ index, selectedOption=""}) {

const [pokemonDetails, setPokemonDetails] = useReducer(pokemonReducer, initialPokeDetails);



    async function fetchData (index) {
            setPokemonDetails({
                type: 'setLoading', 
            })
            try {
                const {pokemonSpeciesData, pokemonDetailData} = await fetchSinglePokemon(index);

                if (pokemonSpeciesData?.evolution_chain?.url) {
                    
                  const evolvesFromUrl = pokemonSpeciesData.evolves_from_species?.url || '';

                  const evolutionData = await fetchEvolutionData(pokemonSpeciesData.evolution_chain.url, evolvesFromUrl);
                //   console.log(index, pokemonDetailData.name, evolutionData)


      
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


    useEffect(() => {
        fetchData(index);
    if(selectedOption == memoPokemon?.types[0?.type?.name]) {
            console.log('TRUTE DAT', selectedOption, memoPokemon?.types[0]?.type?.name)

    }
    }, [selectedOption])

 
    const memoPokemon = useMemo(() => pokemonDetails, [pokemonDetails]);

 

    if(selectedOption === memoPokemon?.types[0]?.type?.name) {
        return (    

            <SinglePokemonContainer to={`/collection/${memoPokemon?.id}`} type={memoPokemon?.types[0]?.type?.name}>
            <PokemonIndex> #{memoPokemon?.id}</PokemonIndex> <PokemonName> {memoPokemon.name}</PokemonName>
    
            
            
                 <PokemonTypes  types={memoPokemon?.types}/>
                 <Pokeball/>
          
    
             <PokemonSVG src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${index}.svg`} alt={memoPokemon.name} />
    
         </SinglePokemonContainer>
            
      
          
        )
    } if(selectedOption === '') {
        
    return (
        <SinglePokemonContainer to={`/collection/${memoPokemon?.id}`} type={memoPokemon?.types[0]?.type?.name}>
        <PokemonIndex> #{memoPokemon?.id}</PokemonIndex> <PokemonName> {memoPokemon.name}</PokemonName>

        
        
             <PokemonTypes  types={memoPokemon?.types}/>
             <Pokeball/>
      

         <PokemonSVG src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${index}.svg`} alt={memoPokemon.name} />

     </SinglePokemonContainer>
    )
        
    } else {
        return null
    }

   
}

export default SinglePokeCard;






