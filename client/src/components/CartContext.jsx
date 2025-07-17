import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

// Constants for charges
const DELIVERY_CHARGE = 60; // Example delivery charge
const VAT_RATE = 0.10; // 10% VAT

// Helper function moved to top level
const calculateSubtotal = (products) => {
    return products.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
};

const calculateTotal = (products) => {
    const subtotal = calculateSubtotal(products);
    const vat = subtotal * VAT_RATE;
    return {
        subtotal,
        vat,
        delivery: DELIVERY_CHARGE,
        grandTotal: subtotal + vat + DELIVERY_CHARGE
    };
};

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        const stored = localStorage.getItem("cart");
        if (stored) {
            const parsed = JSON.parse(stored);
            const calculated = calculateTotal(parsed.products || []);
            return {
                products: parsed.products || [],
                ...calculated
            };
        }
        return { 
            products: [], 
            subtotal: 0,
            vat: 0,
            delivery: DELIVERY_CHARGE,
            grandTotal: DELIVERY_CHARGE
        };
    });

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart(prev => {

            console.table(product);

            const existing = prev.products.find(i => i.product._id === product._id);
            let newProducts;

            if (existing) {
                // ✅ Check against available inventory
                if (existing.quantity < product.quantity) {
                    newProducts = prev.products.map(i =>
                        i.product._id === product._id
                            ? { ...i, quantity: i.quantity + 1 }
                            : i
                    );
                }
            } else {
                newProducts = [{ product, quantity: 1 }, ...prev.products];
            }

            console.table(newProducts);

            const calculated = calculateTotal(newProducts);
            return {
                products: newProducts,
                ...calculated
            };
        });
    };

    const removeFromCart = (productId) => {
        setCart(prev => {
            const newProducts = prev.products.filter(item => item.product._id !== productId);
            const calculated = calculateTotal(newProducts);
            return {
                products: newProducts,
                ...calculated
            };
        });
    };

    const updateQuantity = (productId, newQuantity) => {
        setCart(prev => {
            const updatedProducts = prev.products.map(item => {
                if (item.product._id === productId) {
                    if (newQuantity <= item.product.stock) {
                        return { ...item, quantity: newQuantity };
                    } else {
                        alert(`Only ${item.product.stock} items available in stock.`);
                        return { ...item, quantity: item.product.stock };
                    }
                }
                return item;
            });

            const calculated = calculateTotal(updatedProducts);
            return {
                products: updatedProducts,
                ...calculated
            };
        });
    };

    const clearCart = () => setCart({ 
        products: [], 
        subtotal: 0,
        vat: 0,
        delivery: DELIVERY_CHARGE,
        grandTotal: DELIVERY_CHARGE
    });

    const cartCount = cart.products.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cart: cart.products,
            cartCount,
            subtotal: cart.subtotal,
            vat: cart.vat,
            deliveryCharge: cart.delivery,
            grandTotal: cart.grandTotal,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
}