import React, {useState} from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { capitalizeFirstLetter } from "../../utils/stringUtils";
import { FlexColumnContainer, PrevButton, MoreInfoSubtitle, NextButton, AboutInfoContainer, AboutImgTitle, AboutImgContainer, AboutTextContainer, HabitatBanner, TypeBadgesRow, TypeBadge } from "./MoreInfo.styled";
import { AboutSVG } from "./MoreInfo.styled";
import colorMap from "../../utils/colorMap";

const TypeBadgeLink = styled(Link)`
    text-decoration: none;
    display: inline-block;
    cursor: pointer;
    transition: transform 0.15s ease, filter 0.15s ease;

    &:hover {
        transform: scale(1.05);
        filter: brightness(1.3);
    }
`;



function About({ memoPokemon }) {
    const [pictureNumber, setPictureNumber] = useState(5);
    const primaryType = memoPokemon.types?.[0]?.type?.name;
    const typeColor = colorMap[primaryType]?.color ?? '#555';
    const darkerColor = colorMap[primaryType]?.darkerColor ?? '#666';


    function handleNext() {
        if(pictureNumber < memoPokemon.sprites.length -1) {
            // console.log( memoPokemon.sprites)
            setPictureNumber(prev => prev + 1)
        }
        else {
            setPictureNumber(prev => prev = 0)
        }
    }

    function handlePrev() {
        if(pictureNumber > 0) {
        

            setPictureNumber(prev => prev - 1)
        }
        else {
            setPictureNumber(prev => memoPokemon.sprites?.length -1)
        }
    }


    if (!memoPokemon || !memoPokemon.sprites) {
        return <div>Loading...</div>; 
    }



    return (
        <FlexColumnContainer>
            <MoreInfoSubtitle>
                About {capitalizeFirstLetter(memoPokemon.name)}
            </MoreInfoSubtitle>
            <TypeBadgesRow>
                {(memoPokemon.types ?? []).map(t => {
                    const typeName = t?.type?.name;
                    const typeColor = colorMap[typeName]?.color ?? null;
                    return (
                        <TypeBadgeLink key={typeName} to={`/types/${typeName}`}>
                            <TypeBadge typecolor={typeColor}>
                                {capitalizeFirstLetter(typeName)}
                            </TypeBadge>
                        </TypeBadgeLink>
                    );
                })}
            </TypeBadgesRow>
            <HabitatBanner typecolor={memoPokemon.habitat ? typeColor : null} darkercolor={memoPokemon.habitat ? darkerColor : null}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="white" aria-hidden="true" style={{ flexShrink: 0 }}>
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                {capitalizeFirstLetter(memoPokemon.habitat) || 'Unknown Habitat'}
            </HabitatBanner>
            <AboutInfoContainer>
                <AboutImgContainer>
                    <AboutImgTitle>{memoPokemon?.sprites[pictureNumber]?.description}</AboutImgTitle>
                    <PrevButton onClick={handlePrev}/>
                    <NextButton onClick={handleNext}/>
                    <AboutSVG src={memoPokemon?.sprites[pictureNumber]?.picture} alt={memoPokemon.name} />
                </AboutImgContainer>
                <AboutTextContainer>
                    <ul>
                        <li>{memoPokemon.description}</li>
                        {memoPokemon.description2 && (
                            <>
                                <br />
                                <li>{memoPokemon.description2}</li>
                            </>
                        )}
                        {memoPokemon.description3 && (
                            <>
                                <br />
                                <li>{memoPokemon.description3}</li>
                            </>
                        )}
                    </ul>
                </AboutTextContainer>

            </AboutInfoContainer>
        </FlexColumnContainer>
    )
}

export default About