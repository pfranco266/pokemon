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
  justify-content: center;
  margin-bottom: 5rem;
  gap: 75px;

  @media(min-width: 360px) {
    grid-template-columns: repeat(1, 350px);
  }

  @media(min-width: 400px) {
    grid-template-columns: repeat(1, 400px);
  }

  @media(min-width: 1000px) {
    grid-template-columns: ${({ count }) => count >= 2 ? 'repeat(2, 400px)' : 'repeat(1, 400px)'};
  }

  @media(min-width: 1350px) {
    grid-template-columns: ${({ count }) =>
      count >= 3 ? 'repeat(3, 400px)' :
      count === 2 ? 'repeat(2, 400px)' :
      'repeat(1, 400px)'
    };
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

export const TBSContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75em;
  background-color: black;
  border: 2px solid yellow;
  border-radius: 10px;
  width: 920px;
  padding: 1.5em 2em;
  margin-bottom: 2em;
  @media(max-width: 980px) { width: 720px; }
  @media(max-width: 768px) { width: 540px; }
  @media(max-width: 540px) { width: 400px; padding: 1em 1.25em; }
`;

export const TBSLabel = styled.p`
  font-size: 1.5em;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.87);
  @media(max-width: 540px) { font-size: 1.1em; }
`;

export const TBSValue = styled.span`
  font-size: ${({ exceptional }) => exceptional ? '4em' : '3em'};
  font-weight: 900;
  color: ${({ tiercolor }) => tiercolor};
  text-shadow: ${({ exceptional, glowcolor }) =>
    exceptional ? `0 0 6px ${glowcolor}` : 'none'};
  @media(max-width: 540px) { font-size: ${({ exceptional }) => exceptional ? '3em' : '2em'}; }
`;

export const TBSBarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1em;
  width: 100%;
`;

export const TBSBarTrack = styled.div`
  width: 100%;
  height: 14px;
  background-color: #242424;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #444;
`;

export const TBSBarFill = styled.div`
  height: 100%;
  width: ${({ pct }) => pct}%;
  background-color: ${({ tiercolor }) => tiercolor};
  border-radius: 8px;
  transition: width 0.4s ease;
`;

export const TBSTierLabel = styled.span`
  font-size: 1em;
  font-weight: ${({ exceptional }) => exceptional ? '900' : 'bold'};
  color: ${({ tiercolor }) => tiercolor};
  white-space: nowrap;
  text-align: center;
  @media(max-width: 540px) { font-size: 0.85em; }
`;

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
color: #90caf9;
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



// Battle Role Breakdown
export const BattleRoleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75em;
  background-color: black;
  border: 2px solid yellow;
  border-radius: 10px;
  width: 920px;
  padding: 1.5em 2em;
  margin-bottom: 2em;
  @media(max-width: 980px) { width: 720px; }
  @media(max-width: 768px) { width: 540px; }
  @media(max-width: 540px) { width: 400px; padding: 1em 1.25em; }
`;

export const BattleRoleRow = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  gap: 1em;
  @media(max-width: 540px) { gap: 0.5em; }
`;

export const BattleRoleBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25em;
  flex: 1;
`;

export const BattleRoleLabel = styled.p`
  font-size: 1em;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.87);
  text-align: center;
  @media(max-width: 540px) { font-size: 0.8em; }
`;

export const BattleRoleValue = styled.span`
  font-size: 2.5em;
  font-weight: 900;
  color: ${({ typecolor }) => typecolor};
  @media(max-width: 540px) { font-size: 1.8em; }
`;

export const BattleRoleSublabel = styled.span`
  font-size: 0.9em;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.6);
  @media(max-width: 540px) { font-size: 0.75em; }
`;

// Stats accordion (Stats.jsx)
export const AccordionToggle = styled.button`
  background: none;
  border: 2px solid #ffcc00;
  color: #ffcc00;
  border-radius: 50%;
  width: 4em;
  height: 4em;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-top: 0.5em;
  transition: background-color 0.2s;
  &:hover { background-color: rgba(255, 204, 0, 0.1); }
`;

export const AccordionChevron = styled(IoMdArrowRoundBack)`
  font-size: 2.2em;
  transition: transform 0.3s ease;
  transform: ${({ isopen }) => isopen ? 'rotate(90deg)' : 'rotate(-90deg)'};
`;

export const AccordionContent = styled.div`
  overflow: hidden;
  max-height: ${({ isopen }) => isopen ? '900px' : '0'};
  transition: max-height 0.4s ease;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const RadarChartContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 300px;
  margin: 0.5em auto;
`;

// Stats side-by-side layout (Stats.jsx)
export const StatsSideBySide = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  gap: 1em;
  @media (max-width: 700px) {
    flex-direction: column;
  }
`;

export const StatChartSection = styled.div`
  flex: 0 0 55%;
  display: flex;
  justify-content: center;
  @media (max-width: 700px) {
    flex: none;
    width: 100%;
  }
`;

export const StatLegendSection = styled.div`
  flex: 0 0 calc(45% - 1em);
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  @media (max-width: 700px) {
    flex: none;
    width: 100%;
  }
`;

export const StatLegendRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5em;
`;

export const StatLegendName = styled.span`
  flex: 1;
  font-size: 1em;
  color: rgba(255, 255, 255, 0.87);
`;

export const StatLegendValue = styled.span`
  font-size: 1em;
  font-weight: 700;
  color: ${({ statcolor }) => statcolor || '#ffcc00'};
`;

// Habitat (About.jsx)
export const HabitatBanner = styled.div`
  width: 100%;
  background-color: ${({ typecolor }) => typecolor || '#424242'};
  border-top: 2px solid ${({ darkercolor }) => darkercolor || '#333'};
  border-bottom: 2px solid ${({ darkercolor }) => darkercolor || '#333'};
  border-radius: 8px;
  padding: 0.85rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 700;
  text-transform: capitalize;
  margin-top: 1em;
  margin-bottom: 1.75rem;
`;

// Prev / Next Pokémon navigation (MoreInfoLanding.jsx)
export const PrevPokeButton = styled.button`
  position: fixed;
  top: 50%;
  left: 0.75em;
  transform: translateY(-50%);
  z-index: 200;
  background-color: rgba(0, 0, 0, 0.7);
  border: 2px solid #ffcc00;
  color: ${({ typecolor }) => typecolor};
  border-radius: 50%;
  width: 3em;
  height: 3em;
  font-size: 1.5em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  &:hover { background-color: rgba(0, 0, 0, 0.92); }
  @media(max-width: 768px) { width: 2.2em; height: 2.2em; font-size: 1.1em; left: 0.4em; }
`;

export const NextPokeButton = styled(PrevPokeButton)`
  left: unset;
  right: 0.75em;
  @media(max-width: 768px) { right: 0.4em; left: unset; }
`;

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























