import React from "react";
import { EvolutionGridContainer } from "./MoreInfo.styled";
import { Title } from "../Home/Home.styled";
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
                <Title>Evolution Chain</Title>
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
                    <Title>Evolves From</Title>
                    <EvolutionGridContainer count={1}>
                        <SinglePokeCard key={evolvesFrom.id} index={evolvesFrom.id} />
                    </EvolutionGridContainer>
                </>
            )}
            {nextEvolutions?.length > 0 && (
                <>
                    <Title>Evolves Into</Title>
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
