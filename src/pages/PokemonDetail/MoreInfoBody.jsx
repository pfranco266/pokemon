import React from "react";
import {BodyContainer, FlexColumnContainer } from "./MoreInfo.styled"
import Evolution from "./Evolution";
import About from "./About"
import { Title } from "../Home/Home.styled";
import Stats from "./Stats";
import Moves from "./Moves"

function MoreInfoBody ({memoPokemon}) {



    return (
        <BodyContainer>
           <FlexColumnContainer>
                <About memoPokemon={memoPokemon}/>
                <Stats memoPokemon={memoPokemon}/>
                <Moves memoPokemon={memoPokemon}/>
                <Title>Evolutions</Title>

                <Evolution memoPokemon={memoPokemon}/>
               
            </FlexColumnContainer>
        </BodyContainer>
    )
}

export default MoreInfoBody