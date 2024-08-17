import { useEffect } from "react";

const useFetchAttemptHistory = (quizId, allowNumberOfAttempts, setAttemptHistory, setQuizSubmitted) => {
  useEffect(() => {
    const fetchAttemptHistory = async () => {
      try {
        const token = localStorage.getItem("student:token");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch(
          `http://localhost:8080/student/studentquiz/${quizId}/attempt`,
          {
            headers: {
              Authentication: token,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch attempt history, status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success && data.submission) {
          setAttemptHistory(data.submission);
          setQuizSubmitted(data.submission.length >= allowNumberOfAttempts);
        } else {
          setQuizSubmitted(false);
          console.error("No attempt history data or unsuccessful response");
        }
      } catch (error) {
        console.error("Failed to fetch attempt history:", error);
      }
    };

    fetchAttemptHistory();
  }, [quizId, allowNumberOfAttempts, setAttemptHistory, setQuizSubmitted]);
};

export default useFetchAttemptHistory;
