import styled from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';

export const TypePageTitle = styled.h1`
    font-family: 'Russo One', sans-serif;
    font-size: clamp(1.8rem, 4vw, 2.8rem);
    color: #ffcc00;
    text-align: center;
    margin: 2rem 0 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
`;

export const TypeTitleLine = styled.hr`
    border: none;
    border-top: 2px solid #ffcc00;
    width: 80px;
    margin: 0 auto 1.5rem;
`;

export const TypeCardsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 0.75rem;
    width: 100%;
    max-width: 900px;
    margin: 0 auto 2.5rem;

    @media (max-width: 900px) {
        grid-template-columns: repeat(4, 1fr);
    }
    @media (max-width: 600px) {
        grid-template-columns: repeat(3, 1fr);
    }
    @media (max-width: 400px) {
        grid-template-columns: repeat(2, 1fr);
    }
`;

export const TypeCard = styled(RouterLink)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.4em;
    padding: 0.75rem 0.5rem;
    background: ${({ typecolor }) => typecolor ?? '#333'};
    border-radius: 10px;
    text-decoration: none;
    color: #fff;
    font-family: 'Russo One', sans-serif;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    box-shadow: 0 2px 8px rgba(0,0,0,0.4);

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 18px rgba(0,0,0,0.6);
        color: #fff;
    }
`;

export const TypeCardIcon = styled.span`
    font-size: 1.5rem;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
`;

// ── Effectiveness chart ────────────────────────────────────────────────────

export const ChartSection = styled.section`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 1300px;
    margin: 0 auto 3rem;
    overflow-x: auto;
`;

export const ChartTitle = styled.h2`
    font-family: 'Russo One', sans-serif;
    font-size: 1.3rem;
    color: #ffcc00;
    text-transform: uppercase;
    text-align: center;
    margin: 0 0 0.75rem;
`;

export const ChartSubtitle = styled.p`
    color: rgba(255,255,255,0.6);
    font-size: 0.82rem;
    text-align: center;
    margin: 0 0 1rem;
`;

export const ChartTable = styled.table`
    border-collapse: collapse;
    font-size: 0.65rem;
    min-width: 720px;
`;

export const ChartHeaderCell = styled.th`
    padding: 4px 2px;
    text-align: center;
    color: ${({ typecolor }) => typecolor ?? 'rgba(255,255,255,0.7)'};
    font-family: 'Russo One', sans-serif;
    font-size: 0.6rem;
    text-transform: uppercase;
    white-space: nowrap;
    vertical-align: bottom;
    letter-spacing: 0.03em;
    min-width: 36px;
`;

export const ChartRowLabel = styled.td`
    padding: 3px 6px 3px 0;
    color: ${({ typecolor }) => typecolor ?? 'rgba(255,255,255,0.7)'};
    font-family: 'Russo One', sans-serif;
    font-size: 0.65rem;
    text-transform: uppercase;
    white-space: nowrap;
    text-align: right;
    letter-spacing: 0.03em;
`;

function cellBg(mult) {
    if (mult === 2)   return 'rgba(76, 175, 80, 0.85)';
    if (mult === 0.5) return 'rgba(239, 83, 80, 0.75)';
    if (mult === 0)   return 'rgba(60, 60, 60, 0.9)';
    return 'rgba(30, 30, 30, 0.5)';
}

function cellColor(mult) {
    if (mult === 2)   return '#fff';
    if (mult === 0.5) return '#fff';
    if (mult === 0)   return 'rgba(255,255,255,0.3)';
    return 'rgba(255,255,255,0.15)';
}

export const ChartCell = styled.td`
    width: 36px;
    height: 36px;
    text-align: center;
    vertical-align: middle;
    background: ${({ mult }) => cellBg(mult)};
    color: ${({ mult }) => cellColor(mult)};
    font-weight: 700;
    font-size: 0.7rem;
    border: 1px solid rgba(255,255,255,0.06);
    transition: background 0.1s;

    &:hover {
        outline: 1px solid rgba(255,204,0,0.7);
        z-index: 1;
        position: relative;
    }
`;

export const ChartLegend = styled.div`
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin-top: 0.75rem;
    flex-wrap: wrap;
`;

export const LegendItem = styled.span`
    display: flex;
    align-items: center;
    gap: 0.4em;
    color: rgba(255,255,255,0.7);
    font-size: 0.8rem;
`;

export const LegendSwatch = styled.span`
    display: inline-block;
    width: 16px;
    height: 16px;
    border-radius: 3px;
    background: ${({ bg }) => bg};
    border: 1px solid rgba(255,255,255,0.2);
`;

export const ChartLabelLink = styled(RouterLink)`
    color: inherit;
    text-decoration: none;
    cursor: pointer;
    transition: color 0.15s ease;

    &:hover {
        color: #ffcc00;
        text-decoration: underline;
        text-underline-offset: 2px;
    }
`;
