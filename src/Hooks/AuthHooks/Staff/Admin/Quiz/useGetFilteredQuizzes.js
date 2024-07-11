import { useState, useCallback, useMemo } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const useGetFilteredQuizzes = () => {
  const [state, setState] = useState({
    loading: false,
    error: null,
    quizzes: [],
  });
  const role = useSelector((store) => store.Auth.role);
  const API_URL = useMemo(() => process.env.REACT_APP_API_URL, []);
  const { cid } = useParams();

  const fetchFilteredQuizzes = useCallback(
    async (moduleId, chapterId, publish) => {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));

      try {
        const token = localStorage.getItem(`${role}:token`);
        const params = {
          ...(moduleId && { moduleId }),
          ...(chapterId && { chapterId }),
          ...(publish !== undefined && { publish }),
        };

        const response = await axios.get(`${API_URL}/admin/quizzes/${cid}`, {
          headers: { Authentication: token },
          params,
        });

        if (response.data?.success) {
          setState({ loading: false, error: null, quizzes: response.data.quizzes });
        } else {
          setState((prevState) => ({
            ...prevState,
            loading: false,
            error: response.data?.msg || "Failed to fetch quizzes.",
          }));
        }
      } catch (err) {
        setState((prevState) => ({
          ...prevState,
          loading: false,
          error: err.response?.data?.message || "Error in fetching quizzes",
        }));
      }
    },
    [role, API_URL, cid]
  );

  return { ...state, fetchFilteredQuizzes };
};

export default useGetFilteredQuizzes;
