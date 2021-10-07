import { configureStore } from "@reduxjs/toolkit";
import { fetchuser } from "../middlewares/user";
import userReducer from "../reducers/user/slice";
import pharmacyReducer from "../reducers/pharmacy/slice";
import ordersReducer from "../reducers/orders/slice";
import { fetchOrders } from "../middlewares/orders";
import { fetchPharmacies } from "../middlewares/pharmacies";
export const store = configureStore({
  reducer: {
    user: userReducer,
    pharmacies: pharmacyReducer,
    orders: ordersReducer,
  },
  middleware: [fetchuser, fetchPharmacies, fetchOrders],
});
