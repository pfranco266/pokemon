import React, { createContext, useState, useEffect } from 'react';
 

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const localData = localStorage.getItem('cart');
        return localData ? JSON.parse(localData) : [];

    });

    const totalAmount = cart.reduce((acc, item) => {
        return acc + item.amount;
    }, 0);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    return (
        <CartContext.Provider value={{cart, setCart, totalAmount }}>
            {children}
        </CartContext.Provider>
    );
};


export default CartContext;