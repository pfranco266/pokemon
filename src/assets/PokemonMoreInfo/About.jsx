import React, {useState} from "react";
import { FlexColumnContainer, PrevButton, MoreInfoSubtitle,  NextButton, AboutInfoContainer, AboutImgTitle, AboutImgContainer, AboutTextContainer } from "./MoreInfo.styled";
import { AboutSVG } from "./MoreInfo.styled"



function About({ memoPokemon }) {
    const [pictureNumber, setPictureNumber] = useState(5)


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
                About {memoPokemon.name}
            </MoreInfoSubtitle>
            <AboutInfoContainer>
                <AboutImgContainer>
                    <AboutImgTitle>{memoPokemon?.sprites[pictureNumber]?.description}</AboutImgTitle>
                    <PrevButton onClick={handlePrev}/>
                    <NextButton onClick={handleNext}/>
                    <AboutSVG src={memoPokemon?.sprites[pictureNumber]?.picture} alt={memoPokemon.name} />
                </AboutImgContainer>
                <AboutTextContainer>
                    <ul>
                        <li>
                        {memoPokemon.description}

                        </li>
                        <br></br>
                        <li>
                        {memoPokemon.description2}

                        </li>
                        <br></br>

                        <li>
                        {memoPokemon.description3}

                        </li>
                    </ul>

                </AboutTextContainer>

            </AboutInfoContainer>
        </FlexColumnContainer>
    )
}

export default About