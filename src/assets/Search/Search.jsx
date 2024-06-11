import React from "react";
import { SearchInput } from "./Search.styled"


function Search({ searchTerm, handleChange, handleSubmit }) {




    return (


        <form onSubmit={handleSubmit}>
            <SearchInput
                type="text"
                placeholder="Search for Pokémon..."
                value={searchTerm}
                onChange={handleChange}
            />


        </form>
    )
}

export default Search;