import styled, { keyframes } from 'styled-components';
import { colors } from '../../../utils/theme';

const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0);    }
`;

export const SearchWrapper = styled.div`
    position: relative;
    width: 100%;
    max-width: 450px;
`;

export const SearchForm = styled.form`
    display: flex;
    width: 100%;
`;

export const SearchInput = styled.input`
    width: 100%;
    padding: 0.6em 1em;
    border: 4px solid ${colors.formBorder};
    border-radius: 5px;
    background: #1a1a2e;
    color: #ffffff;
    font-size: 1rem;
    font-family: 'Russo One', sans-serif;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.3s ease;

    &::placeholder {
        color: rgba(255, 255, 255, 0.4);
    }

    &:focus {
        border-color: #007bff;
    }

    @media(max-width: 768px) {
        font-size: 0.9rem;
    }
`;

export const SearchDropDown = styled.div`
    position: absolute;
    top: calc(100% + 2px);
    left: 0;
    width: 100%;
    background: #0a0a0a;
    border: 1px solid #ffcc00;
    border-radius: 5px;
    z-index: 1000;
    max-height: 400px;
    overflow-y: auto;
    animation: ${fadeIn} 0.15s ease;
`;

export const SearchDropDownItem = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75em;
    padding: 0.45em 0.75em;
    border-left: 3px solid transparent;
    border-bottom: 1px solid rgba(255, 204, 0, 0.08);
    cursor: pointer;
    transition: all 0.1s;

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background: rgba(255, 255, 255, 0.08);
        border-left-color: #ffcc00;
    }
`;

export const ResultSprite = styled.img`
    width: 32px;
    height: 32px;
    object-fit: contain;
    flex-shrink: 0;
`;

export const ResultName = styled.span`
    flex: 1;
    color: #ffcc00;
    font-size: 0.9rem;
    font-family: 'Russo One', sans-serif;
    text-transform: capitalize;
`;

export const ResultNumber = styled.span`
    color: rgba(255, 255, 255, 0.4);
    font-size: 0.8rem;
    white-space: nowrap;
`;

// Kept for external consumers that extend this component (e.g. AddtoCartButton in Pokemon.styled.jsx)
export const SearchButton = styled.button`
    padding: 10px;
    border: 4px solid ${colors.formBorder};
    background-color: #ffcc00;
    color: ${colors.formBorder};
    border-radius: 5px;
    font-size: 16px;
    font-weight: bold;
    outline: none;
    margin-left: 1em;
    transition: border-color 0.3s ease;

    &:focus { border-color: #007bff; }
    &:hover { cursor: pointer; }
`;
