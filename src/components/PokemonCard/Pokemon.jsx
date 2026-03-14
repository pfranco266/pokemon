import React, { useState, useContext, useEffect } from "react";
import { PokemonGridContainer, PokemonGridItem, PokeContainer, AddToCart, AddtoCartButton, GridItems, Price, AddToCartNotification } from "./Pokemon.styled";
import PokemonCard from "./PokemonCard"
import CartContext from "../../context/CartContext";
import { usePokemonCache } from "../../context/PokemonCacheContext";
import { SearchButton } from "../../pages/Collection/Search/Search.styled";

function Pokemon() {

    const { cart, setCart } = useContext(CartContext);
    const [disableButton, setDisableButton] = useState(false);
    const [addedToCartMessage, setAddedToCartMessage] = useState(null);
    const { listState, fetchNextListPage } = usePokemonCache();

    // Load the first page if the cache is empty (e.g. user lands directly on /pokemoncards)
    useEffect(() => {
        if (listState.list.length === 0 && !listState.loading) {
            fetchNextListPage();
        }
    }, []);

    const handleClick = (pokemonIndex) => {
        setCart((prev) => {
            const existingItemIndex = prev.findIndex(item => item.index === pokemonIndex);
            if (existingItemIndex !== -1) {
                const newCart = [...prev];
                newCart[existingItemIndex].amount += 1;
                setAddedToCartMessage(prev => ({ ...prev, [pokemonIndex]: 'Successfully added to cart!' }));
                setTimeout(() => {
                    setAddedToCartMessage(prev => ({ ...prev, [pokemonIndex]: null }));
                }, 2000);
                return newCart;
            } else {
                setAddedToCartMessage(prev => ({ ...prev, [pokemonIndex]: 'Successfully added to cart!' }));
                setTimeout(() => {
                    setAddedToCartMessage(prev => ({ ...prev, [pokemonIndex]: null }));
                }, 2000);
                return [...prev, {
                    index: pokemonIndex,
                    amount: 1,
                }];
            }
        });
    };

    async function handleLoadMore() {
        setDisableButton(true);
        await fetchNextListPage();
        setDisableButton(false);
    };

    return (
        <PokeContainer>

            {listState.loading && <h1>Loading, please wait....</h1>}
            {listState.error && <h4>Error: {listState.error}</h4>}
            <PokemonGridContainer>

                {listState.list && listState.list.length > 0 && (
                    listState.list.map((poke, index) => (
                        <GridItems key={index}>

                            <PokemonGridItem>
                                <PokemonCard PokemonDetailUrl={poke.url} index={index + 1} />
                            </PokemonGridItem>
                            <Price>
                                $5.99
                                {addedToCartMessage !== null ? <AddToCartNotification>{addedToCartMessage[index + 1]}</AddToCartNotification> : null}
                            </Price>
                            <AddtoCartButton aria-label="Add to cart" onClick={() => handleClick(index + 1)}>
                                Add to Cart
                            </AddtoCartButton>
                        </GridItems>
                    ))
                )}

            </PokemonGridContainer>

            {!listState.loading && listState?.nextUrl &&
                <SearchButton disabled={disableButton} onClick={handleLoadMore}>
                    Load more Pokemon
                </SearchButton>
            }

        </PokeContainer>
    );
}

export default Pokemon;
