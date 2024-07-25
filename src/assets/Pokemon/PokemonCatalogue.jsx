import React, {useState} from "react";
import { Title, HomeContainer, PokemonCatalog  } from "../Home/Home.styled";
import Pokemon from "../Pokemon/Pokemon"


function PokemonCatalogFC () {


    return (
        <HomeContainer>
            <Title >Catalog of Pokemon Cards</Title>
            <PokemonCatalog>
                <Pokemon />
            </PokemonCatalog>
        </HomeContainer>
    )
}

export default PokemonCatalogFC;