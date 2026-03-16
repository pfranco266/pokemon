import styled from 'styled-components';
import { colors } from '../../utils/theme';
import { Link as RouterLink } from 'react-router-dom';

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

export const AbilitySearchInput = styled.input`
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

export const NoAbilitiesText = styled.p`
    color: rgba(255, 255, 255, 0.45);
    font-size: 1rem;
    margin: 2em 0;
    text-align: center;
`;

export const AbilityTable = styled.div`
    width: 100%;
    max-width: 900px;
    margin-bottom: 4em;
`;

const ABILITY_GRID_FULL = '220px 140px 1fr';
const ABILITY_GRID_500  = '220px 1fr';

export const AbilityHeaderRow = styled.div`
    display: grid;
    grid-template-columns: ${ABILITY_GRID_FULL};
    padding: 0.55em 1em;
    border-bottom: 2px solid rgba(255, 204, 0, 0.4);
    margin-bottom: 0.25em;

    @media(max-width: 500px) { grid-template-columns: ${ABILITY_GRID_500}; }
`;

export const AbilityColHeader = styled.span`
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

export const AbilityColHeaderGen = styled(AbilityColHeader)`
    @media(max-width: 500px) { display: none; }
`;

export const AbilityRow = styled(RouterLink)`
    display: grid;
    grid-template-columns: ${ABILITY_GRID_FULL};
    padding: 0.75em 1em;
    border-bottom: 1px solid rgba(255, 204, 0, 0.15);
    border-left: 3px solid transparent;
    background: ${({ iseven }) => iseven ? 'rgba(255,255,255,0.03)' : 'transparent'};
    text-decoration: none;
    transition: all 0.12s ease;
    cursor: pointer;

    &:hover {
        border-left-color: #ffcc00;
        background: rgba(255, 204, 0, 0.06);
    }

    @media(max-width: 500px) { grid-template-columns: ${ABILITY_GRID_500}; }
`;

export const AbilityName = styled.span`
    font-family: 'Russo One', sans-serif;
    font-size: 0.95rem;
    color: #ffcc00;
`;

export const AbilityEffect = styled.span`
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.4;
`;

export const AbilityGenCell = styled.span`
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.5);
    text-transform: capitalize;
    align-self: center;

    @media(max-width: 500px) { display: none; }
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

export const AbilityPageTitle = styled.h1`
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

export const AbilityTitleLine = styled.div`
    width: 80px;
    height: 3px;
    background: #ffcc00;
    margin: 0.5rem auto 1.5rem;
`;

export const NoDescription = styled.span`
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.4);
    font-style: italic;
`;

export const LoadingText = styled.p`
    color: rgba(255, 255, 255, 0.6);
    font-size: 1rem;
    margin: 1em 0;
`;
