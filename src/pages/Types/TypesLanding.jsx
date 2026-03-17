import React from 'react';
import { HomeContainer } from '../Home/Home.styled';
import { capitalizeFirstLetter } from '../../utils/stringUtils';
import colorMap from '../../utils/colorMap';
import { PageQuoteBlock, QuoteFirstSentence } from '../../components/shared/PageQuoteBlock.styled';
import {
    TypePageTitle,
    TypeTitleLine,
    TypeCardsGrid,
    TypeCard,
    TypeCardIcon,
    ChartSection,
    ChartTitle,
    ChartSubtitle,
    ChartTable,
    ChartHeaderCell,
    ChartRowLabel,
    ChartCell,
    ChartLegend,
    LegendItem,
    LegendSwatch,
    ChartLabelLink,
} from './Types.styled';

const ALL_TYPES = Object.keys(colorMap);

function multLabel(m) {
    if (m === 2)   return '2×';
    if (m === 0.5) return '½';
    if (m === 0)   return '0';
    return '';
}

function TypesLanding() {
    return (
        <HomeContainer>
            <TypePageTitle>Types</TypePageTitle>
            <TypeTitleLine />

            <PageQuoteBlock>
                <QuoteFirstSentence>Every Pokémon has one or two types that shape their strengths and weaknesses.</QuoteFirstSentence>{' '}
                Each type interacts differently in battle — some attacks are super effective, others barely scratch the surface.
            </PageQuoteBlock>

            <TypeCardsGrid>
                {ALL_TYPES.map(type => {
                    const { color, icon: Icon } = colorMap[type];
                    return (
                        <TypeCard key={type} to={`/types/${type}`} typecolor={color}>
                            <TypeCardIcon>
                                <Icon />
                            </TypeCardIcon>
                            {capitalizeFirstLetter(type)}
                        </TypeCard>
                    );
                })}
            </TypeCardsGrid>

            <ChartSection>
                <ChartTitle>Type Effectiveness Chart</ChartTitle>
                <ChartSubtitle>
                    Rows = Attacking type &nbsp;·&nbsp; Columns = Defending type
                </ChartSubtitle>

                <ChartTable>
                    <thead>
                        <tr>
                            <ChartHeaderCell />
                            {ALL_TYPES.map(defType => (
                                <ChartHeaderCell
                                    key={defType}
                                    typecolor={colorMap[defType].color}
                                    title={capitalizeFirstLetter(defType)}
                                >
                                    <ChartLabelLink to={`/types/${defType}`}>
                                        {defType.slice(0, 3).toUpperCase()}
                                    </ChartLabelLink>
                                </ChartHeaderCell>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {ALL_TYPES.map(atkType => (
                            <tr key={atkType}>
                                <ChartRowLabel typecolor={colorMap[atkType].color}>
                                    <ChartLabelLink to={`/types/${atkType}`}>
                                        {capitalizeFirstLetter(atkType)}
                                    </ChartLabelLink>
                                </ChartRowLabel>
                                {ALL_TYPES.map(defType => {
                                    const mult = colorMap[defType].typeChart[atkType] ?? 1;
                                    return (
                                        <ChartCell
                                            key={defType}
                                            mult={mult}
                                            title={`${capitalizeFirstLetter(atkType)} → ${capitalizeFirstLetter(defType)}: ${mult}×`}
                                        >
                                            {multLabel(mult)}
                                        </ChartCell>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </ChartTable>

                <ChartLegend>
                    <LegendItem><LegendSwatch bg="rgba(76,175,80,0.85)" /> Super effective (2×)</LegendItem>
                    <LegendItem><LegendSwatch bg="rgba(239,83,80,0.75)" /> Not very effective (½×)</LegendItem>
                    <LegendItem><LegendSwatch bg="rgba(60,60,60,0.9)" /> No effect (0×)</LegendItem>
                    <LegendItem><LegendSwatch bg="rgba(30,30,30,0.5)" /> Normal (1×)</LegendItem>
                </ChartLegend>
            </ChartSection>
        </HomeContainer>
    );
}

export default TypesLanding;
