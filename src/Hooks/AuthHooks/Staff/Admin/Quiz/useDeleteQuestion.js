import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const useDeleteQuestion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.Auth.role);

  const deleteQuestion = useCallback(
    async (quizId, questionId) => {
      if (!quizId || !questionId) {
        toast.error("Quiz ID and Question ID are required.");
        return { success: false, error: "Validation Error" };
      }

      setLoading(true);
      setError(null);

      try {
        const API_URL = process.env.REACT_APP_API_URL;
        const token = localStorage.getItem(`${role}:token`);

        const response = await axios.delete(
          `${API_URL}/quiz/${quizId}/question/${questionId}`,
          {
            headers: { Authentication: token },
          }
        );

        const { quiz } = response.data;

        setLoading(false);
        toast.success("Question deleted successfully");
        return { success: true, quiz };
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to delete question";
        toast.error(errorMessage);
        setLoading(false);
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [role]
  );

  return { deleteQuestion, loading, error };
};

export default useDeleteQuestion;
