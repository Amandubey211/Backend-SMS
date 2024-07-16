import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const useAddQuestion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.Auth.role);

  const addQuestion = useCallback(
    async (quizId, questionData) => {
      const {
        questionText,
        questionPoint,
        type,
        options,
        correctAnswer,
        correctAnswerComment,
        inCorrectAnswerComment,
      } = questionData;

      const missingFields = [];
      if (!quizId) missingFields.push("Quiz ID");
      if (!questionText) missingFields.push("Question Text");
      if (!questionPoint) missingFields.push("Question Point");
      if (!type) missingFields.push("Type");
      if (!options || options.length === 0) missingFields.push("Options");
      if (type !== "text" && !correctAnswer) missingFields.push("Correct Answer");

      if (missingFields.length > 0) {
        toast.error(
          `Please fill out the following fields: ${missingFields.join(", ")}`
        );
        return { success: false, error: "Validation Error" };
      }

      setLoading(true);
      setError(null);

      try {
        const API_URL = process.env.REACT_APP_API_URL;
        const token = localStorage.getItem(`${role}:token`);

        const response = await axios.put(
          `${API_URL}/admin/add_question/quiz/${quizId}`, // Adjust the API endpoint as needed
          {
            questionText,
            questionPoint,
            type,
            options,
            correctAnswer: type !== "text" ? correctAnswer : undefined, // Include correctAnswer only if type is not text
            correctAnswerComment,
            inCorrectAnswerComment,
          },
          {
            headers: { Authentication: token },
          }
        );

        const { quiz } = response.data;

        setLoading(false);
        toast.success("Question added successfully");
        return { success: true, quiz };
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to add question";
        toast.error(errorMessage);
        setLoading(false);
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [role]
  );

  return { addQuestion, loading, error };
};

export default useAddQuestion;
