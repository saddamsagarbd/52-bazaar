import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import cartReducer from './cartSlice';
// import { thunk } from 'redux-thunk';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
//   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});
