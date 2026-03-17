// Reserved for use in Pokemon detail info section

import React from 'react';
import styled, { keyframes } from 'styled-components';

const sparkleFloat = keyframes`
    0%   { transform: translateY(0) scale(1);      opacity: 1; }
    100% { transform: translateY(-40px) scale(0.3); opacity: 0; }
`;

const Wrapper = styled.div`
    position: relative;
    display: inline-block;
`;

const BadgeText = styled.span`
    color: #ffcc00;
    -webkit-text-fill-color: #ffcc00;
    text-shadow: 0 0 8px rgba(255, 204, 0, 0.8), 0 0 20px rgba(255, 204, 0, 0.4);
    font-weight: 900;
    white-space: nowrap;
`;

const Particle = styled.span`
    position: absolute;
    color: #ffcc00;
    animation-name: ${sparkleFloat};
    animation-timing-function: ease-out;
    animation-iteration-count: infinite;
    pointer-events: none;
    user-select: none;
    line-height: 1;
`;

const SPARKLES = [
    { left: '-12%', top: '50%',  size: 8,  delay: 0,    duration: 1.5 },
    { left: '5%',   top: '-30%', size: 6,  delay: 0.3,  duration: 1.8 },
    { left: '25%',  top: '-20%', size: 10, delay: 0.6,  duration: 1.4 },
    { left: '50%',  top: '-35%', size: 7,  delay: 0.9,  duration: 1.7 },
    { left: '75%',  top: '-15%', size: 12, delay: 1.2,  duration: 1.5 },
    { left: '100%', top: '30%',  size: 9,  delay: 0.15, duration: 1.6 },
    { left: '90%',  top: '-25%', size: 6,  delay: 0.75, duration: 2.0 },
    { left: '15%',  top: '80%',  size: 8,  delay: 1.0,  duration: 1.3 },
    { left: '-5%',  top: '20%',  size: 11, delay: 0.45, duration: 1.9 },
    { left: '60%',  top: '70%',  size: 7,  delay: 0.6,  duration: 1.5 },
];

function SparkleBadge({ label, active }) {
    if (!active) return null;
    return (
        <Wrapper>
            <BadgeText>{label}</BadgeText>
            {SPARKLES.map((s, i) => (
                <Particle
                    key={i}
                    style={{
                        left: s.left,
                        top: s.top,
                        fontSize: `${s.size}px`,
                        animationDuration: `${s.duration}s`,
                        animationDelay: `${s.delay}s`,
                    }}
                >
                    ✦
                </Particle>
            ))}
        </Wrapper>
    );
}

export default SparkleBadge;
