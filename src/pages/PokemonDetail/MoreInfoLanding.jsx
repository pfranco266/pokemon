import React, { useReducer, useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { pokemonReducer, initialPokeDetails } from "../../reducers/pokemonReducer";
import { usePokemonCache } from "../../context/PokemonCacheContext";
import { capitalizeFirstLetter } from "../../utils/stringUtils";
import colorMap from "../../utils/colorMap";
import MoreInfoHeading from "./MoreInfoHeading";
import MoreInfoBody from "./MoreInfoBody";
import PokeballTransition from "../../components/PokeballTransition/PokeballTransition";
import { HomeContainer } from "../Home/Home.styled";
import {
    PrevPokeButton,
    NextPokeButton,
    CompactBanner,
    CompactBannerNumber,
    CompactBannerName,
} from "./MoreInfo.styled";
import { IoMdArrowRoundBack } from "react-icons/io";

function MoreInfoLanding() {
    const params = useParams();
    const pokeId = params?.id;
    const navigate = useNavigate();
    const { fetchPokemonDetail, fetchAllListPages, listState } = usePokemonCache();
    const totalCount = listState.totalCount;

    const [pokemonDetails, setPokemonDetails] = useReducer(pokemonReducer, initialPokeDetails);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [transitionTarget, setTransitionTarget] = useState({ id: null, name: '', direction: null });
    const headerRef = useRef(null);
    const [headerVisible, setHeaderVisible] = useState(true);

    useEffect(() => {
        fetchAllListPages();
    }, []);

    // Reset banner when navigating to a new Pokémon
    useEffect(() => {
        setHeaderVisible(true);
    }, [pokeId]);

    // Attach IntersectionObserver after data loads (header element exists)
    useEffect(() => {
        const el = headerRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => setHeaderVisible(entry.isIntersecting),
            { threshold: 0 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [pokemonDetails.id]);

    useEffect(() => {
        setPokemonDetails({ type: 'setLoading' });
        const load = async () => {
            try {
                const result = await fetchPokemonDetail(pokeId);
                if (!result) {
                    setPokemonDetails({ type: 'setError', payload: 'Not found' });
                    return;
                }
                const { pokemonSpeciesData, pokemonDetailData, evolutionData } = result;
                setPokemonDetails({
                    type: 'setPokemonDetails',
                    payload: { pokemonDetailData, pokemonSpeciesData, evolutionData }
                });
            } catch (error) {
                setPokemonDetails({ type: 'setError', payload: error.message });
            }
        };
        load();
    }, [pokeId]);

    if (pokemonDetails.loading) {
        return <HomeContainer><h2>Loading... Please wait</h2></HomeContainer>;
    }

    if (!pokemonDetails?.id) {
        return (
            <HomeContainer>
                <h2>Sorry, we couldn't find {pokeId}. Try your search again</h2>
                <Link to="/collection"><h2>Back to all Pokemon</h2></Link>
            </HomeContainer>
        );
    }

    const pokemonId = pokemonDetails.id;
    const primaryType = pokemonDetails.types?.[0]?.type?.name;
    const typeColor = colorMap[primaryType]?.color ?? '#ffcc00';

    function getNameForId(id) {
        return listState.list[id - 1]?.name ?? '';
    }

    function handlePrev() {
        if (isTransitioning || pokemonId <= 1) return;
        const targetId = pokemonId - 1;
        setTransitionTarget({ id: targetId, name: getNameForId(targetId), direction: 'left' });
        setIsTransitioning(true);
    }

    function handleNext() {
        if (isTransitioning || (totalCount && pokemonId >= totalCount)) return;
        const targetId = pokemonId + 1;
setTransitionTarget({ id: targetId, name: getNameForId(targetId), direction: 'right' });
        setIsTransitioning(true);
    }

    function handleTransitionNavigate() {
        navigate(`/collection/${transitionTarget.id}`);
    }

    function handleTransitionComplete() {
        setIsTransitioning(false);
        setTransitionTarget({ id: null, name: '', direction: null });
    }

    return (
        <>
            {isTransitioning && (
                <PokeballTransition
                    targetName={capitalizeFirstLetter(transitionTarget.name)}
                    direction={transitionTarget.direction}
                    onNavigate={handleTransitionNavigate}
                    onComplete={handleTransitionComplete}
                />
            )}

            {pokemonId > 1 && (
                <PrevPokeButton
                    typecolor={typeColor}
                    onClick={handlePrev}
                    disabled={isTransitioning}
                    aria-label="Previous Pokémon"
                >
                    <IoMdArrowRoundBack />
                </PrevPokeButton>
            )}
            {pokemonId && (!totalCount || pokemonId < totalCount) && (
                <NextPokeButton
                    typecolor={typeColor}
                    onClick={handleNext}
                    disabled={isTransitioning}
                    aria-label="Next Pokémon"
                >
                    <IoMdArrowRoundBack style={{ transform: 'rotateY(180deg)' }} />
                </NextPokeButton>
            )}

            <CompactBanner type={primaryType} visible={!headerVisible ? 1 : 0}>
                <CompactBannerNumber>#{pokemonId}</CompactBannerNumber>
                <CompactBannerName>{capitalizeFirstLetter(pokemonDetails.name)}</CompactBannerName>
            </CompactBanner>

            <MoreInfoHeading memoPokemon={pokemonDetails} headerRef={headerRef} />
            <MoreInfoBody memoPokemon={pokemonDetails} />
        </>
    );
}

export default MoreInfoLanding;
