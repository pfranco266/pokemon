import React from "react";
import colorMap from "../../utils/colorMap";
import PokemonTypes from "./PokemonTypes";
import {ColorFilterContainer} from './Browse.styled'

function SearchByType () {
    const colorTypesArray = [];
    for (const [key, value] of Object.entries(colorMap)) {
        colorTypesArray.push({
            type: {
                name: key,
            },
        })
      }

      console.log(colorMap, colorTypesArray)
    return (
        <ColorFilterContainer>
            {colorTypesArray && colorTypesArray?.map((type, index) => {
                return (
                    <PokemonTypes key={index} types={colorTypesArray}/>
                )
            })}
        </ColorFilterContainer>
    )



}

export default SearchByType;