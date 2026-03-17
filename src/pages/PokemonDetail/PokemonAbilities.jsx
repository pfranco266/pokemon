import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { capitalizeFirstLetter } from '../../utils/stringUtils';
import { FlexColumnContainer, AccordionToggle, AccordionChevron, AccordionContent } from './MoreInfo.styled';

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

const AbilityList = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.75em;
    justify-content: center;
    padding: 0.5em 0 1em;
`;

const AbilityLink = styled(Link)`
    color: #ffcc00;
    font-size: 1.1rem;
    font-weight: bold;
    text-decoration: none;
    text-transform: capitalize;
    transition: text-shadow 0.15s ease, color 0.15s ease;

    &:hover {
        color: #ffffff;
        text-shadow: 0 0 12px rgba(255, 204, 0, 0.8);
    }
`;

const HiddenBadge = styled.span`
    font-size: 0.7rem;
    font-weight: normal;
    color: rgba(255, 255, 255, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    padding: 0.1em 0.4em;
    margin-left: 0.4em;
    vertical-align: middle;
    text-transform: uppercase;
    letter-spacing: 0.04em;
`;

const AbilityItem = styled.div`
    display: flex;
    align-items: center;
`;

const AccordionRow = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75em;
    margin-top: 0.25em;
`;

const AccordionLabel = styled.span`
    color: rgba(255, 255, 255, 0.55);
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-family: 'Russo One', sans-serif;
`;

function PokemonAbilities({ memoPokemon }) {
    const [expanded, setExpanded] = useState(false);
    const abilities = memoPokemon.abilities;
    if (!abilities || abilities.length === 0) return null;

    const standardAbilities = abilities.filter(a => !a.isHidden);
    const hiddenAbilities = abilities.filter(a => a.isHidden);

    return (
        <FlexColumnContainer>
            <TitleLink to="/abilities">Abilities</TitleLink>
            <AbilityList>
                {standardAbilities.map(a => (
                    <AbilityItem key={a.name}>
                        <AbilityLink to={`/abilities/${a.name}`}>
                            {capitalizeFirstLetter(a.name.replace(/-/g, ' '))}
                        </AbilityLink>
                    </AbilityItem>
                ))}
            </AbilityList>
            {hiddenAbilities.length > 0 && (
                <>
                    <AccordionRow>
                        <AccordionLabel>Hidden &amp; Learned Abilities</AccordionLabel>
                        <AccordionToggle
                            onClick={() => setExpanded(e => !e)}
                            aria-label={expanded ? 'Collapse hidden abilities' : 'Expand hidden abilities'}
                        >
                            <AccordionChevron isopen={expanded} />
                        </AccordionToggle>
                    </AccordionRow>
                    <AccordionContent isopen={expanded}>
                        <AbilityList>
                            {hiddenAbilities.map(a => (
                                <AbilityItem key={a.name}>
                                    <AbilityLink to={`/abilities/${a.name}`}>
                                        {capitalizeFirstLetter(a.name.replace(/-/g, ' '))}
                                    </AbilityLink>
                                    <HiddenBadge>Hidden</HiddenBadge>
                                </AbilityItem>
                            ))}
                        </AbilityList>
                    </AccordionContent>
                </>
            )}
        </FlexColumnContainer>
    );
}

export default PokemonAbilities;
