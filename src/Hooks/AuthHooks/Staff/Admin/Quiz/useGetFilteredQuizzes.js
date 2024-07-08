import { useState, useCallback } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
// import { setQuizzes } from "../../../../../Redux/Slices/Admin/QuizSlice";

const useGetFilteredQuizzes = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const dispatch = useDispatch();
  const role = useSelector((store) => store.Auth.role);
  const API_URL = process.env.REACT_APP_API_URL;
  const { classId } = useParams();
  const schoolId = useSelector((store) => store.Auth.schoolId);

  const fetchFilteredQuizzes = useCallback(
    async (moduleId, chapterId, publish) => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem(`${role}:token`);
        const params = {};

        if (moduleId) params.moduleId = moduleId;
        if (chapterId) params.chapterId = chapterId;
        if (publish !== undefined) params.publish = publish;

        const response = await axios.get(
          `${API_URL}/quizzes/${classId}`,
          {
            headers: {
              Authentication: token,
            },
            params: {
              ...params,
              schoolId,
            },
          }
        );
        
        console.log(response.data);
        if (response.data && response.data.success) {
          setQuizzes(response.data.quizzes);
        //   dispatch(setQuizzes(response.data.quizzes));
        } else {
          setError(response.data.msg || "Failed to fetch quizzes.");
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Error in fetching quizzes"
        );
      } finally {
        setLoading(false);
      }
    },
    [role, API_URL, classId, schoolId]
  );

  return { loading, error, quizzes, fetchFilteredQuizzes };
};

export default useGetFilteredQuizzes;
