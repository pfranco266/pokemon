import React, { useEffect } from "react";
import { BrowseContainer, OuterBrowseContainer } from "./Browse.styled";
import { usePokemonCache } from "../../context/PokemonCacheContext";
import SinglePokeCard from "./SinglePokeCard";

function BrowsePokemon({ selectedOption, setAutoCompleteList }) {
    const { listState, fetchAllListPages } = usePokemonCache();

    // Kick off full list load on mount. No-op if already loaded or in progress.
    useEffect(() => {
        fetchAllListPages();
    }, []);

    // Keep autocomplete list in sync with the cache as pages arrive.
    useEffect(() => {
        if (listState.list.length > 0) {
            setAutoCompleteList(listState.list.map(p => p.name));
        }
    }, [listState.list.length]);

    return (
        <OuterBrowseContainer>
            {listState.loading && listState.list.length === 0 && <h2>Loading...Please wait</h2>}
            <BrowseContainer>
                {listState.list.map((poke, index) => (
                    <SinglePokeCard selectedOption={selectedOption} key={index} index={index + 1} />
                ))}
            </BrowseContainer>
        </OuterBrowseContainer>
    );
}

export default BrowsePokemon;
