import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../config/Common";
const useFetchQuizById = (quizId) => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.Auth.role);

  const fetchQuizById = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem(`${role}:token`);
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axios.get(`${baseUrl}/student/quiz/${quizId}`, {
        headers: {
          Authentication: token,
        },
      });

      if (response.data.success) {
        setQuiz(response.data.quiz);
      } else {
        throw new Error(response.data.message || "Failed to fetch quiz");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [quizId, role]);

  useEffect(() => {
    if (quizId) {
      fetchQuizById();
    }
  }, [quizId, fetchQuizById]);

  return { quiz, loading, error, refetch: fetchQuizById };
};

export default useFetchQuizById;
