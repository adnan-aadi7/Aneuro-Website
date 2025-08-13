import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axiosInstance";

/**
 * Fetch quiz sessions for the logged-in user
 * @param {boolean|string} isCompleted - true, false, or any filter value
 */
export const fetchQuizSessions = createAsyncThunk(
  "quiz/fetchQuizSessions",
  async ({ isCompleted } = {}, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const userId = state.user?.user?.id;
      if (!userId) throw new Error("User ID not found. Please log in.");

      const params = { user_id: userId };
      if (typeof isCompleted === "boolean") {
        params.is_completed = isCompleted; // only include when filtering
      }

      const res = await axiosInstance.get(`/quiz/sessions`, { params });
      console.log(res.data);
      
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error ||
          err.message ||
          "Failed to fetch quiz sessions"
      );
    }
  }
);

const quizSlice = createSlice({
  name: "quiz",
  initialState: {
    sessions: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearQuizError: (state) => {
      state.error = null;
    },
    resetQuizState: (state) => {
      state.sessions = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = action.payload; // Adjust if backend sends {sessions: []}
      })
      .addCase(fetchQuizSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch quiz sessions";
      });
  },
});

export const { clearQuizError, resetQuizState } = quizSlice.actions;
export default quizSlice.reducer;
