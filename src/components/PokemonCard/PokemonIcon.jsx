import React from "react";

import colorMap from "../../utils/colorMap";


function PokemonIcon ({type}) {
    const IconComponent = colorMap[type]?.icon;

    return (
        <>
       {IconComponent ? <IconComponent /> : <p>No icon available</p>}
        </>
    )
}

export default PokemonIcon;