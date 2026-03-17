import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link, NavContainer, NavBar, NavDropdownWrapper, NavDropdownTrigger, NavDropdown, NavDropdownItem } from "./Nav.styled";
import CartContext from "../../context/CartContext";
import Cart from "./CartIcon";

function Nav() {
    const { totalAmount } = useContext(CartContext);
    const [pokemonOpen, setPokemonOpen] = useState(false);
    const navigate = useNavigate();

    function handleDropdownNav(path) {
        setPokemonOpen(false);
        navigate(path);
    }

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
                    <NavDropdown $isopen={pokemonOpen ? 1 : 0}>
                        <NavDropdownItem to="/collection" onMouseDown={(e) => { e.preventDefault(); handleDropdownNav('/collection'); }}>
                            Pokémon
                        </NavDropdownItem>
                        <NavDropdownItem to="/abilities" onMouseDown={(e) => { e.preventDefault(); handleDropdownNav('/abilities'); }}>
                            Abilities
                        </NavDropdownItem>
                        <NavDropdownItem to="/moves" onMouseDown={(e) => { e.preventDefault(); handleDropdownNav('/moves'); }}>
                            Moves
                        </NavDropdownItem>
                        <NavDropdownItem to="/types" onMouseDown={(e) => { e.preventDefault(); handleDropdownNav('/types'); }}>
                            Types
                        </NavDropdownItem>
                    </NavDropdown>
                </NavDropdownWrapper>

                <Link aria-label="Battle" to="/battle">Battle</Link>

                <Link aria-label="Pokemon Cards" to="/pokemoncards">Pokemon Cards</Link>

                <Link aria-label="Cart" to="/cart">
                    <Cart amount={totalAmount} />
                </Link>
            </NavBar>
        </NavContainer>
    );
}

export default Nav;
