// orderSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orderId: null,
  orderItems: [],
  // other order-related state
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderDetails: (state, action) => {
      state.orderId = action.payload.orderId;
      state.orderItems = action.payload.orderItems;
    },
    resetOrderDetails: (state) => {
        // Resetting the order state to initial state
        state.orderId = null;
        state.orderItems = [];
        state.shippingAddress = {};
        state.paymentMethod = null;
        state.itemsPrice = 0;
        state.shippingPrice = 0;
        state.totalPrice = 0;
      },
    // other reducers can be added as needed
  },
});

export const { setOrderDetails,resetOrderDetails  } = orderSlice.actions;

export default orderSlice.reducer;
