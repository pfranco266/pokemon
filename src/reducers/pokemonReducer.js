import { sanitizeFlavorText } from '../utils/stringUtils';

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
    capture_rate: null,
    habitat: null,
    species: {},
    types: [],
    moves: [],
    abilities: [],
    isLinearChain: false,
    evolutionChainStages: [],
    evolutionTree: { evolvesFrom: null, nextEvolutions: [] },
    nextEvolutions: [],
    description: [],
    loading: true,
    error: null


};

function pokemonReducer(state, action) {
    switch (action.type) {
      case 'setPokemonDetails':
        const { pokemonDetailData, pokemonSpeciesData, evolutionData } = action.payload;

        const getSpeciesId = (node) => parseInt(node.species.url.split('/').filter(Boolean).pop());

        // True when every node in the chain has at most one evolution (no branching)
        const checkLinear = (node) => {
          if (node.evolves_to.length > 1) return false;
          if (node.evolves_to.length === 1) return checkLinear(node.evolves_to[0]);
          return true;
        };

        // Flatten a linear chain root-to-leaf into an ordered array
        const extractLinearChain = (root) => {
          const stages = [];
          let current = root;
          while (current) {
            stages.push({ name: current.species.name, id: getSpeciesId(current) });
            current = current.evolves_to[0] ?? null;
          }
          return stages;
        };

        // Find current Pokemon's node anywhere in the tree (used for branching chains)
        const findNode = (chain, targetId) => {
          if (getSpeciesId(chain) === targetId) return chain;
          for (const branch of chain.evolves_to) {
            const found = findNode(branch, targetId);
            if (found) return found;
          }
          return null;
        };

        const evolvesFrom = evolutionData.evolvesFrom
          ? { name: evolutionData.evolvesFrom.name, id: evolutionData.evolvesFrom.id }
          : null;

        const linear = checkLinear(evolutionData.chain);

        // LINEAR: extract the full ordered chain so every stage shows the complete tree.
        // BRANCHING: find the current node's direct children (Eevee's 8 branches, etc.)
        const evolutionChainStages = linear ? extractLinearChain(evolutionData.chain) : [];
        const nextEvolutions = linear
          ? []
          : (findNode(evolutionData.chain, pokemonSpeciesData.id)?.evolves_to?.map(branch => ({
              name: branch.species.name,
              id: getSpeciesId(branch),
            })) ?? []);
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
    picture: pokemonDetailData.sprites?.front_default || null
  },
  {
    description: 'Back Default',
    picture: pokemonDetailData.sprites?.back_default || null
  },
  {
    description: 'Front Shiny Default',
    picture: pokemonDetailData.sprites?.front_shiny || null
  },
  {
    description: 'Back Shiny Default',
    picture: pokemonDetailData.sprites?.back_shiny || null
  },
  {
    description: 'Showdown',
    picture: pokemonDetailData.sprites?.other?.showdown?.front_default || null
  },
  {
    description: 'Scroll Sprites Through Generations',
    picture: pokemonDetailData.sprites?.other?.home?.front_default || null
  },
  {
    description: 'Generation 1',
    picture: pokemonDetailData.sprites?.versions?.["generation-i"]?.["red-blue"]?.front_default || pokemonDetailData.sprites?.other?.home?.front_default || null,
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
    picture: pokemonDetailData.sprites?.versions?.["generation-iv"]?.["diamond-pearl"]?.front_default || null
  },
  {
    description: 'Generation 5',
    picture: pokemonDetailData.sprites?.versions?.["generation-v"]?.["black-white"]?.front_default || null
  },
  {
    description: 'Generation 6',
    picture: pokemonDetailData.sprites?.versions?.["generation-vi"]?.["omegaruby-alphasapphire"]?.front_default || null
  },
  {
    description: 'Generation 7',
    picture: pokemonDetailData.sprites?.versions?.["generation-vii"]?.["ultra-sun-ultra-moon"]?.front_default || null
  },
  {
    description: 'Generation 8',
    picture: pokemonDetailData.sprites?.versions?.["generation-viii"]?.icons?.front_default || null
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
          capture_rate: pokemonSpeciesData.capture_rate ?? null,
          habitat: pokemonSpeciesData.habitat?.name ?? null,
          isLinearChain: linear,
          evolutionChainStages,
          nextEvolutions,
          species: evolutionData,
          types: pokemonDetailData.types,
          moves: pokemonDetailData.moves,
          abilities: (pokemonDetailData.abilities ?? []).map(a => ({
            name: a.ability.name,
            isHidden: a.is_hidden,
            slot: a.slot,
          })),
          evolutionTree: { evolvesFrom, nextEvolutions },
          ...(() => {
            const en = pokemonSpeciesData.flavor_text_entries?.filter(e => e.language.name === 'en') ?? [];
            return {
              description:  sanitizeFlavorText(en[0]?.flavor_text),
              description2: sanitizeFlavorText(en[1]?.flavor_text),
              description3: sanitizeFlavorText(en[2]?.flavor_text),
            };
          })(),


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




