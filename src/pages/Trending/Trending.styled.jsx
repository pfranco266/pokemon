import styled from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';

// ── Page heading ──────────────────────────────────────────────────────────────

export const TrendingPageTitle = styled.h1`
    font-family: 'Russo One', sans-serif;
    font-size: 3rem;
    color: #ffcc00;
    text-align: center;
    -webkit-text-stroke: 1.5px #000;
    text-shadow: 3px 3px 0px #000;
    margin-top: 2rem;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
`;

export const TrendingTitleLine = styled.div`
    width: 80px;
    height: 3px;
    background: #ffcc00;
    margin: 0.5rem auto 0.75rem;
`;

export const TrendingSubtitle = styled.p`
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.9rem;
    text-align: center;
    margin: 0 0 2rem;
`;

// ── States ────────────────────────────────────────────────────────────────────

export const LoadingText = styled.p`
    color: rgba(255, 204, 0, 0.6);
    font-size: 1rem;
    margin: 2em 0;
    text-align: center;
`;

export const EmptyText = styled.p`
    color: rgba(255, 255, 255, 0.5);
    font-size: 1rem;
    margin: 2em 0;
    text-align: center;
    font-style: italic;
`;

export const ErrorText = styled.p`
    color: rgba(255, 255, 255, 0.5);
    font-size: 1rem;
    margin: 2em 0;
    text-align: center;
`;

// ── List container ────────────────────────────────────────────────────────────

export const TrendingList = styled.div`
    width: 100%;
    max-width: 700px;
    background: #000;
    border: 2px solid #ffcc00;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 1.5rem;
`;

// ── Individual row ────────────────────────────────────────────────────────────

const RANK_COLORS = {
    1: '#ffcc00',
    2: '#C0C0C0',
    3: '#CD7F32',
};

export const TrendingRow = styled(RouterLink)`
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 1.25rem;
    border-bottom: 1px solid rgba(255, 204, 0, 0.15);
    border-left: 3px solid transparent;
    background: ${({ $rank, $iseven }) => {
        if ($rank === 1) return 'rgba(255,204,0,0.08)';
        return $iseven ? 'rgba(255,255,255,0.03)' : 'transparent';
    }};
    text-decoration: none;
    transition: all 0.15s ease;
    cursor: pointer;

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        border-left-color: #ffcc00;
        background: rgba(255, 255, 255, 0.05);
    }
`;

export const RankNumber = styled.span`
    font-family: 'Russo One', sans-serif;
    font-size: 1.5rem;
    color: ${({ $rank }) => RANK_COLORS[$rank] ?? '#ffcc00'};
    width: 2.5rem;
    flex-shrink: 0;
    text-align: center;
`;

export const PokemonSprite = styled.img`
    width: 48px;
    height: 48px;
    object-fit: contain;
    flex-shrink: 0;
    image-rendering: auto;
`;

export const PokemonName = styled.span`
    font-family: 'Russo One', sans-serif;
    font-size: 1.1rem;
    color: #ffcc00;
    flex: 1;
    text-transform: capitalize;
`;

export const VisitCount = styled.span`
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.6);
    white-space: nowrap;
    flex-shrink: 0;
`;

// ── Refresh button ────────────────────────────────────────────────────────────

export const RefreshButton = styled.button`
    font-family: 'Russo One', sans-serif;
    font-size: 0.9rem;
    color: #ffcc00;
    background: transparent;
    border: 2px solid rgba(255, 204, 0, 0.4);
    border-radius: 50px;
    padding: 0.45em 1.5em;
    cursor: pointer;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    transition: all 0.15s ease;
    margin-bottom: 3rem;

    &:hover {
        border-color: #ffcc00;
        background: rgba(255, 204, 0, 0.08);
        text-shadow: 0 0 10px rgba(255, 204, 0, 0.6);
    }

    &:active {
        transform: scale(0.97);
    }
`;
