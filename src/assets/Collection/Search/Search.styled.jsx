import styled from 'styled-components';


export const SearchInput = styled.input`
  padding: 10px;
  border: 4px solid #3b4cca;
  border-radius: 5px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: #007bff;
  }
  @media(max-width: 768px) {
    font-size: 14px;
    width: 80%;
  }
`;


export const SearchButton = styled.button`
padding: 10px;
border: 4px solid #3b4cca;
background-color: #ffcc00;
color: #3b4cca;
border-radius: 5px;
font-size: 16px;
font-weight: bold;
outline: none;
margin-left: 1em;
transition: border-color 0.3s ease;

&:focus {
  border-color: #007bff;
}
&: hover{
  cursor: pointer;
}

@media(max-width: 768px) {
  font-size: 14px;
  padding: 8px;
  margin-left: 0;

}

`


export const SearchForm = styled.form`
display: flex;
@media(max-width: 768px) {
  flex-direction: column;
  gap: 5px;
  align-items: center;


}
`

export const SearchWrapper = styled.div`
  display: flex;
  position: relative;

`

export const SearchDropDown = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 50%;
  top: 100%;
  background-color: white;
  z-index: 10;
  `
export const SearchDropDownItem = styled.p`
  z-index: 999;
  color: #242424;
  &:hover{
    background-color: #f1f1f1;
    cursor: pointer;
  }
`