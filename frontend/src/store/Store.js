import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Slice/UserSlice";
import paymentReducer from "./Slice/PaymentSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    payment: paymentReducer,
  },
});
