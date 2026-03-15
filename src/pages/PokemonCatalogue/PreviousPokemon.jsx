import React, {useState, useEffect} from "react";
import { PreviousEvoSprite, PreviousEvolutionContainer, PreviousEvolutionName, PreviousEvolutionEvolve } from "../../components/PokemonCard/Pokemon.styled";

function PreviousPokemon({cardPokemon, backgroundType, capitalizeFirstLetter}) {
    const evolvesFrom = cardPokemon.evolutionTree?.evolvesFrom;

    const [species, setSpecies] = useState({
        id: null,
        name: null,
        sprites: {},
    });

    useEffect(() => {
        if (!evolvesFrom?.id) return;
        fetch(`https://pokeapi.co/api/v2/pokemon/${evolvesFrom.id}/`)
            .then(res => res.json())
            .then(data => setSpecies({
                id: data.id,
                name: data.name,
                sprites: { default: data.sprites.front_default },
            }))
            .catch(error => console.log('the error: ', error.message));
    }, [evolvesFrom?.id]);

    return (
        <PreviousEvolutionContainer backgroundType={backgroundType} to={`/collection/${species.id || evolvesFrom?.id}`}>
            <PreviousEvolutionEvolve>
                evolves from:
            </PreviousEvolutionEvolve>
            <PreviousEvoSprite src={species.sprites.default}/>
            <PreviousEvolutionName>
                {capitalizeFirstLetter(species?.name || evolvesFrom?.name)}
            </PreviousEvolutionName>
        </PreviousEvolutionContainer>
    )
}

export default PreviousPokemon
