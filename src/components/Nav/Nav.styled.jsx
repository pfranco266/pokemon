import styled from "styled-components";
import { colors } from "../../utils/theme";
import { Link as RouterLink } from 'react-router-dom';
import { MdOutlineShoppingCart } from "react-icons/md";

export const NavContainer = styled.div`
    width: 100%;
    min-height: 72px;
    background: #0a0a0a;
    color: #ffcc00;
    display: flex;
    justify-content: space-evenly;
    border-top: 3px solid #ffcc00;
    border-bottom: 3px solid #ffcc00;
    box-shadow: 0 4px 20px rgba(255, 204, 0, 0.25);
    @media(min-width: 2000px) {
        width: 100%;
        min-height: 5em;
    }
`;

export const NavBar = styled.nav`
    width: 100%;
    background: transparent;
    z-index: 1000;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
`;

export const Link = styled(RouterLink)`
    color: #ffcc00;
    position: relative;
    font-family: 'Russo One', sans-serif;
    font-size: 1.45rem;
    font-weight: normal;
    text-decoration: none;
    text-transform: uppercase;
    -webkit-text-stroke: 1px #000;
    text-shadow: 1px 1px 0px #000;
    padding: 6px 4px;
    border-bottom: 2px solid transparent;
    outline: none;
    transition: all 0.15s ease;

    &:hover {
        color: #ffffff;
        border-bottom-color: #ffcc00;
        text-shadow: 0 0 12px rgba(255, 204, 0, 0.8);
        -webkit-text-stroke: 0px transparent;
        text-decoration: none;
        transform: translateY(-2px);
    }

    @media(min-width: 2000px) {
        font-size: 2.2rem;
    }

    @media(max-width: 600px) {
        font-size: 1.1rem;
        padding: 4px 2px;
    }
`;

export const CartContainer = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.15s ease;

    &:hover svg {
        color: #ffffff;
        filter: drop-shadow(0 0 6px rgba(255, 204, 0, 0.8));
    }
`;

export const CartIcon = styled(MdOutlineShoppingCart)`
    height: 26px;
    width: 26px;
    color: #ffcc00;
    transition: all 0.15s ease;
    @media(max-width: 600px) {
        height: 22px;
        width: 22px;
        margin-right: 8px;
    }
`;

export const AmountContainer = styled.div`
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    top: -4px;
    left: 60%;
    border-radius: 10px;
    border: 1px solid #ffcc00;
    min-width: 16px;
    height: 16px;
    padding: 0 3px;
    background: #0a0a0a;
    @media(max-width: 600px) {
        top: -3px;
        left: 55%;
    }
`;

export const CartAmount = styled.span`
    color: #ffcc00;
    font-size: 0.72rem;
    font-family: 'Russo One', sans-serif;
    line-height: 1;
`;

// Pokemon nav dropdown
export const NavDropdownWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
`;

export const NavDropdownTrigger = styled.button`
    color: #ffcc00;
    position: relative;
    font-family: 'Russo One', sans-serif;
    font-size: 1.45rem;
    font-weight: normal;
    text-decoration: none;
    text-transform: uppercase;
    -webkit-text-stroke: 1px #000;
    text-shadow: 1px 1px 0px #000;
    padding: 6px 4px;
    border: none;
    border-bottom: 2px solid transparent;
    background: none;
    cursor: pointer;
    outline: none;
    transition: all 0.15s ease;

    &:hover {
        color: #ffffff;
        border-bottom-color: #ffcc00;
        text-shadow: 0 0 12px rgba(255, 204, 0, 0.8);
        -webkit-text-stroke: 0px transparent;
        transform: translateY(-2px);
    }

    @media(min-width: 2000px) {
        font-size: 2rem;
    }

    @media(max-width: 600px) {
        font-size: 1rem;
        padding: 4px 2px;
    }
`;

export const NavDropdown = styled.div`
    position: absolute;
    top: 100%;
    left: 0;
    padding-top: 5px; /* transparent bridge — keeps hover active between trigger and menu */
    min-width: 160px;
    background: #0a0a0a;
    border: 1px solid #ffcc00;
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    z-index: 9999;
    opacity: ${({ $isopen }) => $isopen ? 1 : 0};
    pointer-events: ${({ $isopen }) => $isopen ? 'all' : 'none'};
    transform: ${({ $isopen }) => $isopen ? 'translateY(0)' : 'translateY(-6px)'};
    transition: opacity 0.15s ease, transform 0.15s ease;
`;

export const NavDropdownItem = styled(RouterLink)`
    color: #ffcc00;
    font-family: 'Russo One', sans-serif;
    font-size: 1.1rem;
    text-transform: uppercase;
    text-decoration: none;
    padding: 10px 16px;
    border-bottom: 1px solid rgba(255, 204, 0, 0.2);
    transition: all 0.15s ease;

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        color: #ffffff;
        background: rgba(255, 204, 0, 0.08);
        text-shadow: 0 0 10px rgba(255, 204, 0, 0.7);
    }
`;

export const BrandText = styled.span`
    font-family: 'Russo One', sans-serif;
    font-size: 2rem;
    color: #ffcc00;
    -webkit-text-stroke: 1.5px #000;
    text-shadow: 2px 2px 0px #000;
`;
