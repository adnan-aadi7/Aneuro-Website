import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../axiosInstance';

// Async thunks for quiz operations

// Save quiz answer
export const saveQuizAnswer = createAsyncThunk(
  'quiz/saveAnswer',
  async ({ user_id, question_number, selected_option }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/quiz/save', {
        user_id,
        question_number,
        selected_option
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get quiz progress
export const getQuizProgress = createAsyncThunk(
  'quiz/getProgress',
  async (user_id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/quiz/progress/${user_id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create audience quiz session
export const createAudienceQuiz = createAsyncThunk(
  'quiz/createAudience',
  async ({ user_id, name, email, question_number, selected_option }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/quiz/start', {
        user_id,
        name,
        email,
        question_number,
        selected_option
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get audience quiz sessions
export const getAudienceSessions = createAsyncThunk(
  'quiz/getAudienceSessions',
  async ({ user_id, is_completed }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({ user_id });
      if (is_completed !== undefined) {
        params.append('is_completed', is_completed);
      }
      const response = await axiosInstance.get(`/quiz/sessions?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

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

// Send incomplete quiz reminders
export const sendIncompleteQuizReminders = createAsyncThunk(
  'quiz/sendReminders',
  async ({ user_id, audienceEmails, quizId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/quiz/send-incomplete-reminders', {
        user_id,
        audienceEmails,
        quizId
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get quiz analytics
export const getQuizAnalytics = createAsyncThunk(
  'quiz/getAnalytics',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/quiz/analytics/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get brain type analytics
export const getBrainTypeAnalytics = createAsyncThunk(
  'quiz/getBrainTypeAnalytics',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/quiz/analytics/brain-types/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get weekly brain type stats
export const getWeeklyBrainTypeStats = createAsyncThunk(
  'quiz/getWeeklyBrainTypeStats',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/quiz/${userId}/weekly-brain-types`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  // Quiz session data
  currentSession: null,
  quizProgress: null,
  
  // Audience management
  audienceSessions: [],
  audienceSessionsLoading: false,
  audienceSessionsError: null,
  
  // Analytics
  quizAnalytics: null,
  brainTypeAnalytics: null,
  weeklyBrainTypeStats: null,
  
  // Loading states
  loading: {
    saveAnswer: false,
    getProgress: false,
    createAudience: false,
    getAudienceSessions: false,
    sendReminders: false,
    getAnalytics: false,
    getBrainTypeAnalytics: false,
    getWeeklyBrainTypeStats: false
  },
  
  // Error states
  errors: {
    saveAnswer: null,
    getProgress: null,
    createAudience: null,
    getAudienceSessions: null,
    sendReminders: null,
    getAnalytics: null,
    getBrainTypeAnalytics: null,
    getWeeklyBrainTypeStats: null
  }
};

// Quiz slice
const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    // Clear current session
    clearCurrentSession: (state) => {
      state.currentSession = null;
    },
    
    // Clear quiz progress
    clearQuizProgress: (state) => {
      state.quizProgress = null;
    },
    
    // Clear audience sessions
    clearAudienceSessions: (state) => {
      state.audienceSessions = [];
    },
    
    // Clear analytics
    clearAnalytics: (state) => {
      state.quizAnalytics = null;
      state.brainTypeAnalytics = null;
      state.weeklyBrainTypeStats = null;
    },
    
    // Clear all errors
    clearErrors: (state) => {
      state.errors = {
        saveAnswer: null,
        getProgress: null,
        createAudience: null,
        getAudienceSessions: null,
        sendReminders: null,
        getAnalytics: null,
        getBrainTypeAnalytics: null,
        getWeeklyBrainTypeStats: null
      };
    },
    
    // Clear specific error
    clearError: (state, action) => {
      const errorType = action.payload;
      if (state.errors[errorType]) {
        state.errors[errorType] = null;
      }
    }
  },
  extraReducers: (builder) => {
    // Save quiz answer
    builder
      .addCase(saveQuizAnswer.pending, (state) => {
        state.loading.saveAnswer = true;
        state.errors.saveAnswer = null;
      })
      .addCase(saveQuizAnswer.fulfilled, (state, action) => {
        state.loading.saveAnswer = false;
        state.currentSession = action.payload.data;
      })
      .addCase(saveQuizAnswer.rejected, (state, action) => {
        state.loading.saveAnswer = false;
        state.errors.saveAnswer = action.payload?.message || 'Failed to save answer';
      });

    // Get quiz progress
    builder
      .addCase(getQuizProgress.pending, (state) => {
        state.loading.getProgress = true;
        state.errors.getProgress = null;
      })
      .addCase(getQuizProgress.fulfilled, (state, action) => {
        state.loading.getProgress = false;
        state.quizProgress = action.payload;
      })
      .addCase(getQuizProgress.rejected, (state, action) => {
        state.loading.getProgress = false;
        state.errors.getProgress = action.payload?.message || 'Failed to get progress';
      });

    // Create audience quiz
    builder
      .addCase(createAudienceQuiz.pending, (state) => {
        state.loading.createAudience = true;
        state.errors.createAudience = null;
      })
      .addCase(createAudienceQuiz.fulfilled, (state, action) => {
        state.loading.createAudience = false;
        // Update audience sessions if it exists
        const sessionIndex = state.audienceSessions.findIndex(
          session => session._id === action.payload.data._id
        );
        if (sessionIndex >= 0) {
          state.audienceSessions[sessionIndex] = action.payload.data;
        } else {
          state.audienceSessions.push(action.payload.data);
        }
      })
      .addCase(createAudienceQuiz.rejected, (state, action) => {
        state.loading.createAudience = false;
        state.errors.createAudience = action.payload?.message || 'Failed to create audience quiz';
      });

    // Get audience sessions
    builder
      .addCase(getAudienceSessions.pending, (state) => {
        state.loading.getAudienceSessions = true;
        state.errors.getAudienceSessions = null;
      })
      .addCase(getAudienceSessions.fulfilled, (state, action) => {
        state.loading.getAudienceSessions = false;
        state.audienceSessions = action.payload.data;
      })
      .addCase(getAudienceSessions.rejected, (state, action) => {
        state.loading.getAudienceSessions = false;
        state.errors.getAudienceSessions = action.payload?.message || 'Failed to get audience sessions';
      });

    // Send incomplete quiz reminders
    builder
      .addCase(sendIncompleteQuizReminders.pending, (state) => {
        state.loading.sendReminders = true;
        state.errors.sendReminders = null;
      })
      .addCase(sendIncompleteQuizReminders.fulfilled, (state) => {
        state.loading.sendReminders = false;
      })
      .addCase(sendIncompleteQuizReminders.rejected, (state, action) => {
        state.loading.sendReminders = false;
        state.errors.sendReminders = action.payload?.message || 'Failed to send reminders';
      });

    // Get quiz analytics
    builder
      .addCase(getQuizAnalytics.pending, (state) => {
        state.loading.getAnalytics = true;
        state.errors.getAnalytics = null;
      })
      .addCase(getQuizAnalytics.fulfilled, (state, action) => {
        state.loading.getAnalytics = false;
        state.quizAnalytics = action.payload.data;
      })
      .addCase(getQuizAnalytics.rejected, (state, action) => {
        state.loading.getAnalytics = false;
        state.errors.getAnalytics = action.payload?.message || 'Failed to get analytics';
      });

    // Get brain type analytics
    builder
      .addCase(getBrainTypeAnalytics.pending, (state) => {
        state.loading.getBrainTypeAnalytics = true;
        state.errors.getBrainTypeAnalytics = null;
      })
      .addCase(getBrainTypeAnalytics.fulfilled, (state, action) => {
        state.loading.getBrainTypeAnalytics = false;
        state.brainTypeAnalytics = action.payload.data;
      })
      .addCase(getBrainTypeAnalytics.rejected, (state, action) => {
        state.loading.getBrainTypeAnalytics = false;
        state.errors.getBrainTypeAnalytics = action.payload?.message || 'Failed to get brain type analytics';
      });

    // Get weekly brain type stats
    builder
      .addCase(getWeeklyBrainTypeStats.pending, (state) => {
        state.loading.getWeeklyBrainTypeStats = true;
        state.errors.getWeeklyBrainTypeStats = null;
      })
      .addCase(getWeeklyBrainTypeStats.fulfilled, (state, action) => {
        state.loading.getWeeklyBrainTypeStats = false;
        state.weeklyBrainTypeStats = action.payload;
      })
      .addCase(getWeeklyBrainTypeStats.rejected, (state, action) => {
        state.loading.getWeeklyBrainTypeStats = false;
        state.errors.getWeeklyBrainTypeStats = action.payload?.message || 'Failed to get weekly brain type stats';
      });
  }
});

// Export actions
export const {
  clearCurrentSession,
  clearQuizProgress,
  clearAudienceSessions,
  clearAnalytics,
  clearErrors,
  clearError
} = quizSlice.actions;

// Export selectors
export const selectCurrentSession = (state) => state.quiz.currentSession;
export const selectQuizProgress = (state) => state.quiz.quizProgress;
export const selectAudienceSessions = (state) => state.quiz.audienceSessions;
export const selectQuizAnalytics = (state) => state.quiz.quizAnalytics;
export const selectBrainTypeAnalytics = (state) => state.quiz.brainTypeAnalytics;
export const selectWeeklyBrainTypeStats = (state) => state.quiz.weeklyBrainTypeStats;

// Loading selectors
export const selectQuizLoading = (state) => state.quiz.loading;
export const selectQuizErrors = (state) => state.quiz.errors;

// Specific loading selectors
export const selectSaveAnswerLoading = (state) => state.quiz.loading.saveAnswer;
export const selectGetProgressLoading = (state) => state.quiz.loading.getProgress;
export const selectCreateAudienceLoading = (state) => state.quiz.loading.createAudience;
export const selectGetAudienceSessionsLoading = (state) => state.quiz.loading.getAudienceSessions;
export const selectSendRemindersLoading = (state) => state.quiz.loading.sendReminders;
export const selectGetAnalyticsLoading = (state) => state.quiz.loading.getAnalytics;
export const selectGetBrainTypeAnalyticsLoading = (state) => state.quiz.loading.getBrainTypeAnalytics;
export const selectGetWeeklyBrainTypeStatsLoading = (state) => state.quiz.loading.getWeeklyBrainTypeStats;

// Specific error selectors
export const selectSaveAnswerError = (state) => state.quiz.errors.saveAnswer;
export const selectGetProgressError = (state) => state.quiz.errors.getProgress;
export const selectCreateAudienceError = (state) => state.quiz.errors.createAudience;
export const selectGetAudienceSessionsError = (state) => state.quiz.errors.getAudienceSessions;
export const selectSendRemindersError = (state) => state.quiz.errors.sendReminders;
export const selectGetAnalyticsError = (state) => state.quiz.errors.getAnalytics;
export const selectGetBrainTypeAnalyticsError = (state) => state.quiz.errors.getBrainTypeAnalytics;
export const selectGetWeeklyBrainTypeStatsError = (state) => state.quiz.errors.getWeeklyBrainTypeStats;

// Helper selectors
export const selectCompletedAudienceSessions = (state) => 
  state.quiz.audienceSessions.filter(session => session.is_completed);

export const selectIncompleteAudienceSessions = (state) => 
  state.quiz.audienceSessions.filter(session => !session.is_completed);

export const selectTotalAudienceSessions = (state) => 
  state.quiz.audienceSessions.length;

export const selectCompletedAudienceCount = (state) => 
  state.quiz.audienceSessions.filter(session => session.is_completed).length;

export const selectIncompleteAudienceCount = (state) => 
  state.quiz.audienceSessions.filter(session => !session.is_completed).length;

// Brain type breakdown selector
export const selectBrainTypeBreakdown = (state) => {
  const analytics = state.quiz.brainTypeAnalytics;
  if (!analytics) return null;
  
  return {
    Architect: analytics.Architect || { count: 0, percentage: 0 },
    Reflector: analytics.Reflector || { count: 0, percentage: 0 },
    Catalyst: analytics.Catalyst || { count: 0, percentage: 0 },
    Synthesizer: analytics.Synthesizer || { count: 0, percentage: 0 },
    Challenger: analytics.Challenger || { count: 0, percentage: 0 }
  };
};

// Quiz completion stats selector
export const selectQuizCompletionStats = (state) => {
  const analytics = state.quiz.quizAnalytics;
  if (!analytics) return null;
  
  return {
    lastWeek: analytics.quizCompletion?.lastWeek || 0,
    thisWeek: analytics.quizCompletion?.thisWeek || 0,
    total: (analytics.quizCompletion?.lastWeek || 0) + (analytics.quizCompletion?.thisWeek || 0)
  };
};

export default quizSlice.reducer;
