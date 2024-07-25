import React from "react";
import { Title, Pikachu,  LandingBodyContainer, Text, TextContainer, Pokemonlogo  } from "./Home.styled";
import pokemon from "../../../public/pokemon-23.svg";
import pikachu from "../../../public/3.svg"



function Home () {
    return (
       <LandingBodyContainer>
        <Title><Pokemonlogo src={pokemon} alt="Pokemon Logo" /></Title>

        <TextContainer>
        <Text>Thanks for visiting my pokemon card collection. I am not affiliated with The Pokemon Company, 
            items are not actually for sale, and any Pokemon information/collection are not my properties. Enjoy! </Text>
        <Pikachu src={pikachu} alt="Pokemon Logo" />

        </TextContainer>


       </LandingBodyContainer>
    )
}

export default Home;

