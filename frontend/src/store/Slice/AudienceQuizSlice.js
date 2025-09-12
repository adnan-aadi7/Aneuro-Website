import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../axiosInstance";

// Async thunks mapped to backend routes in quizRoutes.js

// POST /api/quiz/start -> createAudience
export const startOrContinueAudienceQuiz = createAsyncThunk(
  "audienceQuiz/startOrContinue",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/quiz/start", payload);
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data || { message: err.message });
    }
  }
);

// GET /api/quiz/sessions?user_id=&is_completed=
export const fetchAudienceSessions = createAsyncThunk(
  "audienceQuiz/fetchSessions",
  async ({ userId, isCompleted }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({ user_id: userId });
      if (typeof isCompleted === "boolean") params.set("is_completed", String(isCompleted));
      const { data } = await axios.get(`/quiz/sessions?${params.toString()}`);
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data || { message: err.message });
    }
  }
);

// POST /api/quiz/send-incomplete-reminders
export const sendIncompleteReminders = createAsyncThunk(
  "audienceQuiz/sendReminders",
  async ({ user_id, quizId, audienceEmails }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/quiz/send-incomplete-reminders", {
        user_id,
        quizId,
        audienceEmails,
      });
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data || { message: err.message });
    }
  }
);

// GET /api/quiz/quiz-report?user_id=&audience_id=
export const fetchAudienceQuizReport = createAsyncThunk(
  "audienceQuiz/fetchQuizReport",
  async ({ user_id, audience_id }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({ user_id, audience_id }).toString();
      const { data } = await axios.get(`/quiz/quiz-report?${params}`);
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data || { message: err.message });
    }
  }
);

const initialState = {
  sessions: [],
  sessionsLoading: false,
  sessionsError: null,

  startSave: { loading: false, error: null, data: null },
  reminders: { loading: false, error: null, message: null },
  report: { loading: false, error: null, data: null },
};

const audienceQuizSlice = createSlice({
  name: "audienceQuiz",
  initialState,
  reducers: {
    clearReport(state) {
      state.report = { loading: false, error: null, data: null };
    },
  },
  extraReducers: (builder) => {
    // startOrContinueAudienceQuiz
    builder
      .addCase(startOrContinueAudienceQuiz.pending, (state) => {
        state.startSave.loading = true;
        state.startSave.error = null;
      })
      .addCase(startOrContinueAudienceQuiz.fulfilled, (state, action) => {
        state.startSave.loading = false;
        state.startSave.data = action.payload;
      })
      .addCase(startOrContinueAudienceQuiz.rejected, (state, action) => {
        state.startSave.loading = false;
        state.startSave.error = action.payload || action.error;
      });

    // fetchAudienceSessions
    builder
      .addCase(fetchAudienceSessions.pending, (state) => {
        state.sessionsLoading = true;
        state.sessionsError = null;
      })
      .addCase(fetchAudienceSessions.fulfilled, (state, action) => {
        state.sessionsLoading = false;
        // backend returns { success, data }
        state.sessions = action.payload?.data || [];
      })
      .addCase(fetchAudienceSessions.rejected, (state, action) => {
        state.sessionsLoading = false;
        state.sessionsError = action.payload || action.error;
      });

    // sendIncompleteReminders
    builder
      .addCase(sendIncompleteReminders.pending, (state) => {
        state.reminders.loading = true;
        state.reminders.error = null;
        state.reminders.message = null;
      })
      .addCase(sendIncompleteReminders.fulfilled, (state, action) => {
        state.reminders.loading = false;
        state.reminders.message = action.payload?.message || "Sent";
      })
      .addCase(sendIncompleteReminders.rejected, (state, action) => {
        state.reminders.loading = false;
        state.reminders.error = action.payload || action.error;
      });

    // fetchAudienceQuizReport
    builder
      .addCase(fetchAudienceQuizReport.pending, (state) => {
        state.report.loading = true;
        state.report.error = null;
      })
      .addCase(fetchAudienceQuizReport.fulfilled, (state, action) => {
        state.report.loading = false;
        state.report.data = action.payload;
      })
      .addCase(fetchAudienceQuizReport.rejected, (state, action) => {
        state.report.loading = false;
        state.report.error = action.payload || action.error;
      });
  },
});

export const { clearReport } = audienceQuizSlice.actions;
export default audienceQuizSlice.reducer;


