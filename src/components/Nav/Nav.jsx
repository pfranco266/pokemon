import React, {useContext} from "react";
import { Link, NavContainer, NavBar, } from "./Nav.styled";
import CartContext from "../../context/CartContext";
import Cart from "./CartIcon"



function Nav() {

    const { totalAmount } = useContext(CartContext);

    return (
        <NavContainer>
            <NavBar>
                <Link aria-label="Home" to='/'>Home </Link>
                <Link aria-label="Browse Pokemon" to="/collection">Pokemon
                </Link>

                <Link aria-label="Pokemon Cards" to="/pokemoncards">Pokemon Cards</Link>

                <Link aria-label="Cart" to="/cart">
                    <Cart amount={totalAmount}/>

                </Link>
            </NavBar>
        </NavContainer>
    )
}

export default Nav;