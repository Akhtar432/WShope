import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import { productsReducer } from '../slices/productSlice';
import { cartReducer } from '../slices/cartSlice';
import { checkoutReducer } from '../slices/checkoutSlice';
import { orderReducer } from '../slices/orderSlice';
import { adminReducer } from '../slices/adminSlice';
import { adminProductReducer } from '../slices/adminProductSlice';
import { adminOrderReducer } from '../slices/adminOrderSlice';


const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productsReducer,
        cart: cartReducer,
        checkout: checkoutReducer,
        orders: orderReducer,
        admin: adminReducer,
        adminProduct: adminProductReducer,
        adminOrder: adminOrderReducer,
    },
});

export default store;