import React, { useState, useEffect, useReducer, useRef } from "react";
import { ResistanceDescription, GenerationDescription, IndividualPokeContainer, PokeType, PokeHeightWeight, GenerationContainer, WeaknessContainer, ElementContainer, ResistanceContainer, PokemonMoveContainer, PokemonDescriptionContainer, PokemonDescription, InfoContainer, HitPoints, Name, SpriteContainer, Sprite } from "./Pokemon.styled";
import PreviousPokemon from "../../pages/PokemonCatalogue/PreviousPokemon";
import PokemonWeak from "./PokemonWeak"
import { pokemonReducer, initialPokeDetails } from "../../reducers/pokemonReducer";
import { usePokemonCache } from "../../context/PokemonCacheContext";
import { capitalizeFirstLetter } from "../../utils/stringUtils";

function PokemonCard({ index }) {
  const [pokemonDetails, dispatch] = useReducer(pokemonReducer, initialPokeDetails);
  const [randomMove, setRandomMove] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);
  const { fetchPokemonDetail } = usePokemonCache();

  // Only start fetching once the card scrolls into (or near) the viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const fetchData = async () => {
      try {
        const result = await fetchPokemonDetail(index);
        if (!result) return;
        const { pokemonSpeciesData, pokemonDetailData, evolutionData } = result;
        dispatch({
          type: 'setPokemonDetails',
          payload: { pokemonDetailData, pokemonSpeciesData, evolutionData }
        });
      } catch (error) {
        dispatch({ type: 'setError', payload: error.message });
      }
    };
    fetchData();
  }, [index, isVisible]);

  useEffect(() => {
    if (pokemonDetails.moves.length > 0) {
      setRandomMove(Math.floor(Math.random() * pokemonDetails.moves.length));
    }
  }, [pokemonDetails.moves.length]);


  // Placeholder rendered while card is outside the viewport or still loading.
  if (!pokemonDetails.name) {
    return <IndividualPokeContainer ref={containerRef} color1="#f1f1f1" />;
  }

  return (
    <IndividualPokeContainer ref={containerRef} color1={pokemonDetails.types?.[0]?.type?.name || '#f1f1f1'} color2={pokemonDetails.types?.[1]?.type?.name}>
      {pokemonDetails?.evolutionTree?.evolvesFrom?.name && (
        <PreviousPokemon capitalizeFirstLetter={capitalizeFirstLetter} backgroundType={pokemonDetails.types} index={index} cardPokemon={pokemonDetails} />
      )}
      <Name>{capitalizeFirstLetter(pokemonDetails.name)}</Name>
      <HitPoints>HP: {pokemonDetails.stats.hp}</HitPoints>
      <SpriteContainer backgroundType={pokemonDetails.types?.[0]?.type?.name}>
        <Sprite src={pokemonDetails?.sprites[0]?.picture}></Sprite>
      </SpriteContainer>
      <InfoContainer>
        {pokemonDetails.types.map((type, index) => (
          <PokeType key={index} type={type.type.name}>Type {index + 1}: {type.type.name}</PokeType>
        ))}
        <PokeHeightWeight>Height: {pokemonDetails.height}m, </PokeHeightWeight>
        <PokeHeightWeight>Weight: {pokemonDetails.weight}lbs.</PokeHeightWeight>
      </InfoContainer>
      <PokemonDescriptionContainer>
        <PokemonDescription>
          {pokemonDetails.description2}
        </PokemonDescription>
      </PokemonDescriptionContainer>
      <PokemonMoveContainer>
        <Name>
          Special Move: {capitalizeFirstLetter(pokemonDetails?.moves[randomMove]?.move?.name)}
        </Name>
        <Name>
          {pokemonDetails?.stats.specialAttack}
        </Name>
      </PokemonMoveContainer>
      <ElementContainer>
        <WeaknessContainer>
          <ResistanceDescription>Weaknesses</ResistanceDescription>
          <PokemonWeak type1={pokemonDetails?.types[0]?.type.name} type2={pokemonDetails?.types[0]?.type?.name} resist={false} weak={true} />
        </WeaknessContainer>
        <ResistanceContainer>
          <ResistanceDescription>Resistance</ResistanceDescription>
          <PokemonWeak type1={pokemonDetails?.types[0]?.type?.name} type2={pokemonDetails?.types[1]?.type?.name} resist={true} weak={false} />
        </ResistanceContainer>
        <GenerationContainer>
          <ResistanceDescription>Generation</ResistanceDescription>
          <GenerationDescription>{pokemonDetails.id <= 151 ? 'I' : 'II'}</GenerationDescription>
        </GenerationContainer>
      </ElementContainer>
    </IndividualPokeContainer>
  );
};

export default PokemonCard;
