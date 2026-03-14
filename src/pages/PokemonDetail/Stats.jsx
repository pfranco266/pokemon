import React from "react";
import { FlexColumnContainer } from "./MoreInfo.styled";
import { Title } from "../Home/Home.styled";
import { StatsGridContainer, StatsFlexContainer, StatsText, AttackIcon, DefenseIcon, SpecialAttackIcon, SpecialDefenseIcon, HealthIcon, SpeedIcon } from "./MoreInfo.styled";








function Stats({ memoPokemon }) {
    return (
        <FlexColumnContainer>
            <Title>{memoPokemon.name} Stats</Title>
            <StatsGridContainer>
                <StatsFlexContainer>
                    <StatsText>HP</StatsText>
                    <HealthIcon />
                    <StatsText>{memoPokemon.stats.hp}</StatsText>
                </StatsFlexContainer>
                <StatsFlexContainer>
                    <StatsText>Attack</StatsText>
                    <AttackIcon />
                    <StatsText>{memoPokemon.stats.attack}</StatsText>
                </StatsFlexContainer>
                <StatsFlexContainer>
                    <StatsText>Defense</StatsText>
                    <DefenseIcon />
                    <StatsText>{memoPokemon.stats.defense}</StatsText>
                </StatsFlexContainer>
                <StatsFlexContainer>
                    <StatsText>Special Attack</StatsText>
                    <SpecialAttackIcon />
                    <StatsText>{memoPokemon.stats.specialAttack}</StatsText>
                </StatsFlexContainer>
                <StatsFlexContainer>
                    <StatsText>Special Defense</StatsText>
                    <SpecialDefenseIcon />
                    <StatsText>{memoPokemon.stats.specialDefense}</StatsText>
                </StatsFlexContainer>
                <StatsFlexContainer>
                    <StatsText>Speed</StatsText>
                    <SpeedIcon />
                    <StatsText>{memoPokemon.stats.speed}</StatsText>
                </StatsFlexContainer>

            </StatsGridContainer>
        </FlexColumnContainer>
    )
}

export default Stats;