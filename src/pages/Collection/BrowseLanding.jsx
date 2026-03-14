import React, { useState } from "react";
import BrowsePokemon from "./BrowsePokemon";
import { HomeContainer } from "../Home/Home.styled";

import { useNavigate } from "react-router-dom";
import FilterPokemon from "./FilterPokemon";
import { SearchFilterContainer } from "./Browse.styled"

import Search from "./Search/Search"

function BrowseLanding() {

  let navigate = useNavigate();


  const [searchTerm, setSearchTerm] = useState('')
  const [autoCompleteList, setAutoCompleteList] = useState([]);
  const [filteredTerms, setFilteredTerms] = useState([]);
  const [dropDown, setDropDown] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  function handleChange(event) {
    const query = event.target.value.toLowerCase()

    setSearchTerm(query);
    if (query.length > 1) {
      setDropDown(true);
      const filteredData = autoCompleteList && autoCompleteList.length ?
        autoCompleteList?.filter((name) => name.toLowerCase().indexOf(query) > -1)
        : []
        setFilteredTerms(filteredData)
    }
  }



  function handleSubmit(event) {
    if (event.target.value === undefined) {
      event.preventDefault();

    }


    navigate(`/collection/${searchTerm}`);

  }
  console.log('setSearchTerm in BrowseLanding:', setSearchTerm);



  return (
    <HomeContainer>
      <SearchFilterContainer>
        <Search dropDown={dropDown} setDropDown={setDropDown} setSearchTerm={setSearchTerm} filteredTerms={filteredTerms} handleSubmit={handleSubmit} searchTerm={searchTerm} handleChange={handleChange} />
        <FilterPokemon selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
      </SearchFilterContainer>
      <BrowsePokemon autoCompleteList={autoCompleteList} setAutoCompleteList={setAutoCompleteList} selectedOption={selectedOption} />
    </HomeContainer>
  )
}

export default BrowseLanding