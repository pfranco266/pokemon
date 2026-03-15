import styled from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';

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

export const GenBadge = styled.span`
    display: inline-block;
    margin: 0.75rem auto 2rem;
    padding: 0.3em 0.9em;
    border: 1px solid rgba(255, 204, 0, 0.5);
    border-radius: 999px;
    color: rgba(255, 204, 0, 0.8);
    font-size: 0.8rem;
    font-family: 'Russo One', sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.05em;
`;

export const DetailSection = styled.section`
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

export const DetailHeading = styled.h2`
    font-family: 'Russo One', sans-serif;
    font-size: 1.3rem;
    color: #ffcc00;
    text-transform: uppercase;
    margin: 0 0 0.75em 0;
    padding-bottom: 0.4em;
    border-bottom: 1px solid rgba(255, 204, 0, 0.25);
`;

export const DetailSubHeading = styled.h3`
    font-family: 'Russo One', sans-serif;
    font-size: 1rem;
    color: rgba(255, 204, 0, 0.75);
    text-transform: uppercase;
    margin: 1em 0 0.5em;
`;

export const DetailBody = styled.p`
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
    color: rgba(255, 255, 255, 0.87);
    text-decoration: none;
    font-size: 0.9rem;
    padding: 0.35em 0.5em;
    border-left: 3px solid transparent;
    text-transform: capitalize;
    transition: all 0.1s ease;

    &:hover {
        color: #ffcc00;
        border-left-color: #ffcc00;
        background: rgba(255, 204, 0, 0.06);
    }
`;
