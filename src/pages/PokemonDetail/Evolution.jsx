import React from "react";
import { EvolutionGridContainer, MoreInfoSubtitle } from "./MoreInfo.styled";
import SinglePokeCard from "../Collection/SinglePokeCard";

function Evolution({ memoPokemon }) {
    const { isLinearChain, evolutionChainStages, nextEvolutions, evolutionTree } = memoPokemon;
    const evolvesFrom = evolutionTree?.evolvesFrom;

    // LINEAR: show the full ordered chain (Charmander → Charmeleon → Charizard)
    // so every stage in the chain sees the complete evolution tree.
    if (isLinearChain) {
        if (!evolutionChainStages || evolutionChainStages.length <= 1) return null;
        return (
            <>
                <MoreInfoSubtitle>Evolution Chain</MoreInfoSubtitle>
                <EvolutionGridContainer count={evolutionChainStages.length}>
                    {evolutionChainStages.map((poke) => (
                        <SinglePokeCard key={poke.id} index={poke.id} />
                    ))}
                </EvolutionGridContainer>
            </>
        );
    }

    // BRANCHING: show evolvesFrom (e.g. Eevee) and direct branches separately.
    return (
        <>
            {evolvesFrom && (
                <>
                    <MoreInfoSubtitle>Evolves From</MoreInfoSubtitle>
                    <EvolutionGridContainer count={1}>
                        <SinglePokeCard key={evolvesFrom.id} index={evolvesFrom.id} />
                    </EvolutionGridContainer>
                </>
            )}
            {nextEvolutions?.length > 0 && (
                <>
                    <MoreInfoSubtitle>Evolves Into</MoreInfoSubtitle>
                    <EvolutionGridContainer count={nextEvolutions.length}>
                        {nextEvolutions.map((poke) => (
                            <SinglePokeCard key={poke.id} index={poke.id} />
                        ))}
                    </EvolutionGridContainer>
                </>
            )}
        </>
    );
}

export default Evolution;
