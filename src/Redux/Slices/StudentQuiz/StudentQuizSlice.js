import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../../config/Common";

// Async thunk to fetch attempt history
export const fetchAttemptHistory = createAsyncThunk(
  "studentQuiz/fetchAttemptHistory",
  async (quizId, { getState }) => {
    const token = localStorage.getItem('student:token');
    if (!token) throw new Error('Authentication token not found');
    
    const response = await fetch(`${baseUrl}/student/studentquiz/${quizId}/attempt`, {
      headers: {
        'Authentication': token,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch attempt history, status: ${response.status}`);
    }

    const data = await response.json();
    return data.submission;
  }
);

// Async thunk to submit quiz
export const submitQuiz = createAsyncThunk(
  "studentQuiz/submitQuiz",
  async ({ quizId, answers, timeTaken }, { getState }) => {
    const token = localStorage.getItem('student:token');
    if (!token) throw new Error('Authentication token not found');
    
    const response = await fetch(`${baseUrl}/student/studentquiz/submit/${quizId}`, {
      method: 'POST',
      headers: {
        'Authentication': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ studentAnswers: answers, timeTaken }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(`Failed to submit quiz, status: ${response.status}`);
    }

    return data;
  }
);

const StudentQuizSlice = createSlice({
  name: "studentQuiz",
  initialState: {
    attemptHistory: [],
    quizResults: { totalPoints: 0, correctAnswers: 0, wrongAnswers: 0 },
    selectedOptions: {},
    quizSubmitted: false,
    quizStarted: false,
    timeLeft: 0,
    totalTime: 0,
    activeTab: 'instructions',
    error: null,
  },
  reducers: {
    setSelectedOptions: (state, action) => {
      state.selectedOptions = action.payload;
    },
    setQuizStarted: (state, action) => {
      state.quizStarted = action.payload;
    },
    setQuizSubmitted: (state, action) => {
      state.quizSubmitted = action.payload;
    },
    setTimeLeft: (state, action) => {
      state.timeLeft = action.payload;
    },
    setTotalTime: (state, action) => {
      state.totalTime = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    addAttemptHistory: (state, action) => {
      state.attemptHistory.push(action.payload);
    },
    setQuizResults: (state, action) => {
      state.quizResults = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttemptHistory.fulfilled, (state, action) => {
        state.attemptHistory = action.payload;
        state.error = null;
      })
      .addCase(fetchAttemptHistory.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(submitQuiz.fulfilled, (state, action) => {
        state.quizResults = {
          totalPoints: action.payload.score,
          correctAnswers: action.payload.rightAnswer,
          wrongAnswers: action.payload.wrongAnswer,
        };
        state.quizSubmitted = true;
        state.attemptHistory.push({
          attempts: state.attemptHistory.length + 1,
          score: action.payload.score,
          rightAnswer: action.payload.rightAnswer,
          wrongAnswer: action.payload.wrongAnswer,
          questions: action.meta.arg.answers,
        });
        state.error = null;
      })
      .addCase(submitQuiz.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const {
  setSelectedOptions,
  setQuizStarted,
  setQuizSubmitted,
  setTimeLeft,
  setTotalTime,
  setActiveTab,
  addAttemptHistory,
  setQuizResults,
} = StudentQuizSlice.actions;

export default StudentQuizSlice.reducer;




//--------------------------------

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// // Async thunk to fetch attempt history
// export const fetchAttemptHistory = createAsyncThunk(
//   "studentQuiz/fetchAttemptHistory",
//   async (quizId, { getState }) => {
//     const token = localStorage.getItem('student:token');
//     if (!token) throw new Error('Authentication token not found');
    
//     const response = await fetch(`${baseUrl}/student/studentquiz/${quizId}/attempt`, {
//       headers: {
//         'Authentication': token,
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to fetch attempt history, status: ${response.status}`);
//     }

//     const data = await response.json();
//     return data.submission;
//   }
// );

// // Async thunk to submit quiz
// export const submitQuiz = createAsyncThunk(
//   "studentQuiz/submitQuiz",
//   async ({ quizId, answers, timeTaken }, { getState }) => {
//     const token = localStorage.getItem('student:token');
//     if (!token) throw new Error('Authentication token not found');
    
//     const response = await fetch(`${baseUrl}/student/studentquiz/submit/${quizId}`, {
//       method: 'POST',
//       headers: {
//         'Authentication': token,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ studentAnswers: answers, timeTaken }),
//     });

//     const data = await response.json();
//     if (!response.ok) {
//       throw new Error(`Failed to submit quiz, status: ${response.status}`);
//     }

//     return data;
//   }
// );

// const StudentQuizSlice = createSlice({
//   name: "studentQuiz",
//   initialState: {
//     attemptHistory: [],
//     quizResults: { totalPoints: 0, correctAnswers: 0, wrongAnswers: 0 },
//     selectedOptions: {},
//     quizSubmitted: false,
//     quizStarted: false,
//     timeLeft: 0,
//     totalTime: 0,
//     activeTab: 'instructions',
//     quiz: null,
//     error: null,
//   },
//   reducers: {
//     setSelectedOptions: (state, action) => {
//       state.selectedOptions = action.payload;
//     },
//     setQuizStarted: (state, action) => {
//       state.quizStarted = action.payload;
//     },
//     setQuizSubmitted: (state, action) => {
//       state.quizSubmitted = action.payload;
//     },
//     setTimeLeft: (state, action) => {
//       state.timeLeft = action.payload;
//     },
//     setTotalTime: (state, action) => {
//       state.totalTime = action.payload;
//     },
//     setActiveTab: (state, action) => {
//       state.activeTab = action.payload;
//     },
//     addAttemptHistory: (state, action) => {
//       state.attemptHistory.push(action.payload);
//     },
//     setQuizResults: (state, action) => {
//       state.quizResults = action.payload;
//     },
//     setQuiz: (state, action) => {
//       state.quiz = action.payload;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAttemptHistory.fulfilled, (state, action) => {
//         state.attemptHistory = action.payload;
//         state.error = null;
//       })
//       .addCase(fetchAttemptHistory.rejected, (state, action) => {
//         state.error = action.error.message;
//       })
//       .addCase(submitQuiz.fulfilled, (state, action) => {
//         state.quizResults = {
//           totalPoints: action.payload.score,
//           correctAnswers: action.payload.rightAnswer,
//           wrongAnswers: action.payload.wrongAnswer,
//         };
//         state.quizSubmitted = true;
//         state.attemptHistory.push({
//           attempts: state.attemptHistory.length + 1,
//           score: action.payload.score,
//           rightAnswer: action.payload.rightAnswer,
//           wrongAnswer: action.payload.wrongAnswer,
//           questions: action.meta.arg.answers,
//         });
//         state.error = null;
//       })
//       .addCase(submitQuiz.rejected, (state, action) => {
//         state.error = action.error.message;
//       });
//   },
// });

// export const {
//   setSelectedOptions,
//   setQuizStarted,
//   setQuizSubmitted,
//   setTimeLeft,
//   setTotalTime,
//   setActiveTab,
//   addAttemptHistory,
//   setQuizResults,
//   setQuiz,
// } = StudentQuizSlice.actions;

// export default StudentQuizSlice.reducer;


//--------------------------------

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// // Async thunk to fetch attempt history
// export const fetchAttemptHistory = createAsyncThunk(
//   "studentQuiz/fetchAttemptHistory",
//   async (quizId, { getState }) => {
//     const token = localStorage.getItem('student:token');
//     if (!token) throw new Error('Authentication token not found');
    
//     const response = await fetch(`${baseUrl}/student/studentquiz/${quizId}/attempt`, {
//       headers: {
//         'Authentication': token,
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to fetch attempt history, status: ${response.status}`);
//     }

//     const data = await response.json();
//     return data.submission;
//   }
// );

// // Async thunk to submit quiz
// export const submitQuiz = createAsyncThunk(
//   "studentQuiz/submitQuiz",
//   async ({ quizId, answers, timeTaken }, { getState }) => {
//     const token = localStorage.getItem('student:token');
//     if (!token) throw new Error('Authentication token not found');
    
//     const response = await fetch(`${baseUrl}/student/studentquiz/submit/${quizId}`, {
//       method: 'POST',
//       headers: {
//         'Authentication': token,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ studentAnswers: answers, timeTaken }),
//     });

//     const data = await response.json();
//     if (!response.ok) {
//       throw new Error(`Failed to submit quiz, status: ${response.status}`);
//     }

//     return data;
//   }
// );

// const StudentQuizSlice = createSlice({
//   name: "studentQuiz",
//   initialState: {
//     attemptHistory: [],
//     quizResults: { totalPoints: 0, correctAnswers: 0, wrongAnswers: 0 },
//     selectedOptions: {},
//     quizSubmitted: false,
//     quizStarted: false,
//     timeLeft: 0,
//     totalTime: 0,
//     activeTab: 'instructions',
//     error: null,
//     quiz: null,
//   },
//   reducers: {
//     setSelectedOptions: (state, action) => {
//       state.selectedOptions = action.payload;
//     },
//     setQuizStarted: (state, action) => {
//       state.quizStarted = action.payload;
//     },
//     setQuizSubmitted: (state, action) => {
//       state.quizSubmitted = action.payload;
//     },
//     setTimeLeft: (state, action) => {
//       state.timeLeft = action.payload;
//     },
//     setTotalTime: (state, action) => {
//       state.totalTime = action.payload;
//     },
//     setActiveTab: (state, action) => {
//       state.activeTab = action.payload;
//     },
//     addAttemptHistory: (state, action) => {
//       state.attemptHistory.push(action.payload);
//     },
//     setQuizResults: (state, action) => {
//       state.quizResults = action.payload;
//     },
//     setQuiz: (state, action) => {
//       state.quiz = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAttemptHistory.fulfilled, (state, action) => {
//         state.attemptHistory = action.payload;
//         state.error = null;
//       })
//       .addCase(fetchAttemptHistory.rejected, (state, action) => {
//         state.error = action.error.message;
//       })
//       .addCase(submitQuiz.fulfilled, (state, action) => {
//         state.quizResults = {
//           totalPoints: action.payload.score,
//           correctAnswers: action.payload.rightAnswer,
//           wrongAnswers: action.payload.wrongAnswer,
//         };
//         state.quizSubmitted = true;
//         state.attemptHistory.push({
//           attempts: state.attemptHistory.length + 1,
//           score: action.payload.score,
//           rightAnswer: action.payload.rightAnswer,
//           wrongAnswer: action.payload.wrongAnswer,
//           questions: action.meta.arg.answers,
//         });
//         state.error = null;
//       })
//       .addCase(submitQuiz.rejected, (state, action) => {
//         state.error = action.error.message;
//       });
//   },
// });

// export const {
//   setSelectedOptions,
//   setQuizStarted,
//   setQuizSubmitted,
//   setTimeLeft,
//   setTotalTime,
//   setActiveTab,
//   addAttemptHistory,
//   setQuizResults,
//   setQuiz,
// } = StudentQuizSlice.actions;

// export default StudentQuizSlice.reducer;
