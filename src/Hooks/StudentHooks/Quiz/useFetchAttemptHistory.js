import { useEffect } from "react";

const useFetchAttemptHistory = (
  quizId,
  allowedAttempts, // Check if attempts are unlimited
  allowNumberOfAttempts, // If allowedAttempts is false, use this to limit attempts
  setAttemptHistory,
  setQuizSubmitted
) => {
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
          throw new Error(
            `Failed to fetch attempt history, status: ${response.status}`
          );
        }

        const data = await response.json();

        if (data.success && data.submission) {
          setAttemptHistory(data.submission);

          if (allowedAttempts) {
            // Unlimited attempts, so always allow quiz submission
            // setQuizSubmitted(false);
            setQuizSubmitted(true);
          } else {
            // Limited attempts based on allowNumberOfAttempts
            setQuizSubmitted(data.submission.length >= allowNumberOfAttempts);
          }
        } else {
          setQuizSubmitted(false);
          console.error("No attempt history data or unsuccessful response");
        }
      } catch (error) {
        console.error("Failed to fetch attempt history:", error);
      }
    };

    fetchAttemptHistory();
  }, [
    quizId,
    allowedAttempts,
    allowNumberOfAttempts,
    setAttemptHistory,
    setQuizSubmitted,
  ]);
};

export default useFetchAttemptHistory;
