import React, {useEffect, useState} from "react";
import { capitalizeFirstLetter } from "../../utils/stringUtils";
import { Heading, HeaderTitleContainer, LandingSVG, PokemonTitle, PokeNumber, HeadingContainer, BackButton, MythicalBanner, LegendaryBanner } from "./MoreInfo.styled";
import { IoMdArrowRoundBack } from "react-icons/io";



function MoreInfoHeading({ memoPokemon }) {
const [isMythical, setIsMythical] = useState(false);
const [isLegendary, setIsLegendary] = useState(false);

useEffect(() => {
    if (memoPokemon.mythical) {
        setIsMythical(true);
    } else {
        setIsMythical(false);
    }

    if (memoPokemon.legendary) {
        setIsLegendary(true);
    } else {
        setIsLegendary(false);
    }
}, [memoPokemon.legendary, memoPokemon.mythical]);

return (
    <Heading type={memoPokemon?.types[0]?.type?.name}>
        <HeadingContainer>
            <BackButton to="/pokemon">
                <IoMdArrowRoundBack />
            </BackButton>
            <HeaderTitleContainer>
                {isMythical && <MythicalBanner mythical={isMythical} type={memoPokemon?.types[0]?.type?.name}>Mythical</MythicalBanner>}
                {isLegendary && <LegendaryBanner legendary={isLegendary} type={memoPokemon?.types[0]?.type?.name}>Legendary</LegendaryBanner>}
                <PokeNumber>
                    #{memoPokemon.id}
                </PokeNumber>
                <PokemonTitle>
                    {capitalizeFirstLetter(memoPokemon.name)}
                </PokemonTitle>
            </HeaderTitleContainer>
            <LandingSVG
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${memoPokemon.id}.svg`}
                alt={memoPokemon.name}
                onError={(e) => {
                    e.currentTarget.onError = null;
                    e.currentTarget.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${memoPokemon.id}.png`;
                }}
            />
        </HeadingContainer>
    </Heading>
);
}
export default MoreInfoHeading;
