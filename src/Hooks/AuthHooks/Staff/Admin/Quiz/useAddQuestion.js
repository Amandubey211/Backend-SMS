import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../../config/Common";

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

      // Add conditional validation based on question type
      if (type === "text") {
        // Only require these fields for "text" type
        if (!questionText) missingFields.push("Question Text");
        if (!questionPoint) missingFields.push("Question Point");
      } else {
        // For non-"text" types, validate options and correct answer
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
          `${baseUrl}/admin/add_question/quiz/${quizId}`, // Adjust the API endpoint as needed
          {
            questionText,
            questionPoint,
            type,
            options: type !== "text" ? options : undefined, // Include options only if type is not text
            correctAnswer: type !== "text" ? correctAnswer : undefined, // Include correctAnswer only if type is not text
            correctAnswerComment:
              type !== "text" ? correctAnswerComment : undefined, // Include correctAnswerComment only if type is not text
            inCorrectAnswerComment:
              type !== "text" ? inCorrectAnswerComment : undefined, // Include inCorrectAnswerComment only if type is not text
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
