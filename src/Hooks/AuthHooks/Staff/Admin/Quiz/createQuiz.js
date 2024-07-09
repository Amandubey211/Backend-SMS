import { useState, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useCloudinary } from './useCloudinary'; // Assuming you have a custom hook for Cloudinary

const useCreateQuiz = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.Auth.role);
  const { uploadImage } = useCloudinary(); // Custom hook for handling Cloudinary upload

  const createQuiz = useCallback(
    async (quizData) => {
      const {
        name, quizType, allowShuffleAnswers, timeLimit, studentSeeAnswer, showAnswerDate,
        showOneQuestionOnly, lockQuestionAfterAnswering, allowedAttempts, allowNumberOfAttempts,
        acessCode, publish, correctAnswerComment, inCorrectAnswerComment, assignTo, sectionId,
        availableFrom, dueDate, content, classId, subjectId, moduleId, chapterId, thumbnail
      } = quizData;

      const missingFields = [];

      if (!name) missingFields.push("Quiz Name");
      if (!quizType) missingFields.push("Quiz Type");
      if (missingFields.length > 0) {
        toast.error(`Please fill out the following fields: ${missingFields.join(", ")}`);
        return { success: false, error: "Validation Error" };
      }

      setLoading(true);
      setError(null);

      try {
        let imageUrl = '';
        if (thumbnail) {
          const result = await uploadImage(thumbnail);
          imageUrl = result.secure_url;
        }

        const API_URL = process.env.REACT_APP_API_URL;
        const token = localStorage.getItem(`${role}:token`);

        const response = await axios.post(
          `${API_URL}/quizzes/create`, // Adjust the API endpoint as needed
          {
            name, thumbnail: imageUrl, quizType, allowShuffleAnswers, timeLimit, studentSeeAnswer,
            showAnswerDate, showOneQuestionOnly, lockQuestionAfterAnswering, allowedAttempts,
            allowNumberOfAttempts, acessCode, publish, correctAnswerComment, inCorrectAnswerComment,
            assignTo, sectionId, availableFrom, dueDate, content, classId, subjectId, moduleId,
            chapterId
          },
          {
            headers: { Authentication: token },
          }
        );

        const { data } = response.data;

        console.log(data);
        setLoading(false);
        toast.success("Quiz created successfully");
        return { success: true, data };
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to create quiz";
        toast.error(errorMessage);
        setLoading(false);
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [role, uploadImage]
  );

  return { createQuiz, loading, error };
};

export default useCreateQuiz;
