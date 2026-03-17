import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {FlexColumnContainer, AbilitiesGridContainer,StatsText, AbilitiesFlexContainer} from "./MoreInfo.styled"

const TitleLink = styled(Link)`
    display: block;
    font-family: 'Russo One', sans-serif;
    text-align: center;
    font-size: 1.8rem;
    color: #ffffff;
    text-transform: capitalize;
    text-decoration: none;
    margin: 0 0 1rem;
    cursor: pointer;
    transition: text-shadow 0.15s ease;

    &:hover {
        text-shadow: 0 0 12px rgba(255, 204, 0, 0.8);
    }
`;

const MoveLink = styled(Link)`
    color: #ffcc00;
    text-decoration: none;
    font-weight: bold;
    transition: text-shadow 0.15s ease, color 0.15s ease;

    &:hover {
        color: #ffffff;
        text-shadow: 0 0 12px rgba(255, 204, 0, 0.8);
    }
`;

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
        <TitleLink to="/moves">Moves</TitleLink>
        <AbilitiesGridContainer>
            {learnedMoves && learnedMoves.map((move, index) => {
                return (
                    <AbilitiesFlexContainer key={index}>
                        <StatsText><b><MoveLink to={`/moves/${move.name}`}>{move.name}</MoveLink></b></StatsText>
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