import styled, { keyframes } from 'styled-components';

const slideInFromRight = keyframes`
    from { transform: translateY(-50%) translateX(120%); }
    to   { transform: translateY(-50%) translateX(0); }
`;

const slideOutToRight = keyframes`
    from { transform: translateY(-50%) translateX(0); }
    to   { transform: translateY(-50%) translateX(120%); }
`;

const slideInFromLeft = keyframes`
    from { transform: translateY(-50%) translateX(-120%); }
    to   { transform: translateY(-50%) translateX(0); }
`;

const slideOutToLeft = keyframes`
    from { transform: translateY(-50%) translateX(0); }
    to   { transform: translateY(-50%) translateX(-120%); }
`;

export const spin = keyframes`
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
`;

const ToastCardBase = styled.div`
    position: fixed;
    top: 50%;
    z-index: 9999;
    background: rgba(10, 10, 10, 0.92);
    border: 2px solid #ffcc00;
    border-radius: 16px;
    padding: 1.5rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    pointer-events: none;
    min-width: 150px;
`;

export const ToastSlideInRight = styled(ToastCardBase)`
    right: 2rem;
    animation: ${slideInFromRight} 0.3s ease-out forwards;
`;

export const ToastSlideOutRight = styled(ToastCardBase)`
    right: 2rem;
    animation: ${slideOutToRight} 0.3s ease-in forwards;
`;

export const ToastSlideInLeft = styled(ToastCardBase)`
    left: 2rem;
    animation: ${slideInFromLeft} 0.3s ease-out forwards;
`;

export const ToastSlideOutLeft = styled(ToastCardBase)`
    left: 2rem;
    animation: ${slideOutToLeft} 0.3s ease-in forwards;
`;

export const SpinningPokeballSVG = styled.svg`
    animation: ${spin} 0.6s linear infinite;
    flex-shrink: 0;
`;

export const ChooseYouText = styled.p`
    color: #ffffff;
    font-style: italic;
    font-size: 0.9rem;
    margin: 0;
`;

export const ToastPokemonName = styled.p`
    color: #ffcc00;
    font-family: 'Russo One', sans-serif;
    font-size: clamp(1.5rem, 2.5vw, 2.2rem);
    margin: 0;
    text-align: center;
    text-transform: capitalize;
    white-space: nowrap;
`;
