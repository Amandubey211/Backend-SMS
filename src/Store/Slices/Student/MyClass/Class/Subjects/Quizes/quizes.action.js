import { createAsyncThunk } from "@reduxjs/toolkit";
import { ErrorMsg } from "../../../../../Common/Alerts/errorhandling.action";
import { setShowError } from "../../../../../Common/Alerts/alertsSlice";
import axios from "axios";
import { baseUrl } from "../../../../../../../config/Common";
import { setActiveTab, setAttemptHistory, setQuizResults } from "./quizesSlice";





export const stdGetQuiz = createAsyncThunk(
    'quiz/stdGetQuiz',
    async ({ cid, sid, moduleId, chapterId }, { rejectWithValue, dispatch }) => {
        const token = localStorage.getItem("student:token");
        if (!token) {
            dispatch(setShowError(true));
            return rejectWithValue('Authentication failed!')
        }

        try {
            dispatch(setShowError(false));

            const res = await axios.get(`${baseUrl}/student/studentquiz/class/${cid}`, {
                headers: { Authentication: token },
                params: { subjectId: sid, moduleId, chapterId },
            });

            const data = res?.data?.quizzes;
            console.log("get quiz data>>>", data);
            return data;
        } catch (error) {
            console.log("Error in student get quiz", error);
            const err = ErrorMsg(error);
            dispatch(setShowError(true));
            return rejectWithValue(err.message);
        }
    }
)


export const stdGetSingleQuiz = createAsyncThunk(
    'quiz/stdGetSingleQuiz',
    async ({ quizId }, { rejectWithValue, dispatch }) => {
        const token = localStorage.getItem("student:token");
        if (!token) {
            return `Authentication Failed!`;
        }

        try {
            dispatch(setActiveTab("instructions"))
            const res = await axios.get(`${baseUrl}/student/quiz/${quizId}`, {
                headers: { Authentication: token }
            });
            const data = res?.data?.quiz;
            console.log("s-quiz data", data);
            return data;
            return
        } catch (error) {
            console.log(error)
        }
    }
)



export const submitQuiz = createAsyncThunk(
    "studentQuiz/submitQuiz",
    async ({ quizId, answers, timeTaken,attemptHistory }, { rejectWithValue, dispatch }) => {
        const token = localStorage.getItem('student:token');
        if (!token) {
            return rejectWithValue('Authentication failed!');
        }

        try {
            const body = { studentAnswers: answers, timeTaken }

            const res = await axios.post(`${baseUrl}/student/studentquiz/submit/${quizId}`, body, {
                headers: {
                    Authentication: token,
                }
            });

            const data = res?.data;
            console.log(data);
            dispatch(setQuizResults({
                totalPoints: data.score,
                correctAnswers: data.rightAnswer,
                wrongAnswers: data.wrongAnswer,
              }));
      
              const newAttempt = {
                attempts: attemptHistory.length + 1,
                score: data.score,
                rightAnswer: data.rightAnswer,
                wrongAnswer: data.wrongAnswer,
                questions: answers,
              };
      
              dispatch(setAttemptHistory((prev) => [...prev, newAttempt]));
      
              return newAttempt;

        } catch (error) {
            console.log(error)
        }
    }
);



export const fetchAttemptHistory = createAsyncThunk(
    'quiz/fetchAttemptHistory',
    async ({ quizId }, { rejectWithValue, dispatch }) => {
        const token = localStorage.getItem("student:token");
        if (!token) {
            return `Authentication Failed!`;
        }

        try {
            dispatch(setActiveTab("instructions"))
            const res = await axios.get(`${baseUrl}/student/studentquiz/${quizId}/attempt}`, {
                headers: { Authentication: token }
            });
            const data = res?.data?.submission;
            console.log("history att-quiz data", data);
            return data;
        } catch (error) {
            console.log(error)
        }
    }
)