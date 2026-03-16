import React, { useEffect, useState } from 'react';
import {
    ToastSlideInRight,
    ToastSlideOutRight,
    ToastSlideInLeft,
    ToastSlideOutLeft,
    SpinningPokeballSVG,
    ChooseYouText,
    ToastPokemonName,
} from './PokeballTransition.styled';

const PokeballSVG = () => (
    <SpinningPokeballSVG viewBox="0 0 100 100" width="70" height="70">
        <path d="M 5 50 A 45 45 0 0 1 95 50 Z" fill="#CC0000" />
        <path d="M 5 50 A 45 45 0 0 0 95 50 Z" fill="#FFFFFF" />
        <circle cx="50" cy="50" r="45" fill="none" stroke="#000000" strokeWidth="3" />
        <line x1="5" y1="50" x2="95" y2="50" stroke="#000000" strokeWidth="3" />
        <circle cx="50" cy="50" r="12" fill="#000000" />
        <circle cx="50" cy="50" r="8" fill="#FFFFFF" />
    </SpinningPokeballSVG>
);

// phase 1: slide in (0–300ms)
// phase 2: hold + navigate fires (300–900ms)
// phase 3: slide out (900–1200ms), then onComplete

function PokeballTransition({ targetName, direction, onNavigate, onComplete }) {
    const [phase, setPhase] = useState(1);

    useEffect(() => {
        const t1 = setTimeout(() => {
            setPhase(2);
            onNavigate();
        }, 300);

        const t2 = setTimeout(() => {
            setPhase(3);
        }, 900);

        const t3 = setTimeout(() => {
            onComplete();
        }, 1200);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, []);

    const isRight = direction === 'right';
    const CardComponent = phase === 3
        ? (isRight ? ToastSlideOutRight : ToastSlideOutLeft)
        : (isRight ? ToastSlideInRight : ToastSlideInLeft);

    return (
        <CardComponent>
            <PokeballSVG />
            <ChooseYouText>I choose you!</ChooseYouText>
            <ToastPokemonName>{targetName || '...'}</ToastPokemonName>
        </CardComponent>
    );
}

export default PokeballTransition;
