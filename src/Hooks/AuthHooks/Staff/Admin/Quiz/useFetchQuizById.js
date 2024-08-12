import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../config/Common";

const useFetchQuizById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quiz, setQuiz] = useState(null);

  const { role } = useSelector((store) => store.Auth);

  const fetchQuizById = useCallback(
    async (quizId) => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.get(`${baseUrl}/admin/quiz/${quizId}`, {
          headers: { Authentication: token },
        });
        console.log("quiz Fetched response", response.data);
        if (response.data.success) {
          setQuiz(response.data.quiz);
        } else {
          toast.error("Quiz not found");
          setError("Quiz not found");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to fetch quiz";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [role, baseUrl]
  );

  return { loading, error, fetchQuizById, quiz };
};

export default useFetchQuizById;
