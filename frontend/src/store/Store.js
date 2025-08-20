import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Slice/UserSlice";
import paymentReducer from "./Slice/PaymentSlice";
import ticketReducer from "./Slice/TicketSlice";
import emailSequenceReducer from "./Slice/EmailSequenceSLice";
import funnelTemplateReducer from "./Slice/FunnelSequenceSlice";
import promptPackReducer from "./Slice/PromptPacksSlice";
import logReducer from "./Slice/LogSlice";
import scheduleReducer from "./Slice/ScheduleSlice";
import activityReducer from "./Slice/ActivitySlice";
import adminDashboardReducer from "./Slice/DashboardSliceAdmin";
import quizReducer from "./Slice/QuizSlice";
import customizationReducer from "./Slice/customizationSlice";



export const store = configureStore({
  reducer: {
    user: userReducer,
    payment: paymentReducer,
    ticket: ticketReducer,
    emailSequence: emailSequenceReducer,
    funnelTemplate: funnelTemplateReducer,
    promptPack: promptPackReducer,
    systemLogs: logReducer,
    schedule: scheduleReducer,
    activities: activityReducer,
    adminDashboard: adminDashboardReducer,
    quiz: quizReducer,
   
    customization: customizationReducer,
  },
});
