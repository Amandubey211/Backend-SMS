import { useState, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const useUpdateQuiz = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.Auth.role);

  const updateQuiz = useCallback(
    async (quizId, quizData) => {
      const {
        name,
        quizType,
        allowShuffleAnswers,
        timeLimit,
        studentSeeAnswer,
        showAnswerDate,
        showOneQuestionOnly,
        lockQuestionAfterAnswering,
        allowedAttempts,
        allowNumberOfAttempts,
        acessCode,
        publish,
        correctAnswerComment,
        inCorrectAnswerComment,
        assignTo,
        sectionId,
        availableFrom,
        dueDate,
        content,
        classId,
        subjectId,
        moduleId,
        chapterId,
      } = quizData;

      const missingFields = [];

      if (!name) missingFields.push("Quiz Name");
      if (!quizType) missingFields.push("Quiz Type");
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
          `${API_URL}/admin/update_quiz/${quizId}`, // Adjust the API endpoint as needed
          {
            name,

            quizType,
            allowShuffleAnswers,
            timeLimit,
            studentSeeAnswer,
            showAnswerDate,
            showOneQuestionOnly,
            lockQuestionAfterAnswering,
            allowedAttempts,
            allowNumberOfAttempts,
            acessCode,
            publish,
            correctAnswerComment,
            inCorrectAnswerComment,
            assignTo,
            sectionId,
            availableFrom,
            dueDate,
            content,
            classId,
            subjectId,
            moduleId,
            chapterId,
          },
          {
            headers: { Authentication: token },
          }
        );

        const { quiz } = response.data;

        setLoading(false);
        toast.success("Quiz updated successfully");
        return { success: true, quiz };
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to update quiz";
        toast.error(errorMessage);
        setLoading(false);
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [role]
  );

  return { updateQuiz, loading, error };
};

export default useUpdateQuiz;
