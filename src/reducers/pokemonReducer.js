const initialPokeDetails = {
    id: null,
    legendary: false,
    mythical: false,
    name: '',
    height: null,
    weight: null,
    sprites: {
        default: '',
        backDefault: '',
        frontShiny: '',
        backShiny: ''
    },
    stats: {
        hp: null,
        attack: null,
        defense: null,
        specialAttack: null,
        specialDefense: null,
        speed: null
    },
    species: {},
    types: [],
    moves: [],
    evolutionTree: {},
    description: [],
    loading: true,
    error: null


};

function pokemonReducer(state, action) {
    switch (action.type) {
      case 'setPokemonDetails':
        const { pokemonDetailData, pokemonSpeciesData, evolutionData } = action.payload;

        const extractEvolutions = (chain) => {
          const evolutions = [];
          let current = chain;
          while (current) {
            evolutions.push({
              name: current.species.name,
              id: current.species.url.split('/').filter(Boolean).pop(),
              sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${current.species.url.split('/').filter(Boolean).pop()}.svg`
            });
            current = current.evolves_to[0];
          }
          return evolutions;
        };
  
        const evolutions = extractEvolutions(evolutionData.chain);
        return {
          ...state,
          id: pokemonDetailData.id,
          loading: false,
          legendary: pokemonSpeciesData.is_legendary,
          mythical: pokemonSpeciesData.is_mythical,
          name: pokemonDetailData.name,
          height: pokemonDetailData.height / 10,
          weight: pokemonDetailData.weight,
        
sprites : [
  {
    description: 'Front Default',
    picture: pokemonDetailData.sprites?.front_default || defaultImage
  },
  {
    description: 'Back Default',
    picture: pokemonDetailData.sprites?.back_default || defaultImage
  },
  {
    description: 'Front Shiny Default',
    picture: pokemonDetailData.sprites?.front_shiny || defaultImage
  },
  {
    description: 'Back Shiny Default',
    picture: pokemonDetailData.sprites?.back_shiny || defaultImage
  },
  {
    description: 'Showdown',
    picture: pokemonDetailData.sprites?.other?.showdown?.front_default || defaultImage
  },
  {
    description: 'Scroll Sprites Through Generations',
    picture: pokemonDetailData.sprites?.other?.home?.front_default || defaultImage
  },
  {
    description: 'Generation 1',
    picture: pokemonDetailData.sprites?.versions?.["generation-i"]?.["red-blue"]?.front_default || pokemonDetailData.sprites?.other?.home?.front_default || defaultImage,
  },
  {
    description: 'Generation 2',
    picture: pokemonDetailData?.sprites?.versions?.["generation-ii"]?.gold?.front_default || pokemonDetailData.sprites?.other?.home?.front_default || 'no picture available',
  },
  {
    description: 'Generation 3',
    picture: pokemonDetailData.sprites?.versions?.["generation-iii"]?.emerald?.front_default || pokemonDetailData.sprites?.other?.home?.front_default ,
  },
  {
    description: 'Generation 4',
    picture: pokemonDetailData.sprites?.versions?.["generation-iv"]?.["diamond-pearl"]?.front_default || defaultImage
  },
  {
    description: 'Generation 5',
    picture: pokemonDetailData.sprites?.versions?.["generation-v"]?.["black-white"]?.front_default || defaultImage
  },
  {
    description: 'Generation 6',
    picture: pokemonDetailData.sprites?.versions?.["generation-vi"]?.["omegaruby-alphasapphire"]?.front_default || defaultImage
  },
  {
    description: 'Generation 7',
    picture: pokemonDetailData.sprites?.versions?.["generation-vii"]?.["ultra-sun-ultra-moon"]?.front_default || defaultImage
  },
  {
    description: 'Generation 8',
    picture: pokemonDetailData.sprites?.versions?.["generation-viii"]?.icons?.front_default || defaultImage
  }
],
          stats: {
            hp: pokemonDetailData.stats[0].base_stat,
            attack: pokemonDetailData.stats[1].base_stat,
            defense: pokemonDetailData.stats[2].base_stat,
            specialAttack: pokemonDetailData.stats[3].base_stat,
            specialDefense: pokemonDetailData.stats[4].base_stat,
            speed: pokemonDetailData.stats[5].base_stat,
          },
          evolutions,
          species: evolutionData,
          types: pokemonDetailData.types,
          moves: pokemonDetailData.moves,
          evolutionTree: evolutionData,
          description: pokemonSpeciesData.flavor_text_entries[0].flavor_text,
          description2: pokemonSpeciesData.flavor_text_entries[2].flavor_text,
          description3: pokemonSpeciesData.flavor_text_entries[3].flavor_text,


          error: '',
        };
  
      case 'setError':
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
  
      default:
        return {
          ...state, 
          loading: false
        };
    }
  }
  
  

export {initialPokeDetails, pokemonReducer};




