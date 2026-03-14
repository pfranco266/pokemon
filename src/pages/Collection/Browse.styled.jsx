import styled from "styled-components";
import { colors } from "../../utils/theme";
import { HomeContainer } from "../Home/Home.styled";
import colorMap from "../../utils/colorMap";
import { keyframes } from 'styled-components';
import { Link } from "react-router-dom";
import { MdClear } from "react-icons/md";



const rotatePokeball = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg); 
  }
`;

export const PokeballSVG = styled.img`
  opacity: 0.15;
  width: 250px;
  height: 250px;
  position: absolute;
  color: #f6f6f6;
  z-index: 1;
`;



export const OuterBrowseContainer = styled(HomeContainer)`
  flex-direction: column;
  margin: 2em 0;
  @media(min-width: 700px) {
    margin: 1em 0;

  }
`

export const BrowseContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 400px);  
  grid-auto-rows: minmax(300px, auto); 
  justify-content: center; 
  margin-bottom: 5rem;
  @media(min-width: 360px) {
    grid-template-columns: repeat(1, 350px);
    gap: 75px;
  }
  @media(min-width: 700px) {
    grid-template-columns: repeat(1, 400px);
    gap: 75px;
  }

  @media(min-width: 1000px) {
    grid-template-columns: repeat(2, 400px);
  }

  @media(min-width: 1350px) {
    grid-template-columns: repeat(3, 400px);
  }
`;

export const PokemonSVG = styled.img`
height: 12em;
width: 12em;

position: absolute;
z-index: 2;
bottom: 5%;
right: 5%;
// border-radius: 50%;
// padding: 100px;
transition: transform 0.4s ease; 


`

export const SinglePokemonContainer = styled(Link)`
  position: relative;
  cursor: pointer;
  border: 3px solid yellow;
  border-radius: 20px;
  z-index: 1;
  color: inherit; // not link color
  background-color: ${({ type }) => {
    return colorMap[type]?.color
  }};

  &:hover ${PokeballSVG}{
    animation: ${rotatePokeball} 10s infinite linear;  
    opacity: .5;

  }
  &:hover ${PokemonSVG}{
    transform: scale(1.2); 
  }
  &:hover {
    box-shadow: 0px 5px 10px ${({ type }) => {
      return colorMap[type]?.color
    }};
  }
  &::after {
    content: '';
    width: 100%;
    height: 15%;
    background-color: #5C4033;
    position: absolute;
    bottom: 0%;
    box-shadow: inset 0px 5px 10px rgba(0, 0, 0, 0.5); /* Inner shadow for texture */
    border-bottom-right-radius: 20px;
    border-bottom-left-radius: 20px;
    z-index: 1;
    

  }



`


export const PokemonName = styled.h1`
  position: absolute;
  font-weight: 900;
  top: 3%;
  left: 50%;
  transform: translateX(-50%);
  text-transform: capitalize;
  font-size: 2em;
  z-index: 2;
`;


export const PokemonIndex = styled.h1`
position: absolute;
z-index: 2;
opacity: .5;
top: 2%;
left: 5%;
`


export const TypesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: baseline;
  position: absolute;
  bottom: 30%;
  left: 5%;
  gap: 1rem;

`

export const Types = styled.h2`
text-transform: capitalize;
z-index: 2;
background-color: ${({ type }) => {
  return colorMap[type]?.darkerColor
}};
padding: .25rem .5rem;

`

export const PokeballContainer = styled.div`
display:flex;
width: 100%;
height: 100%;
justify-content:center;
align-items:center;


`

export const ClearButton = styled.button`
  background: none;
  border: none;
  padding: 0;

  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  &:focus {
    outline: none;
  }
`;

export const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`


export const StyledMdClear = styled(MdClear)`
  color: white;
  width: 2em;
  height: 2em;

`;

export const SearchFilterContainer = styled.div`
width: 1350px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  padding: 2em;
  @media(max-width: 1350px) {
    width: 875px;
    align-items: flex-start;

  }

  @media(max-width: 1000px) {
    width: 600px;

  }

  @media(max-width: 700px) {
    width: 400px;
    padding: 2em 0;

  }
`

export const StyledLabel = styled.label`
  font-size: 1.5em;
  @media(max-width: 1350px) {

    display: none;
  }
  @media(max-width: 768px) {
    font-size: 1em;
    flex: 1;
    display: none;
  }

`


export const StyledSelect = styled.select`
padding: 10px;
border: 4px solid ${colors.formBorder};
border-radius: 5px;
font-size: 16px;
outline: none;
margin-top: .5em;
transition: border-color 0.3s ease;


&:focus {
  border-color: #007bff;
}
&:hover{
  cursor: pointer;
}
@media(max-width: 1350px) {

  margin-top: 0;

}

@media(max-width: 768px) {
  font-size: 14px;
  flex: 1;
  margin-top: 0;

}
`


export const DropdownButtonContainer = styled.div`
  display: flex; 
  justify-content: space-around;


@media(max-width: 768px) {
  flex-direction: column;
  gap: 5px;

}
`


export const FilterPokemonOuterContainer = styled(HomeContainer)`
margin-bottom: 0;
display: flex;
align-items: start;
@media(max-width: 768px) {
  margin-bottom: 2.5vh;


}

`