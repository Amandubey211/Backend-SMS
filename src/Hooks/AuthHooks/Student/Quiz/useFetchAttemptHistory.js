import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const useFetchAttemptHistory = (quizId) => {
  const [attemptHistory, setAttemptHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.Auth.role);

  useEffect(() => {
    const fetchAttemptHistory = async () => {
      try {
        const token = localStorage.getItem(`${role}:token`);
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await axios.get(
          `/student/studentquiz/${quizId}/attempt`,
          {
            headers: {
              Authentication: token,
            },
          }
        );

        if (response.data.success && response.data.submission) {
          setAttemptHistory(response.data.submission);
        } else {
          setAttemptHistory([]);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (quizId) {
      fetchAttemptHistory();
    }
  }, [quizId, role]);

  return { attemptHistory, loading, error };
};

export default useFetchAttemptHistory;
