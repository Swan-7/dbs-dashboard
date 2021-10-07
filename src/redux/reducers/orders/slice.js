import { createSlice } from "@reduxjs/toolkit";
import { auth } from "../../../constants/firestore";

export const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],

    loading: true,
  },

  reducers: {
    updateorders: (state, action) => {
      console.log(action.payload, "payload");
      //   console.log(action.payload.first_name, "first name");
      state.orders = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateorders } = ordersSlice.actions;
export const ordersData = (state) => state.orders;
export default ordersSlice.reducer;
