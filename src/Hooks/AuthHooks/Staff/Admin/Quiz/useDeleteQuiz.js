import { useState, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const useDeleteQuiz = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;
  const role = useSelector((store) => store.Auth.role);

  const deleteQuiz = useCallback(
    async (quizId) => {
      setLoading(true);
      setError(null);
      setSuccess(null);

      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.delete(
          `${API_URL}/admin/delete_quiz/${quizId}`,
          {
            headers: {
              Authentication: token,
            },
          }
        );
        console.log(response.data);
        if (response.data && response.data.success) {
          setSuccess(response.data.msg || "Quiz deleted successfully!");
          toast.success(response.data.msg || "Quiz deleted successfully!");
        } else {
          setError(response.data.msg || "Failed to delete quiz.");
          toast.error(response.data.msg || "Failed to delete quiz.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Error in deleting quiz");
      } finally {
        setLoading(false);
      }
    },
    [role, API_URL]
  );

  return { loading, error, success, deleteQuiz };
};

export default useDeleteQuiz;
