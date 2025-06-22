import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    total: 0,
    count: 0,
    loading: false,
    error: null
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCartStart: (state) => {
            state.loading = true;
        },
        addToCartSuccess: (state, action) => {
            const { product, quantity } = action.payload;
            const existing = state.items.find(i => i.product._id === product._id);
            if (existing) {
                existing.quantity += quantity;
            } else {
                state.items.push({ product, quantity });
            }
            state.count = state.items.reduce((sum, i) => sum + i.quantity, 0);
            state.total = state.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
            state.loading = false;
            localStorage.setItem('cart', JSON.stringify(state));
        },
        removeFromCartSuccess: (state, action) => {
            const productId = action.payload;
            state.items = state.items.filter(i => i.product._id !== productId);
            state.count = state.items.reduce((sum, i) => sum + i.quantity, 0);
            state.total = state.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
            localStorage.setItem('cart', JSON.stringify(state));
        },
        loadCartFromStorage: (state, action) => {
            state.items = action.payload.items || [];
            state.total = action.payload.total || 0;
            state.count = action.payload.count || state.items.reduce((sum, item) => sum + item.quantity, 0);
        },
        clearCart: (state) => {
            state.items = [];
            state.total = 0;
            state.count = 0;
            localStorage.removeItem('cart');
        }
    }
});

export const {
    addToCartStart,
    addToCartSuccess,
    removeFromCartSuccess,
    loadCartFromStorage,
    clearCart
} = cartSlice.actions;

export default cartSlice.reducer;
