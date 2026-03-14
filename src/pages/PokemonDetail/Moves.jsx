import React from "react";
import {FlexColumnContainer, AbilitiesGridContainer,StatsText, AbilitiesFlexContainer} from "./MoreInfo.styled"
import { Title } from "../Home/Home.styled";

function Moves ({memoPokemon}) {
      
    const learnedMoves = [];
    for(let i = 0; i < memoPokemon?.moves?.length; i++) {
        if(memoPokemon?.moves[i]?.version_group_details[0]?.move_learn_method?.name === 'level-up') {
            learnedMoves.push({
                name: memoPokemon.moves[i].move.name, 
                level: memoPokemon.moves[i].version_group_details[0].level_learned_at
            })
        }
    }

    learnedMoves.sort((a, b) => a.level - b.level);
      
return (
    <FlexColumnContainer>
        <Title>Natural Abilities</Title>
        <AbilitiesGridContainer>
            {learnedMoves && learnedMoves.map((move, index) => {
                return (
                    <AbilitiesFlexContainer key={index}>
                         <StatsText><b>{move.name}</b></StatsText> 
                         <i> <small> at level</small></i>
                        <StatsText><b>{move.level}</b> </StatsText>
                    </AbilitiesFlexContainer>
                )
            })}
        </AbilitiesGridContainer>
        
    </FlexColumnContainer>
)

}

export default Moves;