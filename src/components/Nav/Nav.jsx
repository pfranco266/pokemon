import React, { useContext, useState } from "react";
import { Link, NavContainer, NavBar, NavDropdownWrapper, NavDropdownTrigger, NavDropdown, NavDropdownItem } from "./Nav.styled";
import CartContext from "../../context/CartContext";
import Cart from "./CartIcon";

function Nav() {
    const { totalAmount } = useContext(CartContext);
    const [pokemonOpen, setPokemonOpen] = useState(false);

    return (
        <NavContainer>
            <NavBar>
                <Link aria-label="Home" to='/'>Home</Link>

                <NavDropdownWrapper
                    onMouseEnter={() => setPokemonOpen(true)}
                    onMouseLeave={() => setPokemonOpen(false)}
                >
                    <NavDropdownTrigger
                        onClick={() => setPokemonOpen(o => !o)}
                        aria-expanded={pokemonOpen}
                        aria-haspopup="true"
                    >
                        Pokémon ▾
                    </NavDropdownTrigger>
                    <NavDropdown isopen={pokemonOpen ? 1 : 0}>
                        <NavDropdownItem to="/collection" onClick={() => setPokemonOpen(false)}>
                            Pokémon
                        </NavDropdownItem>
                        <NavDropdownItem to="/abilities" onClick={() => setPokemonOpen(false)}>
                            Abilities
                        </NavDropdownItem>
                        <NavDropdownItem to="/moves" onClick={() => setPokemonOpen(false)}>
                            Moves
                        </NavDropdownItem>
                    </NavDropdown>
                </NavDropdownWrapper>

                <Link aria-label="Pokemon Cards" to="/pokemoncards">Pokemon Cards</Link>

                <Link aria-label="Cart" to="/cart">
                    <Cart amount={totalAmount} />
                </Link>
            </NavBar>
        </NavContainer>
    );
}

export default Nav;
