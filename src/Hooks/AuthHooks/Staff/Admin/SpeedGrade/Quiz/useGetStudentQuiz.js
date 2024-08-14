import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../../config/Common";

const useGetStudentQuiz = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quizDetails, setQuizDetails] = useState(null);
  const role = useSelector((store) => store.Auth.role);

  const fetchStudentQuiz = useCallback(
    async (studentId, quizId) => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.get(`${baseUrl}/admin/speed_grade/quiz`, {
          headers: { Authentication: token },
          params: { studentId, quizId },
        });

        if (response.data.success) {
          setQuizDetails(response.data.data); // Store the quiz details in local state
          return response.data.data;
        } else {
          // toast.error(
          //   response.data.message ||
          //     "Failed to fetch quiz details. Please try again."
          // );
          return null;
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to fetch quiz details";
        // toast.error(errorMessage);
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [baseUrl, role]
  );

  return { loading, error, quizDetails, fetchStudentQuiz };
};

export default useGetStudentQuiz;
