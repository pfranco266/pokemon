import styled from "styled-components";

export const FooterContainer = styled.footer`
    width: 100%;
    display: flex;
    justify-content: flex-end; /* Align items to the right */
    background: #333; 
    box-sizing: border-box;
    padding: .5em 0;
    @media(max-width: 768px) {

    }
    `;

    export const FooterText = styled.p`
    margin-left: 1em;
    @media(max-width: 1012px) {
        font-size: 14px;
    }
    @media(max-width: 768px) {
        font-size: 10px;
        

    }
    `



export const FooterTextContainer = styled.div`
    display: flex; /* Ensure this container is a flex container */
    width: 100%;
    height: 100%;
`;

export const FooterIconContainer = styled.div`
display: flex; /* Ensure this container is a flex container */
align-items: flex-end; /* Align items to the baseline */
justify-content: flex-end; /* Align items to the right */

gap: 1em 2em;
margin-right: 2em;
width: 100%;
height: 100%;
`;

export const SocialsIcons = styled.img`
    width: 3em;
    height: 3em;
    &:hover {
        background: #444; 
        border-radius: 10px;

      }
      @media(max-width: 650px){
        width: 2em;
        height: 2em;
      }

`;
