import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Slice/UserSlice";
import paymentReducer from "./Slice/PaymentSlice";
import ticketReducer from "./Slice/TicketSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    payment: paymentReducer,
    ticket: ticketReducer,
  },
});
