import {
    addToCartStart,
    addToCartSuccess,
    removeFromCartSuccess,
    loadCartFromStorage,
    clearCart
} from './cartSlice';

export const addToCart = (product, quantity = 1) => async dispatch => {
    dispatch(addToCartStart());
    dispatch(addToCartSuccess({ product, quantity }));
};

export const removeFromCart = (productId) => async dispatch => {
    dispatch(removeFromCartSuccess(productId));
};

export const removeAllItemsFromCart = (product) => async dispatch => {
    dispatch(clearCart(product));
};

export const initCart = () => (dispatch) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || { items: [], total: 0 };
    dispatch(loadCartFromStorage(cart));
};
