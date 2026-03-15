import styled from 'styled-components';
import { colors } from '../../utils/theme';
import { Link as RouterLink } from 'react-router-dom';

export const AbilitySearchContainer = styled.div`
    width: 100%;
    max-width: 900px;
    padding: 0.5em 1.5em 1.5em;
`;

export const AbilitySearchInput = styled.input`
    width: 100%;
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
`;

export const AbilityTable = styled.div`
    width: 100%;
    max-width: 900px;
    margin-bottom: 4em;
`;

export const AbilityRow = styled(RouterLink)`
    display: grid;
    grid-template-columns: 220px 1fr;
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

    @media(max-width: 600px) {
        grid-template-columns: 1fr;
        gap: 0.3em;
    }
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
