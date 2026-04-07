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

// ── Section headings (battles page) ──────────────────────────────────────────

export const SectionTitle = styled.h2`
    font-family: 'Russo One', sans-serif;
    font-size: 1.3rem;
    color: #ffcc00;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin: 2rem 0 0.5rem;
    text-align: center;
    width: 100%;
    max-width: 700px;
`;

export const SectionLine = styled.div`
    width: 50px;
    height: 2px;
    background: rgba(255, 204, 0, 0.5);
    margin: 0 auto 1.25rem;
`;

// ── Time window toggle ────────────────────────────────────────────────────────

export const TimeToggleRow = styled.div`
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.75rem;
`;

export const TimeToggleBtn = styled.button`
    font-family: 'Russo One', sans-serif;
    font-size: 0.8rem;
    padding: 0.45em 1.25em;
    border-radius: 50px;
    cursor: pointer;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    transition: all 0.15s ease;
    background: ${({ $active }) => $active ? '#ffcc00' : 'transparent'};
    color: ${({ $active }) => $active ? '#000' : '#ffcc00'};
    border: 2px solid ${({ $active }) => $active ? '#ffcc00' : 'rgba(255,204,0,0.4)'};

    &:hover {
        border-color: #ffcc00;
        background: ${({ $active }) => $active ? '#ffe033' : 'rgba(255,204,0,0.08)'};
    }
`;

// ── Most Picked — extra cells ─────────────────────────────────────────────────

export const PickRightCol = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.15rem;
    flex-shrink: 0;
`;

export const PickCount = styled.span`
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.6);
    white-space: nowrap;
`;

export const WinCount = styled.span`
    font-size: 0.78rem;
    color: rgba(255, 204, 0, 0.6);
    white-space: nowrap;
`;

export const WinRateBadge = styled.span`
    font-family: 'Russo One', sans-serif;
    font-size: 0.7rem;
    padding: 0.1em 0.45em;
    border-radius: 4px;
    background: ${({ $rate }) => {
        if ($rate > 50) return 'rgba(76,175,80,0.15)';
        if ($rate < 50) return 'rgba(229,57,53,0.15)';
        return 'rgba(158,158,158,0.15)';
    }};
    border: 1px solid ${({ $rate }) => {
        if ($rate > 50) return '#4caf50';
        if ($rate < 50) return '#e53935';
        return '#9e9e9e';
    }};
    color: ${({ $rate }) => {
        if ($rate > 50) return '#4caf50';
        if ($rate < 50) return '#e53935';
        return '#9e9e9e';
    }};
`;

// ── Matchup rows ──────────────────────────────────────────────────────────────

export const MatchupRow = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
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

export const MatchupPoke = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.2rem;
    flex: 1;
    min-width: 0;
`;

export const MatchupPokeLink = styled.a`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.2rem;
    text-decoration: none;
    cursor: pointer;
`;

export const MatchupSprite = styled.img`
    width: 40px;
    height: 40px;
    object-fit: contain;
    flex-shrink: 0;
`;

export const MatchupPokeName = styled.span`
    font-family: 'Russo One', sans-serif;
    font-size: 0.78rem;
    color: #ffcc00;
    text-transform: capitalize;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 80px;
`;

export const MatchupVs = styled.span`
    font-family: 'Russo One', sans-serif;
    font-size: 0.85rem;
    color: #ffcc00;
    flex-shrink: 0;
`;

export const MatchupRight = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.15rem;
    flex-shrink: 0;
`;

export const MatchupCount = styled.span`
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.6);
    white-space: nowrap;
`;

export const MatchupWinLine = styled.span`
    font-size: 0.75rem;
    color: ${({ $decisive }) => $decisive ? '#ffcc00' : 'rgba(255,255,255,0.35)'};
    white-space: nowrap;
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
