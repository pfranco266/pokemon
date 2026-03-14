import React from "react";
import {EvolutionChainSVG, EvolutionGridContainer, EvolutionItem, EvolutionName, EvolutionOuterContainer} from "./MoreInfo.styled"
import SinglePokeCard from "../Collection/SinglePokeCard";

function Evolution({  memoPokemon }) {


   

    return (
       <EvolutionGridContainer count={memoPokemon?.evolutions?.length}>
        
            {memoPokemon && memoPokemon?.evolutions?.map((poke, index) => {
                return (
                   
                        <SinglePokeCard key={poke.id} index={poke.id}/>
                 
                )
            })}
         
       </EvolutionGridContainer>
    )
}

export default Evolution;
