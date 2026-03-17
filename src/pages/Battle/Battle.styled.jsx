import styled, { keyframes, css } from 'styled-components';
import { Link } from 'react-router-dom';

// ── Page layout ──────────────────────────────────────────────────────────────
export const BattlePageWrapper = styled.div`
    min-height: 100vh;
    padding: 2rem 1rem 4rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
`;

export const BattlePageTitle = styled.h1`
    font-family: 'Russo One', sans-serif;
    font-size: clamp(2rem, 5vw, 3.5rem);
    color: #ffcc00;
    text-align: center;
    letter-spacing: 0.08em;
    text-shadow: 0 0 20px rgba(255, 204, 0, 0.4);
    margin: 0;
`;

export const BattleTitleLine = styled.div`
    width: clamp(160px, 40%, 320px);
    height: 2px;
    background: linear-gradient(90deg, transparent, #ffcc00, transparent);
    margin: 0 auto;
`;

// ── Selector panels ──────────────────────────────────────────────────────────
export const SelectorRow = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: 1.5rem;
    width: 100%;
    max-width: 1000px;

    @media (max-width: 700px) {
        flex-direction: column;
        align-items: center;
    }
`;

export const VsDivider = styled.div`
    font-family: 'Russo One', sans-serif;
    font-size: clamp(1.5rem, 3vw, 2.5rem);
    color: #ffcc00;
    text-shadow: 0 0 10px rgba(255, 204, 0, 0.5);
    align-self: center;
    flex-shrink: 0;
    min-width: 2ch;
    text-align: center;

    @media (max-width: 700px) {
        margin: -0.5rem 0;
    }
`;

export const SelectorPanel = styled.div`
    flex: 1;
    min-width: 0;
    max-width: 420px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 204, 0, 0.25);
    border-radius: 16px;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;

    @media (max-width: 700px) {
        width: 100%;
        max-width: 420px;
    }
`;

export const SelectorLabel = styled.p`
    font-family: 'Russo One', sans-serif;
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin: 0;
`;

// Search within panel
export const PanelSearchWrapper = styled.div`
    position: relative;
    width: 100%;
`;

export const PanelSearchInput = styled.input`
    width: 100%;
    padding: 0.6em 1em;
    border: 2px solid rgba(255, 204, 0, 0.4);
    border-radius: 8px;
    background: #1a1a2e;
    color: #ffffff;
    font-size: 0.95rem;
    font-family: 'Russo One', sans-serif;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.2s ease;

    &::placeholder { color: rgba(255, 255, 255, 0.35); }
    &:focus { border-color: #ffcc00; }
`;

const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
`;

export const PanelDropDown = styled.div`
    position: absolute;
    top: calc(100% + 2px);
    left: 0;
    width: 100%;
    background: #0a0a0a;
    border: 1px solid #ffcc00;
    border-radius: 8px;
    z-index: 200;
    max-height: 280px;
    overflow-y: auto;
    animation: ${fadeIn} 0.15s ease;
`;

export const PanelDropDownItem = styled.div`
    display: flex;
    align-items: center;
    gap: 0.6em;
    padding: 0.4em 0.75em;
    border-left: 3px solid transparent;
    border-bottom: 1px solid rgba(255, 204, 0, 0.08);
    cursor: pointer;
    transition: all 0.1s;

    &:last-child { border-bottom: none; }
    &:hover {
        background: rgba(255, 255, 255, 0.06);
        border-left-color: #ffcc00;
    }
`;

export const DropdownSprite = styled.img`
    width: 28px;
    height: 28px;
    object-fit: contain;
    flex-shrink: 0;
`;

export const DropdownName = styled.span`
    flex: 1;
    color: #ffcc00;
    font-size: 0.85rem;
    font-family: 'Russo One', sans-serif;
    text-transform: capitalize;
`;

export const DropdownNumber = styled.span`
    color: rgba(255, 255, 255, 0.35);
    font-size: 0.75rem;
    white-space: nowrap;
`;

// ── Selected Pokémon card within panel ───────────────────────────────────────
export const SelectedCard = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.6rem;
`;

export const SelectedArtwork = styled.img`
    width: clamp(100px, 18vw, 160px);
    height: clamp(100px, 18vw, 160px);
    object-fit: contain;
    filter: drop-shadow(0 4px 12px rgba(0,0,0,0.5));
`;

export const SelectedName = styled.h2`
    font-family: 'Russo One', sans-serif;
    font-size: clamp(1.1rem, 2vw, 1.5rem);
    color: #ffffff;
    text-transform: capitalize;
    margin: 0;
    text-align: center;
`;

export const TypeBadgesRow = styled.div`
    display: flex;
    gap: 0.5em;
    justify-content: center;
    flex-wrap: wrap;
`;

export const TypeBadge = styled.span`
    font-size: 0.75rem;
    font-weight: bold;
    color: #ffffff;
    text-transform: capitalize;
    padding: 0.25em 0.75em;
    border-radius: 999px;
    border: 1px solid ${({ $color }) => $color ?? 'rgba(255,255,255,0.4)'};
    background: ${({ $color }) => $color ? `${$color}33` : 'rgba(255,255,255,0.1)'};
`;

export const TierBadge = styled.span`
    font-size: 0.7rem;
    font-weight: bold;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${({ $color }) => $color ?? '#ffffff'};
    border: 1px solid ${({ $color }) => $color ?? '#ffffff'};
    border-radius: 4px;
    padding: 0.15em 0.5em;
    opacity: 0.9;
`;

export const StatsMini = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0.3rem 0.75rem;
    font-size: 0.78rem;
    color: rgba(255,255,255,0.75);
    width: 100%;
    padding: 0 0.5rem;
`;

export const StatMiniRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const StatMiniLabel = styled.span`
    color: rgba(255,255,255,0.45);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
`;

export const StatMiniValue = styled.span`
    font-weight: bold;
    color: #ffffff;
`;

export const EmptySlot = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: clamp(100px, 18vw, 160px);
    height: clamp(100px, 18vw, 160px);
    border: 2px dashed rgba(255, 204, 0, 0.25);
    border-radius: 12px;
    color: rgba(255, 255, 255, 0.25);
    font-size: 0.85rem;
    font-family: 'Russo One', sans-serif;
    text-align: center;
    gap: 0.5rem;
`;

// ── Battle button ────────────────────────────────────────────────────────────
const pulse = keyframes`
    0%, 100% { box-shadow: 0 0 0 0 rgba(255,204,0,0.4); }
    50%       { box-shadow: 0 0 0 12px rgba(255,204,0,0); }
`;

export const BattleButton = styled.button`
    font-family: 'Russo One', sans-serif;
    font-size: clamp(1.1rem, 2vw, 1.4rem);
    letter-spacing: 0.1em;
    color: #1a1a1a;
    background: #ffcc00;
    border: none;
    border-radius: 50px;
    padding: 0.75em 3em;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s;
    animation: ${pulse} 2s ease-in-out infinite;

    &:disabled {
        opacity: 0.35;
        cursor: not-allowed;
        animation: none;
    }

    &:not(:disabled):hover { transform: scale(1.04); }
    &:not(:disabled):active { transform: scale(0.97); }
`;

// ── Battle overlay animation ─────────────────────────────────────────────────
export const OverlayBackdrop = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.92);
    z-index: 9000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    padding: 2rem;
`;

export const OverlayTitle = styled.div`
    font-family: 'Russo One', sans-serif;
    font-size: clamp(1.2rem, 3vw, 2rem);
    color: #ffcc00;
    text-align: center;
    opacity: ${({ $visible }) => $visible ? 1 : 0};
    transition: opacity 0.4s ease;
`;

export const CombatantsRow = styled.div`
    display: flex;
    align-items: center;
    gap: 2rem;
    flex-wrap: wrap;
    justify-content: center;
`;

const floatIn = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
`;

export const CombatantSlot = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    animation: ${floatIn} 0.5s ease forwards;
`;

export const CombatantSprite = styled.img`
    width: clamp(80px, 14vw, 120px);
    height: clamp(80px, 14vw, 120px);
    object-fit: contain;
    filter: drop-shadow(0 0 8px rgba(255,204,0,0.3));
`;

export const CombatantName = styled.div`
    font-family: 'Russo One', sans-serif;
    font-size: 0.9rem;
    color: #ffffff;
    text-transform: capitalize;
    text-align: center;
`;

// ── Health bar ───────────────────────────────────────────────────────────────
export const HealthBarWrapper = styled.div`
    width: clamp(80px, 14vw, 130px);
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
`;

export const HealthLabel = styled.div`
    font-size: 0.65rem;
    color: rgba(255,255,255,0.55);
    text-transform: uppercase;
    letter-spacing: 0.06em;
`;

export const HealthTrack = styled.div`
    height: 8px;
    background: rgba(255,255,255,0.12);
    border-radius: 4px;
    overflow: hidden;
`;

export const HealthFill = styled.div`
    height: 100%;
    width: ${({ $pct }) => $pct}%;
    transition: width 1.5s linear;
    border-radius: 4px;
    background: ${({ $pct }) =>
        $pct > 40 ? '#4caf50' :
        $pct > 15 ? '#ff9800' :
        '#f44336'
    };
`;

export const OverlayVs = styled.div`
    font-family: 'Russo One', sans-serif;
    font-size: clamp(1.5rem, 3vw, 2.5rem);
    color: #ffcc00;
    text-shadow: 0 0 14px rgba(255,204,0,0.5);
    flex-shrink: 0;
`;

// ── Results panel ────────────────────────────────────────────────────────────
export const ResultsSection = styled.div`
    width: 100%;
    max-width: 750px;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
`;

export const WinnerBanner = styled.div`
    background: rgba(255, 204, 0, 0.08);
    border: 2px solid #ffcc00;
    border-radius: 16px;
    padding: 1.25rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    flex-wrap: wrap;
`;

export const WinnerSprite = styled.img`
    width: 90px;
    height: 90px;
    object-fit: contain;
    filter: drop-shadow(0 0 8px rgba(255,204,0,0.4));
`;

export const WinnerText = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
`;

export const WinnerLabel = styled.div`
    font-size: 0.75rem;
    color: rgba(255,255,255,0.5);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-family: 'Russo One', sans-serif;
`;

export const WinnerName = styled.div`
    font-family: 'Russo One', sans-serif;
    font-size: clamp(1.5rem, 3vw, 2.2rem);
    color: #ffcc00;
    text-transform: capitalize;
    text-shadow: 0 0 12px rgba(255,204,0,0.4);
`;

// ── Tabs ─────────────────────────────────────────────────────────────────────
export const TabRow = styled.div`
    display: flex;
    border-bottom: 1px solid rgba(255, 204, 0, 0.2);
`;

export const Tab = styled.button`
    font-family: 'Russo One', sans-serif;
    font-size: 0.9rem;
    letter-spacing: 0.06em;
    padding: 0.6em 1.5em;
    background: none;
    border: none;
    border-bottom: 2px solid ${({ $active }) => $active ? '#ffcc00' : 'transparent'};
    color: ${({ $active }) => $active ? '#ffcc00' : 'rgba(255,255,255,0.45)'};
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s;
    margin-bottom: -1px;

    &:hover { color: ${({ $active }) => $active ? '#ffcc00' : 'rgba(255,255,255,0.75)'}; }
`;

export const TabContent = styled.div`
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 204, 0, 0.15);
    border-top: none;
    border-radius: 0 0 12px 12px;
    padding: 1.25rem 1.5rem;
    min-height: 120px;
`;

// ── Narrative tab ────────────────────────────────────────────────────────────
export const NarrativeText = styled.p`
    color: rgba(255,255,255,0.85);
    font-size: 1rem;
    line-height: 1.8;
    margin: 0;
    white-space: pre-wrap;
`;

export const NarrativeLoading = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: rgba(255,255,255,0.5);
    font-size: 0.9rem;
    font-style: italic;
`;

const spin = keyframes`
    to { transform: rotate(360deg); }
`;

export const Spinner = styled.div`
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255,204,0,0.3);
    border-top-color: #ffcc00;
    border-radius: 50%;
    animation: ${spin} 0.7s linear infinite;
    flex-shrink: 0;
`;

// ── Breakdown tab ────────────────────────────────────────────────────────────
export const BreakdownGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;

    @media (max-width: 500px) {
        grid-template-columns: 1fr;
    }
`;

export const BreakdownCard = styled.div`
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 0.85rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
`;

export const BreakdownCardTitle = styled.div`
    font-family: 'Russo One', sans-serif;
    font-size: 0.8rem;
    color: rgba(255,255,255,0.45);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    text-transform: capitalize;
`;

export const BreakdownRow = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 0.85rem;
    color: rgba(255,255,255,0.75);
`;

export const BreakdownValue = styled.span`
    font-weight: bold;
    color: #ffffff;
`;

export const MultiplierBadge = styled.span`
    font-size: 0.75rem;
    font-weight: bold;
    color: ${({ $multi }) =>
        $multi >= 2 ? '#66bb6a' :
        $multi <= 0 ? '#ef5350' :
        $multi < 1 ? '#ffa726' :
        'rgba(255,255,255,0.55)'};
`;

// Pokémon name link — type-colored, gold glow on hover (matches /moves/:name list style)
export const PokemonNameLink = styled(Link)`
    color: ${({ $typecolor }) => $typecolor ?? '#ffcc00'};
    font-weight: 700;
    text-decoration: none;
    cursor: pointer;
    transition: color 0.15s, text-shadow 0.15s;

    &:hover {
        color: #ffcc00;
        text-shadow: 0 0 12px rgba(255, 204, 0, 0.8);
    }
`;

export const RegenerateButton = styled.button`
    font-family: 'Russo One', sans-serif;
    font-size: 0.8rem;
    letter-spacing: 0.06em;
    color: rgba(255,255,255,0.5);
    background: transparent;
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 50px;
    padding: 0.3em 1em;
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s;
    margin-top: 0.75rem;
    align-self: flex-start;

    &:hover {
        border-color: rgba(255,255,255,0.5);
        color: rgba(255,255,255,0.8);
    }
`;

// ── Stat breakdown (inside breakdown card) ───────────────────────────────────
export const StatBreakdownSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-top: 0.4rem;
    padding-top: 0.4rem;
    border-top: 1px solid rgba(255,255,255,0.08);
`;

export const StatBreakdownLabel = styled.span`
    font-size: 0.68rem;
    color: rgba(255,255,255,0.4);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    min-width: 2.8em;
`;

export const StatBreakdownRow = styled.div`
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.72rem;
`;

export const StatBreakdownTrack = styled.div`
    flex: 1;
    height: 5px;
    background: rgba(255,255,255,0.08);
    border-radius: 3px;
    overflow: hidden;
`;

export const StatBreakdownFill = styled.div`
    height: 100%;
    width: ${({ $pct }) => Math.min($pct, 100)}%;
    border-radius: 3px;
    background: ${({ $highlight }) => $highlight ? '#ffcc00' : 'rgba(255,255,255,0.3)'};
    transition: width 0.4s ease;
`;

export const StatBreakdownValue = styled.span`
    font-size: 0.68rem;
    color: ${({ $highlight }) => $highlight ? '#ffcc00' : 'rgba(255,255,255,0.45)'};
    font-weight: ${({ $highlight }) => $highlight ? '700' : '400'};
    min-width: 2.2em;
    text-align: right;
`;

// ── Suggested battles section ────────────────────────────────────────────────
export const SuggestionsSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 100%;
    max-width: 1000px;
`;

export const SuggestionsHeading = styled.h2`
    font-family: 'Russo One', sans-serif;
    font-size: 1.3rem;
    color: #ffcc00;
    text-align: center;
    letter-spacing: 0.08em;
    margin: 0;
`;

export const SuggestionsTitleLine = styled.div`
    width: clamp(100px, 25%, 200px);
    height: 1px;
    background: linear-gradient(90deg, transparent, #ffcc00, transparent);
    margin: -0.4rem auto 0;
`;

export const SuggestionsRow = styled.div`
    display: flex;
    gap: 1rem;
    width: 100%;
    justify-content: center;

    @media (max-width: 700px) {
        flex-direction: column;
        align-items: center;
    }
`;

export const SuggestionCard = styled.div`
    flex: 1;
    max-width: 300px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,204,0,0.3);
    border-radius: 8px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;

    &:hover {
        background: rgba(255,255,255,0.06);
        border-color: #ffcc00;
    }

    @media (max-width: 700px) {
        width: 100%;
        max-width: 420px;
    }
`;

export const SuggestionInner = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    width: 100%;
`;

export const SuggestionPoke = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.3rem;
    flex: 1;
    min-width: 0;
`;

export const SuggestionSprite = styled.img`
    width: 40px;
    height: 40px;
    object-fit: contain;
`;

export const SuggestionPokeName = styled.span`
    font-family: 'Russo One', sans-serif;
    font-size: 0.75rem;
    color: #ffcc00;
    text-transform: capitalize;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
`;

export const SuggestionVs = styled.span`
    font-family: 'Russo One', sans-serif;
    font-size: 0.9rem;
    color: #ffcc00;
    font-weight: bold;
    flex-shrink: 0;
`;

export const SuggestionCta = styled.span`
    font-size: 0.75rem;
    color: rgba(255,204,0,0.6);
    text-align: center;
`;

export const ShuffleButton = styled.button`
    font-family: 'Russo One', sans-serif;
    font-size: 0.8rem;
    letter-spacing: 0.08em;
    color: #ffcc00;
    background: transparent;
    border: 1px solid rgba(255,204,0,0.4);
    border-radius: 50px;
    padding: 0.35em 1.2em;
    cursor: pointer;
    transition: border-color 0.15s, text-shadow 0.15s, color 0.15s;

    &:hover {
        border-color: #ffcc00;
        text-shadow: 0 0 8px rgba(255,204,0,0.6);
    }
`;

export const PlayAgainButton = styled.button`
    font-family: 'Russo One', sans-serif;
    font-size: 1rem;
    letter-spacing: 0.08em;
    color: rgba(255,255,255,0.8);
    background: transparent;
    border: 1px solid rgba(255,255,255,0.25);
    border-radius: 50px;
    padding: 0.6em 2em;
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s;
    align-self: center;

    &:hover {
        border-color: #ffcc00;
        color: #ffcc00;
    }
`;
