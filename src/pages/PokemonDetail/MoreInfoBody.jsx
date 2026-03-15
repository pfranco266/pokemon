import React from "react";
import {BodyContainer, FlexColumnContainer } from "./MoreInfo.styled"
import Evolution from "./Evolution";
import About from "./About"
import Stats from "./Stats";
import Moves from "./Moves"
import PokemonAbilities from "./PokemonAbilities"

function MoreInfoBody ({memoPokemon}) {

    return (
        <BodyContainer>
           <FlexColumnContainer>
                <About memoPokemon={memoPokemon}/>
                <Stats memoPokemon={memoPokemon}/>
                <Moves memoPokemon={memoPokemon}/>
                <PokemonAbilities memoPokemon={memoPokemon}/>
                <Evolution memoPokemon={memoPokemon}/>
            </FlexColumnContainer>
        </BodyContainer>
    )
}

export default MoreInfoBody