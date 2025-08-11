import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Slice/UserSlice";
import paymentReducer from "./Slice/PaymentSlice";
import ticketReducer from "./Slice/TicketSlice";
import emailSequenceReducer from "./Slice/EmailSequenceSLice";
import funnelTemplateReducer from "./Slice/FunnelSequenceSlice";
import promptPackReducer from "./Slice/PromptPacksSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    payment: paymentReducer,
    ticket: ticketReducer,
    emailSequence: emailSequenceReducer,
    funnelTemplate: funnelTemplateReducer,
    promptPack: promptPackReducer,
  },
});
