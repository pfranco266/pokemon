import React, { useEffect, useReducer, useState } from "react";
import { BrowseContainer, OuterBrowseContainer, DropdownButtonContainer } from "./Browse.styled";
import { LoadMore } from "../Pokemon/Pokemon.styled";
import { fetchPokeList } from "../Reducers/pokeAPI";
import { pokeListReducer, initialPokeList } from "../Reducers/pokemonListReducer";
import SinglePokeCard from "./SinglePokeCard";

function BrowsePokemon({ selectedOption, autoCompleteList, setAutoCompleteList }) {
    const [pokemonList, pokeListDispatch] = useReducer(pokeListReducer, initialPokeList);
    
    const fetchData = async (url) => {
        pokeListDispatch({ type: 'setLoading' });
        try {
            const { data } = await fetchPokeList(url);
            pokeListDispatch({
                type: 'setPokeList',
                payload: data
            });

            data.results.map(results => {
                setAutoCompleteList(prev=> {
                    return [
                        ...prev,
                        results.name
                    ]
                })
           })
        } catch (error) {
            pokeListDispatch({
                type: 'setError',
                payload: error.message
            });
        }
    }

    useEffect(() => {
        fetchData(pokemonList?.initialUrl);
    }, []);

    

    useEffect(() => {
        const handleLoadAll = async () => {

            try {
             
                if (pokemonList?.list?.length > 251) {
                    return;
                }
                if (pokemonList?.nextUrl) {
                    const { data } = await fetchPokeList(pokemonList.nextUrl);
                    //map over results to set auto complete list with the pokemon names

                   data.results.map(results => {
                        setAutoCompleteList(prev=> {
                            return [
                                ...prev,
                                results.name
                            ]
                        })
                   })
                   // set pokemon list with reducer
                    pokeListDispatch({
                        type: 'setPokeList',
                        payload: data
                    });
                    
                    pokeListDispatch({ 
                        type: 'setLoading', 
                        payload: false 
                    });


                }
            } catch (error) {
                pokeListDispatch({
                    type: 'setError',
                    payload: error.message
                });
            }
        }

        handleLoadAll();
    }, [pokemonList?.nextUrl]);

    return (
        <OuterBrowseContainer>
            {pokemonList.list > 150? <h2>Loading...Please wait</h2> : null}

            <BrowseContainer>
                {pokemonList && pokemonList?.list?.map((poke, index) => (
                    <SinglePokeCard selectedOption={selectedOption} key={index} index={index + 1} />
                ))}
            </BrowseContainer>

   

            {pokemonList?.list.length >= 251 && <h1>I only like the first 250ish Pokémon</h1>}
        </OuterBrowseContainer>
    );
}

export default BrowsePokemon;



const movies = [
    { title: "The Matrix", genre: "Sci-Fi", rating: 9 },
    { title: "Inception", genre: "Sci-Fi", rating: 8 },
    { title: "Interstellar", genre: "Sci-Fi", rating: 10 },
    { title: "The Dark Knight", genre: "Action", rating: 9 },
    { title: "Gladiator", genre: "Action", rating: 8 },
    { title: "The Shawshank Redemption", genre: "Drama", rating: 10 },
    { title: "Forrest Gump", genre: "Drama", rating: 9 }
  ];

  function groupBy (arr) {
    if(arr.length < 1) return [];

    const copyArr = [...arr];
    const movieObj = {}

    copyArr.forEach(movie => {
        if(!movieObj[movie.genre]) {
            movieObj[movie.genre] = [];
        }
        movieObj[movie.genre] = [movie.title, movie.rating];
    });

    for(let [key, value] of Object.entries(movieObj)) {

    }

  }


  const oo = {
    genre: [
        {title: 'movie', 
            space: 'left'
        }
    ]
  }