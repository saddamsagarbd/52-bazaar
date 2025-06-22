export const placeOrder = (orderData) => async (dispatch, getState) => {
    const { auth } = getState();
    const token = auth.token;

    try {
        const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
        });

        if (!response.ok) throw new Error('Failed to place order');
        const result = await response.json();
        dispatch(clearCart());
        return result;
    } catch (error) {
        console.error('Order Error:', error.message);
        throw error;
    }
};
