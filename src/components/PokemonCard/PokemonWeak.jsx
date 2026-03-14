import React from "react"
import colorMap from "../../utils/colorMap";
import PokemonIcon from "./PokemonIcon"


function PokemonWeak ({type1=undefined, type2 = undefined,  resist, weak}) {

    function typeMap(type1, type2 = null) {
        const selectedType1 = colorMap[type1]?.typeChart;
        const strengthWeakness = {
          resistance: [],
          weakness: [],
        };
      
        for (let val in selectedType1) {
          if (selectedType1[val] === 0.5 && strengthWeakness.resistance.length <= 10) {
            strengthWeakness.resistance.push(val);
          }
      
          if (selectedType1[val] === 2 && strengthWeakness.weakness.length <= 10) {
            strengthWeakness.weakness.push(val);
          }
        }
      
        if (type2 !== null) {
          const selectedType2 = colorMap[type2].typeChart;
          for (let val in selectedType2) {
            if (selectedType2[val] === 0.5 && strengthWeakness.resistance.length <= 10) {
              strengthWeakness.resistance.push(val);
            }
      
            if (selectedType2[val] === 2 && strengthWeakness.weakness.length <= 10) {
              strengthWeakness.weakness.push(val);
            }
          }
        }
      
        return strengthWeakness;
      }

      const typeValues = typeMap(type1, type2);
      const typeResistSet = new Set(typeValues.resistance);
      const typeWeaknessSet = new Set(typeValues.weakness);

    //   console.log(type1, 'res', typeResistSet)
    //   console.log(type2, 'wea', typeWeaknessSet)


    return (
        <div>
           <>
            {resist && typeResistSet?.size  > 0 ? Array.from(typeResistSet).map(type=> {
                return (
                    <PokemonIcon key={type} type={type}/>
                )
            }) : null}
            {weak && typeWeaknessSet?.size > 0 ? Array.from(typeWeaknessSet).map(type=> {
                return  (
                    <PokemonIcon key={type} type={type}/>
                )
            }) : null}

            </>
        </div>
    )
}

export default PokemonWeak