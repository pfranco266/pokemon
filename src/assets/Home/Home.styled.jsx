import styled from "styled-components";
import { LandingSVG } from "../PokemonMoreInfo/MoreInfo.styled";

export const Title = styled.h1`
text-align: center;
font-size: 2em; 
color: rgba(255, 255, 255, 0.87);
text-transform: capitalize;
@media(max-width: 600px) {
    margin: '20px 0'
}


`

export const HomeContainer = styled.div`
display: flex;
flex-direction: column;
align-items: center;
position: relative;

justify-content: center;
@media(max-width: 600px) {
    margin-bottom: 5vh;
}
`

export const LandingBodyContainer = styled.div`
display: flex;
flex-direction: column;
align-items: center;
position: relative;
min-height: 85vh;
justify-content: start;
@media(max-width: 600px) {
    margin-bottom: 5vh;
}
`




export const PokemonCatalog = styled.section`
 
    
`

export const Text = styled.p`
    font-size: 2em;
    align-self: end;
 @media(max-width: 1040px) {
            font-size: 1.5em;

    }

`
export const TextContainer = styled.div`
    display: flex;
    width: 70%;
    height: 60%;
    @media(max-width: 1040px) {
        flex-direction: column;
    }
`
export const Pokemonlogo = styled.img`
    width: 8em; 
    height: 6em;
`


export const Pikachu = styled.img`
width: 100%;
height: 20em;

`