import React, { useState, useEffect, useContext, useReducer } from "react";
import { PokemonGridContainer, PokemonGridItem, PokeContainer, AddToCart, AddtoCartButton, GridItems, Price, AddToCartNotification } from "./Pokemon.styled";
import PokemonCard from "./PokemonCard"
import CartContext from "../../context/CartContext";
import { fetchPokeList } from "../../api/pokeAPI"
import { initialPokeList, pokeListReducer } from "../../reducers/pokemonListReducer"
import { SearchButton } from "../../pages/Collection/Search/Search.styled";
// import { v4 as uuid } from 'uuid';



function Pokemon() {



    const { cart, setCart } = useContext(CartContext);
    const { disableButton, setDisablebutton } = useState(false)
    const [addedToCartMessage, setAddedToCartMessage] = useState(null);


    const [pokeList, dispatch] = useReducer(pokeListReducer, initialPokeList);





    const handleClick = (pokemonIndex) => {
        setCart((prev) => {
            const existingItemIndex = prev.findIndex(item => item.index === pokemonIndex);
            if (existingItemIndex !== -1) {

                const newCart = [...prev];
                newCart[existingItemIndex].amount += 1;

           
                console.log(addedToCartMessage)
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

 

    const fetchData = async (url) => {
        dispatch({ type: 'setLoading' });
        try {

            const { data } = await fetchPokeList(url);
            dispatch({
                type: 'setPokeList',
                payload: data
            });

        } catch (error) {
            dispatch({
                type: 'setError',
                payload: error.message
            });
        }
    }



    useEffect(() => {

        console.log(addedToCartMessage)

        fetchData(pokeList.initialUrl);

    }, []);



    async function handleLoadMore() {

        dispatch({ type: 'setLoading' });
        
        try {
            if (pokeList?.nextUrl) {
                await fetchData(pokeList.nextUrl)
            }
        } catch (error) {
            dispatch({
                type: 'setError',
                payload: error.message
            })
        }

    };

    console.log(addedToCartMessage)


    return (
        <PokeContainer>

            {pokeList.loading && <h1>Loading, please wait....</h1>}
            {pokeList.error && <h4>Error: {pokeList.error}</h4>}
            <PokemonGridContainer>
                
                {pokeList.list && pokeList.list.length > 0 && (
                    pokeList.list.map((poke, index) => (
                        <GridItems key={index}>

                            <PokemonGridItem >
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

            {!pokeList.loading && pokeList?.list.length < 251 && 
               <SearchButton disabled={disableButton} onClick={handleLoadMore}>
               Load more Pokemon
             </SearchButton>
            
             }

             {pokeList?.list.length > 251 ? <h1>I only like the first 250ish Pokemon</h1> : null}
        </PokeContainer>
    );
}

export default Pokemon;
