import React, {useState, useEffect, useMemo} from "react";
import { PreviousEvoSprite, PreviousEvolutionContainer, PreviousEvolutionName, PreviousEvolutionEvolve } from "./Pokemon.styled";

function PreviousPokemon({cardPokemon, backgroundType, capitalizeFirstLetter}) {
    
        const [species, setSpecies] = useState({
            id: null,
            name: null, 
            sprites: {

            }, 
            evolutionTreeId: null
        });


    async function fetchPreviousPoke() {

        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${cardPokemon.evolutionTree.evolvesFrom.id}/`); //    https://pokeapi.co/api/v2/pokemon-species/16/
            const data = await response.json();
            setSpecies(prev => {
                return {
                    ...prev, 
                    id: data.id,
                    name: data.name,
                    evolutionTreeId: cardPokemon.evolutionTree.id,
                    sprites: {
                        default: data.sprites.front_default, 
                        backShiny: data.sprites.back_shiny, 
                        frontShiny: data.sprites.front_shiny, 
                        backDeault: data.sprites.front_default, 

                    }
                }
            })
        } catch (error) {
            console.log('the error: ', error.message)
        }
    
    }

    useEffect(()=> {
        fetchPreviousPoke();
    }, [])

    const memoizedPreviousDetails = useMemo(() => species, [species]);


    return (
        <PreviousEvolutionContainer backgroundType={backgroundType}>
            <PreviousEvolutionEvolve>
                evolves from: 
            </PreviousEvolutionEvolve>
            <PreviousEvoSprite src={memoizedPreviousDetails.sprites.default}/>
            <PreviousEvolutionName>
                {capitalizeFirstLetter(memoizedPreviousDetails?.name)}
            </PreviousEvolutionName>
        </PreviousEvolutionContainer>
    )
}

export default PreviousPokemon

