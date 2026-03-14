import React from "react";
import { PokeballContainer, PokeballSVG } from "../../pages/Collection/Browse.styled";


function Pokeball () {
    return (
        <PokeballContainer>
            <PokeballSVG src={`https://pokemon-world-imdoug.netlify.app/img/pokeball.svg`} alt="Pokeball image"/> 
        </PokeballContainer>
    )
}

export default Pokeball