import React, { useState } from "react";
import BrowsePokemon from "./BrowsePokemon";
import { HomeContainer } from "../Home/Home.styled";
import FilterPokemon from "./FilterPokemon";
import { SearchFilterContainer } from "./Browse.styled";
import Search from "./Search/Search";

function BrowseLanding() {
    const [selectedOption, setSelectedOption] = useState('');
    // setAutoCompleteList is kept so BrowsePokemon can sync the cache list — Search reads from context directly
    const [, setAutoCompleteList] = useState([]);

    return (
        <HomeContainer>
            <SearchFilterContainer>
                <Search />
                <FilterPokemon selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
            </SearchFilterContainer>
            <BrowsePokemon selectedOption={selectedOption} setAutoCompleteList={setAutoCompleteList} />
        </HomeContainer>
    );
}

export default BrowseLanding;
