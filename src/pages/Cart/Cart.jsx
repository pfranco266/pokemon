import React, { useContext } from "react";
import { Title, Total, TotalContainer, SubTotal, FinalTotal, Container, SummaryTitle } from "./Cart.styled";
import CartContext from "../../context/CartContext";
import PokemonCard from "../../components/PokemonCard/PokemonCard";
import { GridItems, PokemonGridItem, Price, PokemonGridContainer, AddtoCartButton, ButtonContainer } from "../../components/PokemonCard/Pokemon.styled";
import { Link } from "react-router-dom";
import { LandingBodyContainer } from "../Home/Home.styled";

function Cart() {
    const { cart, setCart } = useContext(CartContext);
    const itemPrice = 5.99;

    const totalBeforeTax = cart.reduce((total, item) => {
        return total + (itemPrice * item.amount);
    }, 0).toFixed(2);

    function calcTax(totalBeforeTax) {
        const taxRate = 0.09;
        const numericTotalBeforeTax = Number(totalBeforeTax);
        return (numericTotalBeforeTax * taxRate).toFixed(2);
    }

    const tax = calcTax(totalBeforeTax);

    function calcTotal(tax, totalBeforeTax) {
        const numericTax = Number(tax);
        const numericTotalBeforeTax = Number(totalBeforeTax);
        return (numericTax + numericTotalBeforeTax).toFixed(2);
    }

    const total = calcTotal(tax, totalBeforeTax);

    const removeFromCart = (pokemon) => {
        setCart((prev) => {
            const existingItemIndex = prev.findIndex(item => item.index === pokemon.index);
            if (existingItemIndex !== -1) {
                const newCart = [...prev];
                const existingItem = newCart[existingItemIndex];

                if (existingItem.amount > 1) {
                    newCart[existingItemIndex] = { ...existingItem, amount: existingItem.amount - 1 };
                } else {
                    newCart.splice(existingItemIndex, 1);
                }

                return newCart;
            }
            return prev;
        });
    };

    const addMore = (pokemonId) => {
        return setCart(prev => {
            const index = prev.findIndex(item => item.index === pokemonId.index);
            if (index !== -1) {
                return prev.map((item, i) =>
                    i === index ? { ...item, amount: item.amount + 1 } : item
                );
            }

            return [...prev, { ...pokemonId, amount: 1 }];
        });
    };

    return (
        <LandingBodyContainer>
            <Title>
                Shopping Cart
            </Title>
            <Title>
                {cart.length > 0 ? `You have ${cart.length} Pokemon in your cart` : `Your cart is empty.`}
            </Title>
            <Title>
                {cart.length === 0 ? <Link to={'/pokemoncards'}>See our Pokemon Card Selection</Link> : null}
            </Title>
            <PokemonGridContainer>
                {cart.length > 0 && (
                    cart.map((item) => (
                        <GridItems key={item.index}>
                            <PokemonGridItem>
                                <PokemonCard index={item.index} />
                            </PokemonGridItem>
                            <Price>$5.99 x {item.amount}</Price>
                            <ButtonContainer style={{ justifyContent: 'space-between' }}>
                                <AddtoCartButton style={{ background: '#ff0000', color: '#ffcc00' }} aria-label="Remove from cart" onClick={() => removeFromCart(item)}>
                                    Remove from cart
                                </AddtoCartButton>
                                <AddtoCartButton aria-label="Add more" onClick={() => addMore(item)}>
                                    Add More
                                </AddtoCartButton>
                            </ButtonContainer>
                        </GridItems>
                    ))
                )}
            </PokemonGridContainer>

            {cart.length > 0 && (
                <Container>
                    <TotalContainer>
                        <SummaryTitle>Order Summary</SummaryTitle>
                        <SubTotal>Total before tax: ${totalBeforeTax}</SubTotal>
                        <SubTotal>Tax (9%): ${tax}</SubTotal>
                        <FinalTotal>Total: ${total}</FinalTotal>
                    </TotalContainer>
                </Container>
            )}
        </LandingBodyContainer>
    );
}

export default Cart;