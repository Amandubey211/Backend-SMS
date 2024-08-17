import { useState } from "react";

const useSubmitQuiz = (quizId, attemptHistory, setAttemptHistory, allowNumberOfAttempts) => {
  const [quizResults, setQuizResults] = useState({
    totalPoints: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  });

  const submitQuiz = async (answers, timeTaken) => {
    try {
      const token = localStorage.getItem("student:token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `http://localhost:8080/student/studentquiz/submit/${quizId}`,
        {
          method: "POST",
          headers: {
            Authentication: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ studentAnswers: answers, timeTaken }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setQuizResults({
          totalPoints: data.score,
          correctAnswers: data.rightAnswer,
          wrongAnswers: data.wrongAnswer,
        });

        const newAttempt = {
          attempts: attemptHistory.length + 1,
          score: data.score,
          rightAnswer: data.rightAnswer,
          wrongAnswer: data.wrongAnswer,
          questions: answers,
        };

        setAttemptHistory((prev) => [...prev, newAttempt]);

        return newAttempt;
      } else {
        console.error("Failed to submit quiz:", data.message);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
    return null;
  };

  return { submitQuiz, quizResults };
};

export default useSubmitQuiz;
