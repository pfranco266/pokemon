import React, { useState, useEffect, useMemo, useReducer } from "react";
import { ResistanceDescription, GenerationDescription, IndividualPokeContainer, PokeType, PokeHeightWeight, GenerationContainer, WeaknessContainer, ElementContainer, ResistanceContainer, PokemonMoveContainer, PokemonDescriptionContainer, PokemonDescription, InfoContainer, HitPoints, Name, SpriteContainer, Sprite } from "./Pokemon.styled";
import PreviousPokemon from "../../pages/PokemonCatalogue/PreviousPokemon";
import PokemonWeak from "./PokemonWeak"
import { pokemonReducer, initialPokeDetails } from "../../reducers/pokemonReducer";
import { fetchSinglePokemon, fetchEvolutionData } from "../../api/pokeAPI";

function PokemonCard({ index }) {

  const [pokemonDetails, dispatch] = useReducer(pokemonReducer, initialPokeDetails);

  const [randomMove, setRandomMove] = useState(Math.floor(Math.random() * (pokemonDetails.moves.length || 1)));
  const [randomDescription, setRandomDescription] = useState(Math.floor(Math.random() * (pokemonDetails.description.length || 1)));


  useEffect(() => {
    const fetchData = async () => {
      try {
        const { pokemonSpeciesData, pokemonDetailData } = await fetchSinglePokemon(index);

        if (pokemonSpeciesData.evolution_chain?.url) {

          const evolvesFromUrl = pokemonSpeciesData.evolves_from_species?.url || '';
          const evolutionData = await fetchEvolutionData(pokemonSpeciesData.evolution_chain.url, evolvesFromUrl);


          dispatch({
            type: 'setPokemonDetails',
            payload: { pokemonDetailData, pokemonSpeciesData, evolutionData }
          })
        }

      } catch (error) {
        dispatch({
          type: 'setError',
          payload: error.message
        })
      }

    }
    fetchData();
  }, [index])

  const memoizedPokemonDetails = useMemo(() => pokemonDetails, [pokemonDetails]);


  useEffect(() => {

    setRandomMove(Math.floor(Math.random() * (memoizedPokemonDetails.moves.length || 1)));
    setRandomDescription(Math.floor(Math.random() * (memoizedPokemonDetails.description.length || 1)));
  }, [memoizedPokemonDetails.moves.length, memoizedPokemonDetails.description.length]);

  const capitalizeFirstLetter = (string) => {
    if (typeof string !== 'string') {
      return '';
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <IndividualPokeContainer color1={memoizedPokemonDetails.types?.[0]?.type?.name || '#f1f1f1'} color2={memoizedPokemonDetails.types?.[1]?.type?.name}>
      {memoizedPokemonDetails?.evolutionTree?.evolvesFrom?.name && (
        <PreviousPokemon capitalizeFirstLetter={capitalizeFirstLetter} backgroundType={memoizedPokemonDetails.types} index={index} cardPokemon={memoizedPokemonDetails} />
      )}
      <Name>{capitalizeFirstLetter(memoizedPokemonDetails.name)}</Name>
      <HitPoints>HP: {memoizedPokemonDetails.stats.hp}</HitPoints>
      <SpriteContainer backgroundType={memoizedPokemonDetails.types?.[0]?.type?.name}>
        <Sprite src={memoizedPokemonDetails?.sprites[0]?.picture}></Sprite>
      </SpriteContainer>
      <InfoContainer>
        {memoizedPokemonDetails.types.map((type, index) => (
          <PokeType key={index} type={type.type.name}>Type {index + 1}: {type.type.name}</PokeType>
        ))}
        <PokeHeightWeight>Height: {memoizedPokemonDetails.height}m, </PokeHeightWeight>
        <PokeHeightWeight>Weight: {memoizedPokemonDetails.weight}lbs.</PokeHeightWeight>
      </InfoContainer>
      <PokemonDescriptionContainer>
        <PokemonDescription>
          {memoizedPokemonDetails.description2}
        </PokemonDescription>
      </PokemonDescriptionContainer>
      <PokemonMoveContainer>
        <Name>
          Special Move: {capitalizeFirstLetter(memoizedPokemonDetails?.moves[randomMove]?.move?.name)}
        </Name>
        <Name>
          {memoizedPokemonDetails?.stats.specialAttack}
        </Name>
      </PokemonMoveContainer>
      <ElementContainer>
        <WeaknessContainer>
          <ResistanceDescription>Weaknesses</ResistanceDescription>
          <PokemonWeak type1={memoizedPokemonDetails?.types[0]?.type.name} type2={memoizedPokemonDetails?.types[0]?.type?.name} resist={false} weak={true} />
        </WeaknessContainer>
        <ResistanceContainer>
          <ResistanceDescription>Resistance</ResistanceDescription>
          <PokemonWeak type1={memoizedPokemonDetails?.types[0]?.type?.name} type2={memoizedPokemonDetails?.types[1]?.type?.name} resist={true} weak={false} />
        </ResistanceContainer>
        <GenerationContainer>
          <ResistanceDescription>Generation</ResistanceDescription>
          <GenerationDescription>{memoizedPokemonDetails.id <= 151 ? 'I' : 'II'}</GenerationDescription>
        </GenerationContainer>
      </ElementContainer>
    </IndividualPokeContainer>
  );
};

export default PokemonCard;


