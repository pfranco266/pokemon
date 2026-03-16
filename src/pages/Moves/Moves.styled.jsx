import styled from 'styled-components';
import { colors } from '../../utils/theme';
import { Link as RouterLink } from 'react-router-dom';

// ── Shared heading / layout ──────────────────────────────────────────────────

export const MovePageTitle = styled.h1`
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

export const MoveTitleLine = styled.div`
    width: 80px;
    height: 3px;
    background: #ffcc00;
    margin: 0.5rem auto 1.5rem;
`;

export const PageDescription = styled.p`
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.95rem;
    line-height: 1.6;
    text-align: center;
    max-width: 700px;
    margin: 0 auto 1.75rem;
    padding: 0 1rem;
`;

export const LoadingText = styled.p`
    color: rgba(255, 255, 255, 0.6);
    font-size: 1rem;
    margin: 1em 0;
`;

export const NoDescription = styled.span`
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.4);
    font-style: italic;
`;

// ── Search / Filter controls ──────────────────────────────────────────────────

export const FilterControlsRow = styled.div`
    width: 100%;
    max-width: 900px;
    padding: 0.5em 1.5em 1.5em;
    display: flex;
    gap: 0.75em;
    align-items: center;

    @media(max-width: 700px) {
        flex-direction: column;
    }
`;

export const MoveSearchInput = styled.input`
    flex: 1;
    min-width: 0;
    padding: 0.6em 1em;
    border: 4px solid ${colors.formBorder};
    border-radius: 5px;
    background: #1a1a2e;
    color: #ffffff;
    font-size: 1rem;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.3s ease;

    &::placeholder {
        color: rgba(255, 255, 255, 0.4);
    }

    &:focus {
        border-color: #007bff;
    }

    @media(max-width: 700px) {
        width: 100%;
    }
`;

export const FilterSelect = styled.select`
    width: 180px;
    flex-shrink: 0;
    padding: 0.6em 2.2em 0.6em 0.75em;
    border: 4px solid ${colors.formBorder};
    border-radius: 5px;
    background: #1a1a2e;
    color: #ffffff;
    font-size: 1rem;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.3s ease;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23ffcc00' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.65em center;
    cursor: pointer;

    &:focus {
        border-color: #007bff;
    }

    option {
        background: #1a1a2e;
        color: #ffffff;
    }

    @media(max-width: 700px) {
        width: 100%;
    }
`;

export const NoMovesText = styled.p`
    color: rgba(255, 255, 255, 0.45);
    font-size: 1rem;
    margin: 2em 0;
    text-align: center;
`;

// ── Type / Class badges (shared listing + detail) ─────────────────────────────

export const TypeBadge = styled.span`
    display: inline-block;
    padding: 0.2em 0.55em;
    border-radius: 4px;
    background: ${({ typecolor }) => typecolor ? `${typecolor}22` : 'rgba(255,255,255,0.08)'};
    border: 1px solid ${({ typecolor }) => typecolor ?? 'rgba(255,255,255,0.3)'};
    color: ${({ typecolor }) => typecolor ?? 'rgba(255,255,255,0.7)'};
    font-size: 0.75rem;
    font-family: 'Russo One', sans-serif;
    text-transform: capitalize;
    white-space: nowrap;
`;

const CLASS_STYLES = {
    physical: { bg: 'rgba(230,81,0,0.15)', border: '#e65100', text: '#ff8a50' },
    special:  { bg: 'rgba(59,76,202,0.15)', border: '#3b4cca', text: '#7986cb' },
    status:   { bg: 'rgba(117,117,117,0.15)', border: '#757575', text: '#9e9e9e' },
};

export const ClassBadge = styled.span`
    display: inline-block;
    padding: 0.2em 0.55em;
    border-radius: 4px;
    background: ${({ damageclass }) => CLASS_STYLES[damageclass]?.bg ?? 'rgba(255,255,255,0.08)'};
    border: 1px solid ${({ damageclass }) => CLASS_STYLES[damageclass]?.border ?? 'rgba(255,255,255,0.3)'};
    color: ${({ damageclass }) => CLASS_STYLES[damageclass]?.text ?? 'rgba(255,255,255,0.7)'};
    font-size: 0.75rem;
    font-family: 'Russo One', sans-serif;
    text-transform: capitalize;
    white-space: nowrap;
`;

// ── Table ─────────────────────────────────────────────────────────────────────

// Columns: Name | Type | Power | Gen | Effect
const GRID_FULL   = '200px 80px 80px 110px 1fr';
const GRID_700    = '200px 80px 80px 110px';
const GRID_500    = '1fr 80px 80px';

export const MoveTable = styled.div`
    width: 100%;
    max-width: 950px;
    margin-bottom: 4em;
`;

const sharedRowGrid = `
    display: grid;
    grid-template-columns: ${GRID_FULL};
    align-items: center;
    gap: 0 1rem;
    padding: 0.55em 1em;

    @media(max-width: 700px) { grid-template-columns: ${GRID_700}; }
    @media(max-width: 500px) { grid-template-columns: ${GRID_500}; }
`;

export const MoveHeaderRow = styled.div`
    ${sharedRowGrid}
    border-bottom: 2px solid rgba(255, 204, 0, 0.4);
    margin-bottom: 0.25em;
`;

export const MoveRow = styled(RouterLink)`
    ${sharedRowGrid}
    border-bottom: 1px solid rgba(255, 204, 0, 0.12);
    border-left: 3px solid transparent;
    background: ${({ iseven }) => iseven ? 'rgba(255,255,255,0.03)' : 'transparent'};
    text-decoration: none;
    transition: all 0.12s ease;
    cursor: pointer;

    &:hover {
        border-left-color: #ffcc00;
        background: rgba(255, 204, 0, 0.06);
    }
`;

// ── Column cells ──────────────────────────────────────────────────────────────

export const ColHeader = styled.span`
    font-family: 'Russo One', sans-serif;
    font-size: 0.7rem;
    color: ${({ active }) => active ? '#ffcc00' : 'rgba(255, 204, 0, 0.7)'};
    text-transform: uppercase;
    letter-spacing: 0.06em;
    cursor: ${({ sortable }) => sortable ? 'pointer' : 'default'};
    user-select: none;
    transition: color 0.15s;

    &:hover {
        color: ${({ sortable, active }) => (sortable || active) ? '#ffcc00' : 'rgba(255, 204, 0, 0.7)'};
    }
`;

export const MoveNameCell = styled.span`
    font-family: 'Russo One', sans-serif;
    font-size: 0.9rem;
    color: #ffcc00;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const MoveTypeCell = styled.span`
    text-align: center;
`;

export const MoveClassCell = styled.span``;

export const MovePowerCell = styled.span`
    font-size: 0.88rem;
    color: rgba(255, 255, 255, 0.87);
    text-align: center;
`;

export const MoveAccCell = styled.span`
    font-size: 0.88rem;
    color: rgba(255, 255, 255, 0.87);
    text-align: right;
`;

export const MovePPCell = styled.span`
    font-size: 0.88rem;
    color: rgba(255, 255, 255, 0.87);
    text-align: right;
`;

export const MoveGenCell = styled.span`
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.5);
    text-transform: capitalize;
    text-align: center;

    @media(max-width: 500px) { display: none; }
`;

export const MoveEffectCell = styled.span`
    font-size: 0.83rem;
    color: rgba(255, 255, 255, 0.7);
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;

    @media(max-width: 700px) { display: none; }
`;

// Col header visibility mirrors data cells
export const ColHeaderPower = styled(ColHeader)`
    text-align: center;
`;
export const ColHeaderAcc = styled(ColHeader)`
    text-align: right;
`;
export const ColHeaderPP = styled(ColHeader)`
    text-align: right;
`;
export const ColHeaderGen = styled(ColHeader)`
    text-align: center;
    @media(max-width: 500px) { display: none; }
`;
export const ColHeaderEffect = styled(ColHeader)`
    @media(max-width: 700px) { display: none; }
`;

// ── Detail page ───────────────────────────────────────────────────────────────

export const BackLink = styled(RouterLink)`
    align-self: flex-start;
    margin: 1.5rem 0 0 1.5rem;
    color: #ffcc00;
    font-family: 'Russo One', sans-serif;
    font-size: 0.9rem;
    text-decoration: none;
    text-transform: uppercase;
    transition: all 0.15s ease;

    &:hover {
        color: #ffffff;
        text-shadow: 0 0 12px rgba(255, 204, 0, 0.8);
    }
`;

export const BadgeRow = styled.div`
    display: flex;
    gap: 0.75em;
    justify-content: center;
    margin-bottom: 1.5rem;
`;

export const StatBlockRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 1em;
    justify-content: center;
    width: 100%;
    max-width: 900px;
    margin-bottom: 1.5rem;
`;

export const StatBlock = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.3em;
    background: #000;
    border: 2px solid #ffcc00;
    border-radius: 10px;
    padding: 0.85em 1.5em;
    min-width: 100px;
`;

export const StatBlockValue = styled.span`
    font-family: 'Russo One', sans-serif;
    font-size: 1.5rem;
    color: ${({ typecolor }) => typecolor ?? '#ffcc00'};
    text-align: center;
`;

export const StatBlockLabel = styled.span`
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.55);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-family: 'Russo One', sans-serif;
    white-space: nowrap;
`;

export const MoveDetailSection = styled.section`
    width: 100%;
    max-width: 900px;
    background: #000;
    border: 2px solid #ffcc00;
    border-radius: 10px;
    padding: 1.5em 2em;
    margin-bottom: 1.5em;

    @media(max-width: 700px) {
        padding: 1em 1.25em;
    }
`;

export const MoveDetailHeading = styled.h2`
    font-family: 'Russo One', sans-serif;
    font-size: 1.3rem;
    color: #ffcc00;
    text-transform: uppercase;
    margin: 0 0 0.75em 0;
    padding-bottom: 0.4em;
    border-bottom: 1px solid rgba(255, 204, 0, 0.25);
`;

export const MoveDetailBody = styled.p`
    color: rgba(255, 255, 255, 0.87);
    font-size: 1rem;
    line-height: 1.6;
    margin: 0;
`;

export const FlavorRow = styled.div`
    display: grid;
    grid-template-columns: 180px 1fr;
    gap: 0.75em;
    padding: 0.6em 0;
    border-bottom: 1px solid rgba(255, 204, 0, 0.1);

    &:last-child {
        border-bottom: none;
    }

    @media(max-width: 600px) {
        grid-template-columns: 1fr;
        gap: 0.25em;
    }
`;

export const VersionBadge = styled.span`
    display: inline-block;
    align-self: flex-start;
    padding: 0.2em 0.6em;
    background: rgba(255, 204, 0, 0.1);
    border: 1px solid rgba(255, 204, 0, 0.3);
    border-radius: 4px;
    color: #ffcc00;
    font-family: 'Russo One', sans-serif;
    font-size: 0.72rem;
    text-transform: uppercase;
    white-space: nowrap;
`;

export const FlavorText = styled.span`
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
    line-height: 1.5;
`;

export const PokemonList = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.25em 0.5em;

    @media(max-width: 700px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media(max-width: 400px) {
        grid-template-columns: 1fr;
    }
`;

export const PokemonEntry = styled(RouterLink)`
    color: ${({ typecolor }) => typecolor ?? 'rgba(255, 255, 255, 0.87)'};
    font-weight: 700;
    text-decoration: none;
    font-size: 0.9rem;
    padding: 0.35em 0.5em;
    border-left: 3px solid transparent;
    text-transform: capitalize;
    transition: all 0.1s ease;

    &:hover {
        color: #ffcc00;
        text-shadow: 0 0 12px rgba(255, 204, 0, 0.8);
        border-left-color: #ffcc00;
        background: rgba(255, 204, 0, 0.06);
    }
`;
