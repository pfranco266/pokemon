//funtions are in call order 


//called from Pokemon.jsx: 

async function fetchPokeList(url) {
    try {
        const response = await fetch(url);  
        const data = await response.json();

        return {data};
    } catch (error) {

    }
}

// called from PokemonCard.jsx, which calls fetchEvolutionData

async function fetchSinglePokemon(index) {
    try {      
        const pokemonDetailUrl = `https://pokeapi.co/api/v2/pokemon/${index}/`;

        const pokemonSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${index}/`;

        const [pokemonDetailData, pokemonSpeciesData] = await Promise.all([
            fetch(pokemonDetailUrl).then(response => response.json()),
            fetch(pokemonSpeciesUrl).then(response => response.json())
        ]);
        return {pokemonSpeciesData, pokemonDetailData};

        // if (pokemonSpeciesData.evolution_chain?.url) {

        //     const evolvesFromUrl = pokemonSpeciesData.evolves_from_species?.url || '';
        //     const evolutionData = await fetchEvolutionData(pokemonSpeciesData.evolution_chain.url, evolvesFromUrl);
        //     // console.log('evo', evolutionData, 'deailtData', pokemonDetailData, '  species', pokemonSpeciesData)
        //     // dispatch({
        //     //     type: 'setPokemonDetails',
        //     //     payload: { pokemonDetailData, pokemonSpeciesData, evolutionData }
        //     // })
        // } 
    } catch (error) {
        console.log(error.message)
//         // dispatch({
//         //     type: 'error',
//         //     action: error.message
//         // })

    }
}


///called third, inside of fetchSinglePokemon, and also inside the pokemonCard.jsx component

async function fetchEvolutionData(evolutionChainUrl, evolvesFromUrl) {
    try {
        const evolutionChainPromise = fetch(evolutionChainUrl).then(response => response.json());
        const evolvesFromPromise = evolvesFromUrl ? fetch(evolvesFromUrl).then(response => response.json()) : Promise.resolve(null);

        const [evolutionChain, evolvesFrom] = await Promise.all([evolutionChainPromise, evolvesFromPromise]);
      

        return { ...evolutionChain, evolvesFrom };
    } catch (error) {
        console.error("Error fetching evolution data:", error.message);
        return {};
    }
}






export {fetchSinglePokemon, fetchEvolutionData, fetchPokeList};