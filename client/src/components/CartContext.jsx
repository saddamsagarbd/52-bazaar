// CartContext.js
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        const stored = localStorage.getItem("cart");
        return stored ? JSON.parse(stored) : { products: [] };
    });

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(i => i.product._id === product._id);
            if (existing) {
            return prev.map(i =>
                i.product._id === product._id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            );
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prev => {
            return prev.filter(item => item.product._id !== productId);
        });
    };

    const updateQuantity = (productId, qty) => {
        setCart(prev =>
            prev.map(item =>
                item.product._id === productId ? { ...item, quantity: qty } : item
            )
        );
    };

    const clearCart = () => setCart([]);

    const cartCount = cart.length;
    const cartTotal = cart.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    return (
        <CartContext.Provider value={{
            cart, addToCart, removeFromCart, updateQuantity, clearCart,
            cartCount, cartTotal
        }}>
        {children}
        </CartContext.Provider>
    );
}
