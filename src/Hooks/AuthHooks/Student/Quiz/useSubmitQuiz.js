import { useState, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const useSubmitQuiz = (quizId) => {
  const [quizResults, setQuizResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.Auth.role);

  const submitQuiz = useCallback(
    async (answers, timeTaken) => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem(`${role}:token`);
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await axios.post(
          `/student/studentquiz/submit/${quizId}`,
          { studentAnswers: answers, timeTaken },
          {
            headers: {
              Authentication: token,
            },
          }
        );

        if (response.data.success) {
          setQuizResults({
            totalPoints: response.data.score,
            correctAnswers: response.data.rightAnswer,
            wrongAnswers: response.data.wrongAnswer,
          });
        } else {
          throw new Error(response.data.message || "Failed to submit quiz");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    },
    [quizId, role]
  );

  return { quizResults, loading, error, submitQuiz };
};

export default useSubmitQuiz;
