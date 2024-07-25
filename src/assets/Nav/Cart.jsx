import React from "react";

import {CartContainer, CartIcon, CartAmount, AmountContainer} from './Nav.styled';



function Cart({amount}) {
    return (
        <CartContainer>
            <CartIcon />
            {amount > 0 &&
            <AmountContainer>

                 <CartAmount>{amount }</CartAmount>
            </AmountContainer>}
        </CartContainer>
    )
}

export default Cart;