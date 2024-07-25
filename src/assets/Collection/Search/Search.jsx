import React from "react";
import { SearchInput, SearchButton, SearchForm, SearchWrapper, SearchDropDown, SearchDropDownItem } from "./Search.styled"


function Search({setDropDown, dropDown, setSearchTerm, searchTerm, handleChange, handleSubmit, filteredTerms }) {

    function handleClick (event) {
        
        setSearchTerm(event.target.innerText)
        setDropDown(false);
    }


    return (
        <SearchWrapper>
            {dropDown && filteredTerms.length > 0 ? 
            <SearchDropDown>
                {filteredTerms.map((name, index)=> {
                    return <SearchDropDownItem onClick={handleClick} key={index}>{name}</SearchDropDownItem>
                })}
            </SearchDropDown>
        : null} 
            
        
        <SearchForm onSubmit={handleSubmit}>
            <SearchInput
                type="text"
                placeholder="Search for Pokémon..."
                value={searchTerm}
                onChange={handleChange}
            />
            <SearchButton>I choose you!</SearchButton>

        </SearchForm>
        </SearchWrapper>
    )
}

export default Search;