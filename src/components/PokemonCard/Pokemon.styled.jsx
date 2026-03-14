import styled from "styled-components";
import colorMap from '../../utils/colorMap';
import { SearchButton } from "../../pages/Collection/Search/Search.styled";



export const PokemonGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 300px); 
  grid-auto-rows: minmax(500px, auto); 

  gap: 30px;
  justify-content: center; 
  @media(max-width: 1350px) {
    grid-template-columns: repeat(3, 300px);
  }
  @media(max-width: 1000px) {
    grid-template-columns: repeat(2, 300px);
  }
  @media(max-width: 700px) {
    grid-template-columns: repeat(1, 300px);
  }
`;

export const PokeContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 2em 0;
  flex-direction: column;
  align-items: center;
  position: relative;
`

export const IndividualPokeContainer = styled.div`
display: flex;
width: 100%;
height: 100%;
flex-direction: column;
align-items: center;
position: relative;
background: ${({ color1, color2 }) => {
  const firstColor = colorMap[color1]?.color || '#f1f1f1';
  const secondColor = color2 === undefined ? '#f6f6f6' : colorMap[color2]?.color ; 
  return color2 !== '#f1f1f1' ? `linear-gradient(${secondColor}, ${firstColor})` : `linear-gradient(#e66465, ${firstColor})`;
}};

`

export const PokemonGridItem = styled.div`

    border: 1px solid #ccc;
    height: 375px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: top;
    color: #333;
    border-radius: 8px;
    border: 10px solid gold;
    background-color: white;

  
`

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`




export const HitPoints = styled.div`
  position: absolute;
  right: 1%;
  top: 0%;
`

export const Name = styled.div`
  display: flex;
  font-size: 14px;
  font-weight: 700;
  color: black;
`

export const SpriteContainer = styled.div`
  display: flex; 
  justify-content: center;
  width: 65%;
  height: 45%;
  border: 5px solid gold;
  background-color: #f6f6f6;
  box-shadow: 2px 2px 4px black;
  background-color: black;

`

export const Sprite = styled.img`
  border: 1px solid silver;
  width: 100%;
`

export const InfoContainer = styled.div`
display: inline;
`


export const PokeType = styled.div`
  background-color: ${({ type }) => {
    return colorMap[type]?.color;
  }};
  font-size: 9px;
  display: inline-block;
`;


export const PokeHeightWeight = styled.span`
  font-size: 8px;
`

export const PreviousEvoSprite = styled.img`
  width: 60px;
  height: 60px;
`

export const PreviousEvolutionContainer = styled.div`
  display: flex; 
  flex-direction: column;
  align-items: center;

  width: 18%;
  height: 18%;
  top: 5%;
  left: 1%;
  position: absolute;
  border: 2px solid gold;
  background-color: ${({ backgroundType }) =>
  colorMap[backgroundType?.[1]?.type?.name] ? colorMap[backgroundType?.[0]?.type?.name].color : colorMap.normal.color};
`
export const PreviousEvolutionEvolve = styled.span`

  font-size: 8px;
  position: absolute;
  left: 0%;
  top: -25%;
  text-wrap: nowrap;

  `

export const MovesContainer = styled.div`
  display: flex;
  flex-direction: column;
  
`
export const PreviousEvolutionName = styled.span`
  font-size: 9px;
  position: absolute;
  left: 50%;
  bottom: 3%;
  white-space: nowrap;
  transform: translateX(-50%);
`;
export const PokemonDescriptionContainer = styled.div`
  display: flex;
  width: 80%;
  height: auto;

  border-bottom: 2px solid black;
`

export const PokemonDescription = styled.p`
font-size: 9px;
padding: 5px 0;

`

export const PokemonMoveContainer = styled.div`
display: flex;
width: 90%;
height: auto;
justify-content: space-between;  // Corrected to apply space between items
border-bottom: 2px solid black;
padding-bottom: 1px;
`

export const ElementContainer = styled.div`
  display: flex;
  justify-content: space-evenly; 
  align-items: center; 
  height: auto;
  width: 100%;
  position: absolute; 
  bottom: 1%;
  align-items: flex-start;
`;


export const WeaknessContainer = styled.span`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 70px;
  width: 33%;  
  border-right: 1px solid black;
`;

export const ResistanceContainer = styled.span`
  display: flex;
  height: 70px;

  flex-direction: column;
  align-items: center;

  width: 33%;
  border-right: 1px solid black;


`;

export const GenerationContainer = styled.span`
  display: flex;
  flex-direction: column;
  align-items: center;

  height: auto;
  width: 33%;
`;


export const ResistanceDescription = styled.p`
  height: auto;
  font-size: 10px;
  padding-bottom: 5px;
`



export const GenerationDescription = styled.p`
height: auto;
font-size: 20px;
`


export const AddToCart = styled.button`
padding: 8px 16px;
margin-top: 10px;  // Ensures it is visually separated from the card
background-color: blue;
color: white;
border: none;
cursor: pointer;
transition: transform .3s, box-shadow .2s;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 1px 2px 2px gold;
    cursor: pointer;
    // Apply a downward movement to the entire button
    
  }
  &:active {
    transform: translateY(2px);
    box-shadow: .5px 2px 2px #05d5c4;
    color: #D5C405;
    cursor: pointer;    
  }
`


export const GridItems = styled.div`
display: flex;
flex-direction: column;
`


export const Price = styled.div`
position: relative;
  font-size: 1rem;
  text-align: center;
`

export const AddToCartNotification = styled.span`
  position: absolute;
  bottom: -5%;
  background-color: khaki;
  color: black;
  border-radius: 10px;
`


export const AddtoCartButton = styled(SearchButton)`
margin-left: 0;
  transition: box-shadow 0.1s ease-in-out, transform 0.1s ease-in-out;
  
&:hover{
box-shadow: 0px 5px 5px  #ffcc00;

}
&:active{
box-shadow: none;
    transform: scale(0.95);


}
`