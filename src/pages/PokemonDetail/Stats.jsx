import React from "react";
import { FlexColumnContainer, TBSContainer, TBSLabel, TBSValue, TBSBarRow, TBSBarTrack, TBSBarFill, TBSTierLabel, StatsGridContainer, StatsFlexContainer, StatsText, AttackIcon, DefenseIcon, SpecialAttackIcon, SpecialDefenseIcon, HealthIcon, SpeedIcon } from "./MoreInfo.styled";
import { Title } from "../Home/Home.styled";
import colorMap from "../../utils/colorMap";

const TBS_MAX = 800;

function getTier(tbs) {
    if (tbs <= 250) return { label: 'Approachable',      color: '#757575' };
    if (tbs <= 330) return { label: 'Beginner Friendly', color: '#78909c' };
    if (tbs <= 420) return { label: 'Moderate',          color: '#66bb6a' };
    if (tbs <= 500) return { label: 'Intermediate',      color: '#29b6f6' };
    if (tbs <= 580) return { label: 'Advanced',          color: '#ab47bc' };
    if (tbs <= 699) return { label: 'Expert',            color: '#ff7043' };
    return             { label: 'Untouchable',           color: '#ffffff' };
}

function Stats({ memoPokemon }) {
    const { hp, attack, defense, specialAttack, specialDefense, speed } = memoPokemon.stats;
    const tbs = hp + attack + defense + specialAttack + specialDefense + speed;
    const tier = getTier(tbs);
    const pct = Math.min(Math.round((tbs / TBS_MAX) * 100), 100);
    const primaryType = memoPokemon.types?.[0]?.type?.name;
    const barColor = colorMap[primaryType]?.color ?? tier.color;
    const exceptional = tier.label === 'Untouchable';
    const glowColor = exceptional ? 'rgba(255,255,255,0.6)' : barColor;

    return (
        <FlexColumnContainer>
            <Title>{memoPokemon.name} Stats</Title>

            <TBSContainer>
                <TBSLabel>Base Stat Total</TBSLabel>
                <TBSValue tiercolor={barColor} exceptional={exceptional} glowcolor={glowColor}>{tbs}</TBSValue>
                <TBSTierLabel tiercolor={tier.color} exceptional={exceptional}>{tier.label}</TBSTierLabel>
                <TBSBarTrack>
                    <TBSBarFill pct={pct} tiercolor={barColor} />
                </TBSBarTrack>
            </TBSContainer>

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
    );
}

export default Stats;
