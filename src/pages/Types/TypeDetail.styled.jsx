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

export const TypeBanner = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6em;
    width: 100%;
    max-width: 900px;
    padding: 1.25rem 2rem;
    margin: 1rem auto 1.5rem;
    background: ${({ typecolor }) => typecolor ?? '#333'};
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
`;

export const TypeBannerIcon = styled.span`
    display: flex;
    align-items: center;
    color: #fff;
    font-size: 2.5rem;
`;

export const TypeBannerName = styled.h1`
    font-family: 'Russo One', sans-serif;
    font-size: clamp(2rem, 5vw, 3rem);
    color: #fff;
    text-transform: uppercase;
    margin: 0;
    letter-spacing: 0.06em;
    text-shadow: 0 2px 8px rgba(0,0,0,0.4);
`;

export const EffectivenessSection = styled.section`
    width: 100%;
    max-width: 900px;
    background: #000;
    border: 2px solid #ffcc00;
    border-radius: 10px;
    padding: 1.5em 2em;
    margin-bottom: 1.5em;

    @media (max-width: 700px) {
        padding: 1em 1.25em;
    }
`;

export const SectionHeading = styled.h2`
    font-family: 'Russo One', sans-serif;
    font-size: 1.3rem;
    color: #ffcc00;
    text-transform: uppercase;
    margin: 0 0 0.75em 0;
    padding-bottom: 0.4em;
    border-bottom: 1px solid rgba(255, 204, 0, 0.25);
`;

export const SubHeading = styled.h3`
    font-family: 'Russo One', sans-serif;
    font-size: 0.9rem;
    color: rgba(255, 204, 0, 0.75);
    text-transform: uppercase;
    margin: 1em 0 0.5em;
`;

export const TypeBadgeRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5em;
    margin-bottom: 0.25em;
`;

export const EffBadge = styled(RouterLink)`
    display: inline-flex;
    align-items: center;
    gap: 0.3em;
    padding: 0.3em 0.75em;
    background: ${({ typecolor }) => typecolor ? `${typecolor}33` : 'rgba(255,255,255,0.08)'};
    border: 1px solid ${({ typecolor }) => typecolor ?? 'rgba(255,255,255,0.2)'};
    border-radius: 999px;
    color: ${({ typecolor }) => typecolor ?? '#fff'};
    font-family: 'Russo One', sans-serif;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    text-decoration: none;
    transition: all 0.15s ease;

    &:hover {
        background: ${({ typecolor }) => typecolor ? `${typecolor}55` : 'rgba(255,255,255,0.15)'};
        transform: translateY(-1px);
    }
`;

export const NoneLabel = styled.span`
    color: rgba(255,255,255,0.3);
    font-size: 0.85rem;
    font-style: italic;
`;

export const PokemonSection = styled.section`
    width: 100%;
    max-width: 900px;
    background: #000;
    border: 2px solid #ffcc00;
    border-radius: 10px;
    padding: 1.5em 2em;
    margin-bottom: 2em;

    @media (max-width: 700px) {
        padding: 1em 1.25em;
    }
`;

export const PokemonGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.25em 0.5em;

    @media (max-width: 700px) {
        grid-template-columns: repeat(2, 1fr);
    }
    @media (max-width: 400px) {
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

export const LoadingText = styled.p`
    color: rgba(255,255,255,0.6);
    font-size: 1rem;
    text-align: center;
    margin-top: 3rem;
`;
