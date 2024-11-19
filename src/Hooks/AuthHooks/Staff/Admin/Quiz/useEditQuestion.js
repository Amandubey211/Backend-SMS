import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../config/Common";

const useEditQuestion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.Auth.role);

  const editQuestion = useCallback(
    async (quizId, questionId, questionData) => {
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
      if (!questionId) missingFields.push("Question ID");
      if (type === "text") {
        // Validation for text type questions
        if (!questionText) missingFields.push("Question Text");
        if (!questionPoint) missingFields.push("Question Point");
        if (!type) missingFields.push("Type");
      } else {
        // Validation for non-text type questions
        if (!questionText) missingFields.push("Question Text");
        if (!questionPoint) missingFields.push("Question Point");
        if (!type) missingFields.push("Type");
        if (!options || options.length === 0) missingFields.push("Options");
        if (!correctAnswer) missingFields.push("Correct Answer");
      }

      if (missingFields.length > 0) {
        toast.error(
          `Please fill out the following fields: ${missingFields.join(", ")}`
        );
        return { success: false, error: "Validation Error" };
      }

      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem(`${role}:token`);

        const response = await axios.put(
          `${baseUrl}/admin/quiz/${quizId}/question/${questionId}`, // Adjust the API endpoint as needed
          {
            questionText,
            questionPoint,
            type,
            options,
            correctAnswer, // Ensure correctAnswer is included as a string
            correctAnswerComment,
            inCorrectAnswerComment,
          },
          {
            headers: { Authentication: token },
          }
        );

        const { quiz } = response.data;

        setLoading(false);
        return { success: true, quiz };
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to update question";
        toast.error(errorMessage);
        setLoading(false);
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [role]
  );

  return { editQuestion, loading, error };
};

export default useEditQuestion;
