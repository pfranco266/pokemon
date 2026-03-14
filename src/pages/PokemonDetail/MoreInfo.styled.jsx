import colorMap from "../../utils/colorMap";
import { Link } from 'react-router-dom';
import { LuSword } from "react-icons/lu";
import { PiShieldPlusDuotone } from "react-icons/pi";
import { LuSwords } from "react-icons/lu";
import { GiMagicShield } from "react-icons/gi";
import { MdOutlineSpeed } from "react-icons/md";
import { GiHealthIncrease } from "react-icons/gi";
import { IoMdArrowRoundBack } from "react-icons/io";
import styled, { keyframes } from 'styled-components';
import {Title} from "../Home/Home.styled"


export const OpenPokeballImage = styled.img`
display: none;
    width: 5em; 
    height: 7em;
    transform: rotate(-90deg)
`


export const Heading = styled.header`
  height: 50vh;
  width: 100%;
  position: relative;

  border-bottom-left-radius: 40px;
  border-bottom-right-radius: 40px;
  background-color: ${({ type }) => colorMap[type]?.color};

  @media (max-width: 1068px) {
    height: 40vh;
  }
  @media (max-width: 768px) {
    height: 35vh;
  }
  @media (max-width: 512px) {
    height: 30vh;
  }
`;

export const HeadingContainer = styled.div`
  display: flex;
  justify-content: space-evenly; 
  align-items: flex-end; 
  position: relative;
  height: 100%;

`;

export const HeaderTitleContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 2em 0;
  height: 100%; 

  @media (max-width: 1068px) {
    justify-content: space-evenly;
    margin-left: 0%;
  }

  @media (max-width: 768px) {
    margin-left: 5%;
    padding: 1.5em 0;
  }

  @media (min-width: 400px) {
    padding: 1em 0;
  }
`;

export const PokemonTitle = styled.h1`
  text-transform: capitalize;
  font-size: 5em;

  @media (max-width: 1068px) {
    font-size: 3em;
  }

  @media (max-width: 768px) {
    font-size: 2.5em;
  }

  @media (max-width: 600px) {
    font-size: 2em;
    padding-left: 15px;
  }

  @media (min-width: 400px) {
    padding-left: 10px;
  }
`;

export const PokeNumber = styled.span`
  font-size: 3em;
  opacity: 0.7;
  font-weight: bold;

  @media (max-width: 1068px) {
    font-size: 2.5em;
  }

  @media (max-width: 768px) {
    font-size: 2em;
  }

  @media (max-width: 600px) {
    font-size: 1.8em;
    padding-left: 15px;
  }

  @media (min-width: 400px) {
    padding-left: 10px;
  }
`;

export const MoreInfoSubtitle = styled.h1`
text-align: center;
font-size: 2em; 
color: rgba(255, 255, 255, 0.87);
text-transform: capitalize;
  margin: 2em 0;
`

export const LandingSVG = styled.img`
  transform: scaleX(-1);
  padding: 2em 0;
  align-self: flex-end;

  @media (min-width: 1500px) {
    height: 18em;
    width: 18em;
  }

  @media (max-width: 1068px) {
    height: 14em;
    width: 14em;
  }

  @media (max-width: 950px) {
    height: 14em;
    width: 14em;
  }

  @media (max-width: 768px) {
    /* For devices less than 768px */
    height: 10em;
    width: 10em;
  }

  @media (max-width: 400px) {
    height: 8em;
    width: 8em;
    align-self: center;
    padding: 0;
  }
`;



export const BackButton = styled(Link)`
    font-size: 2em;
    background: none;
    border: none;
    color: white;
    font-weight: bold;
    position: absolute;
    top: 2%;
    left: 2%;
    cursor: pointer;
`


export const BodyContainer = styled.main`
    display: flex;
    justify-content: center;
    height: auto;
    margin-bottom: 3em;
`

export const EvolutionGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 400px);
  grid-auto-rows: minmax(300px, auto); 
  justify-content: space-evenly; 
  margin-bottom: 5rem;
  gap: 75px;

  @media(min-width: 360px) {
    grid-template-columns: repeat(1, 350px);
  }

  @media(min-width: 400px) {
    grid-template-columns: repeat(1, 400px);

    gap: 75px;
  }
  @media(min-width: 900px) {
    grid-template-columns: repeat(2, 400px);
    gap: 75px;
  }

  @media(min-width: 1000px) {

  }

  @media(min-width: 1350px) {
    grid-template-columns: ${({ count }) => {
      if (count === 3) return 'repeat(3, 400px)';
      if (count === 2) return 'repeat(2, 400px)';
      return '400px';
    }};
    
    ${({ count }) =>
      count === 1 &&
      `
      max-width: 500px;
    `}
  }
`;





export const EvolutionName = styled.h2`
text-transform: capitalize;

`

export const EvolutionItem = styled.div`
  background-color: blue;
  padding: 10px;
  border: 2px solid #ddd;
  text-align: center;
  height: 300px;


    
`;


export const EvolutionChainSVG = styled.img`
    width: 5em; 
    height: 7em;
   
`

export const FlexColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  margin-bottom: 5rem;
  justify-content: center;
`

export const AboutInfoContainer = styled.section`
  width: 80%;
  display: flex;
  justify-content: center;
  @media(max-width: 1068px) {
    flex-direction: column;
    align-items: center;
  }
`

export const AboutSVG = styled.img`
  width: 15em;
  height: 15em;
`
export const PrevButton = styled(IoMdArrowRoundBack)`
  font-size: 2em;
  background: none;
  border: none;
  color: white;
  font-weight: bold;
  position: absolute;
  top: 50%;
  left: 8%;
  z-index: 10;
  cursor: pointer;
`;

// Next Button
export const NextButton = styled(IoMdArrowRoundBack)`
  font-size: 2em;
  background: none;
  border: none;
  color: white;
  font-weight: bold;
  position: absolute;
  top: 50%;
  right: 8%;
  z-index: 10;
  cursor: pointer;
  transform: rotateY(180deg); /* Flip the image horizontally */
`;




export const AboutImgContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
 
`
export const AboutImgTitle = styled.h3`

`

export const AboutTextContainer = styled.div`
  width: 100%;
  background-color: black;
  border: 2px solid yellow;
  border-radius: 20px;
  margin: 1em 2em;
  padding: 3em;
  @media(max-width: 1068px) {
    width: 60%;
  }
`

export const StatsGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  background-color: black;
  border: 2px solid yellow;
  width: 920px;
  height: 720px;
  border-radius: 10px;
  @media(max-width: 980px) {
    grid-template-columns: repeat(2, 1fr);
    width: 720px;
    height: auto;
  }
  @media(max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    width: 540px;
    height: auto;
  }

  @media(max-width: 540px) {
    grid-template-columns: repeat(2, 1fr);
    width: 400px;
    height: auto;
  }

`

export const StatsFlexContainer = styled.div`
  display: flex; 
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  margin: 2em;
  @media(max-width: 980px) {
    margin: 1.5em;

  }
  @media(max-width: 768px) {
    margin: 1em;

  }
  @media(max-width: 540px) {
    margin: .5em;
    height: auto;
  }
  
`

export const StatsText = styled.p`
  font-size: 2em;
  @media(max-width: 660px) {
    font-size: 1.5em;

  }
  @media(max-width: 540px) {
   font-size: 1em;
  }
`


export const AttackIcon = styled(LuSword)`
height: 50px;
width: 50px;
color: navy;
@media(max-width: 540px) {
  height: 30px;
  width: 30px;
}
`

export const DefenseIcon = styled(PiShieldPlusDuotone)`
height: 50px;
width: 50px;
color: #f1f1f1;
`

export const HealthIcon = styled(GiHealthIncrease)`
height: 50px;
width: 50px;
color: green;
`

export const SpeedIcon = styled(MdOutlineSpeed)`
height: 50px;
width: 50px;
color: yellow;
`

export const SpecialAttackIcon= styled(LuSwords)`
height: 50px;
width: 50px;
color: red;
`

export const SpecialDefenseIcon= styled(GiMagicShield)`
height: 50px;
width: 50px;
color: grey;
`



export const AbilitiesGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  background-color: black;
  border: 2px solid yellow;
  width: 920px;
  height: auto;
  border-radius: 10px;
  @media(max-width: 980px) {
    grid-template-columns: repeat(2, 1fr);
    width: 720px;
    height: auto;
  }
  @media(max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    width: 540px;
    height: auto;
  }
  @media(max-width: 540px) {
    grid-template-columns: repeat(2, 1fr);
    width: 400px;
    height: auto;
  }
`


export const AbilitiesFlexContainer = styled.div`
  display: flex; 
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  margin: 2em;
  text-transform: capitalize;
  @media(max-width: 980px) {
    margin: 1.5em;

  }
  @media(max-width: 768px) {
    margin: 1em;
  }
`

const shine = keyframes`
  0% {
    background-position: -200px;
  }
  100% {
    background-position: 200px;
  }
`;


export const MythicalBanner = styled.h1`
  position: absolute;
  top: 45%;
  left: 1%;
  font-size: 2.5em;
  color: ${({ type }) => colorMap[type]?.color};
  background: linear-gradient(
    to right,
    ${({ type }) => colorMap[type]?.color} 0%,
    #242424 10%,
    ${({ type }) => colorMap[type]?.color} 20%
  );
  background-size: 400px 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${shine} 3s infinite linear;
  -webkit-text-size-adjust: none;
  font-weight: 900;
  text-decoration: none;
  white-space: nowrap;
  @media(max-width: 900px) {
    font-size: 2em;
  
  }
`;

export const LegendaryBanner = styled.h2`
position: absolute;
top: 45%;
left: 1%;
font-size: 2.5em;
color: ${({ type }) => colorMap[type]?.color};
background: linear-gradient(
  to right,
  ${({ type }) => colorMap[type]?.color} 0%,
  white 10%,
  ${({ type }) => colorMap[type]?.color} 20%
);
background-size: 400px 100%;
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
animation: ${shine} 3s infinite linear;
-webkit-text-size-adjust: none;
font-weight: 900;
text-decoration: none;
white-space: nowrap;
@media(max-width: 900px) {
  font-size: 2em;

}
    
`









// export const Mythical = styled.div`
// position: relative;
// width: auto; 
// height: auto;

// `;

// export const MythicalBanner = styled.h1`
//   position: absolute;
//   top: 25%;
//   left: 100%;
//   color: ${({ type }) => colorMap[type]?.color};
//   background: linear-gradient(
//     to right,
//     ${({ type }) => colorMap[type]?.color} 0%,
//     white 10%,
//     ${({ type }) => colorMap[type]?.color} 20%
//   );
//   background-size: 400px 100%;
//   -webkit-background-clip: text;
//   -webkit-text-fill-color: transparent;
//   animation: ${shine} 3s infinite linear;
//   -webkit-text-size-adjust: none;
//   font-weight: 900;
//   text-decoration: none;
//   white-space: nowrap;
// `;

// export const LegendaryBanner = styled(MythicalBanner)`
    
//     );
// `























