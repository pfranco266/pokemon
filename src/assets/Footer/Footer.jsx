import React from "react";
import {FooterContainer, FooterTextContainer, FooterIconContainer,FooterText, SocialsIcons} from "./Footer.styled"
import linkedin from "../../../public/icons8-linkedin.svg"
import github from "../../../public/iconmonstr-github-1.svg"
import code from "../../../public/code-slash-svgrepo-com.svg"
import { FaCode } from "react-icons/fa";
import { Link } from "react-router-dom";


function Footer () {

    const date = new Date();
    const year = date.getFullYear();

    return(
        <FooterContainer>
            <FooterTextContainer>
            <FooterText>All rights reserved &#169;{year}. Created and implemented by Phil Franco, using React + Vite & Styled-Components.</FooterText>
            </FooterTextContainer>
            <FooterIconContainer>

                <Link to={'https://www.linkedin.com/in/philfranco/'}>
                <SocialsIcons src={linkedin} alt="LinkedIn Icon"/> 
                </Link>
                <Link to={'https://github.com/pfranco266/'}>
                <SocialsIcons src={github} alt="Github Icon"/> 
                </Link>
                <Link to={'https://pfranco266.github.io/Portfolio/'}>
                <SocialsIcons  src={code} alt="Portfolio Code"/> 
                </Link>

            </FooterIconContainer>
        </FooterContainer>
    )
}

export default Footer

const arr = [0, 4, 2, 4, 55, 2];

const sliced = arr.splice(0, 3)

function arrSplit (arr, size) {

    if(arr.length < size) return arr; 

    const arrayOfArrays = []; 

    const sliced = arrSplit(arr.slice(0, size))
    arrayOfArrays.push(sliced);


    return arrayOfArrays
}