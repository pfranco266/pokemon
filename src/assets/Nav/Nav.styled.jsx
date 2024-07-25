import styled from "styled-components";
import { Link as RouterLink } from 'react-router-dom';
import { MdOutlineShoppingCart } from "react-icons/md";
import { PiFlyingSaucerDuotone } from "react-icons/pi";



export const NavContainer = styled.div`
width: 100%; 
height: 100%;
background: #333; /* Dark background */
color: #fff; /* White text */
box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* Soft shadow for depth */
display: flex;
justify-content: space-evenly;
border-bottom: 2px solid yellow;
@media(min-width: 2000px) {
    width: 100%; 
    height: 5em;
}
`

export const NavBar = styled.nav`

width: 100%;
background: #333; 
color: #fff; 
box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* Soft shadow for depth */
z-index: 1000; /* Ensure it's above other content */
display: flex;
justify-content: space-evenly;
`
export const Link = styled(RouterLink)`
    color: white;
    position: relative;
    font-weight: bold;
    text-decoration: none;
    padding: 10px;
font-size: 1.25em;
outline: none;


    @media(min-width: 2000px) {
        font-size:  2em;
    }
    &:hover{
        background: #444; 
        border-radius: 10px;
        text-decoration: underline;

    }
        
    @media(max-width: 600px) {
    font-size: 1em;

    }
    
`
export const CartContainer = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
`

export const CartIcon = styled(MdOutlineShoppingCart)`
    height: 1.5em;
    width: 1.5em;
    @media(max-width: 600px) {
     height: 1.4em;
    width: 1.4em;
    margin-right: 8px;
}
`
export const AmountContainer = styled.div`
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 70%;
    left: 70%;
    border-radius: 50%;
    border: 2px solid #3b4cca;
    height: 100%;
    width: 100%;
    background: #ffcc00; 
        @media(max-width: 600px) {
    height: 1.1em;
    width: 1.1em;
     top: 60%;
    left: 60%;
}

    
`

export const CartAmount = styled.span`
    color: #3b4cca;


`
