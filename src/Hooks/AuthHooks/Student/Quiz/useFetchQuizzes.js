import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../../../config/Common";

const useFetchQuizzes = (selectedClass, selectedSubject) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const role = useSelector((store) => store.Auth.role);
  const { cid, sid } = useParams(); // Class ID and Subject ID from params

  // Cache key for localStorage
  const cacheKey = useMemo(
    () => `quizzes-${cid}-${selectedClass}-${sid}`,
    [cid, selectedClass, sid]
  );

  const fetchFilteredQuizzes = useCallback(
    async (moduleId = "", chapterId = "") => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem(`student:token`);
      if (!token) {
        setError("Authentication token not found");
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get(
          `${baseUrl}/student/studentquiz/class/${selectedClass}`,
          {
            headers: { Authentication: token },
            params: { subjectId: selectedSubject, moduleId, chapterId },
          }
        );

        if (data.success && data.quizzes) {
          setQuizzes(data.quizzes);
          localStorage.setItem(cacheKey, JSON.stringify(data.quizzes)); // Cache the quizzes
        } else {
          throw new Error(data.message || "No quizzes found");
        }
      } catch (err) {
        setError(err.message || "Error fetching quizzes");
      } finally {
        setLoading(false);
      }
    },
    [selectedClass, selectedSubject, cacheKey]
  );

  // Fetch data or load from cache on initial render
  useEffect(() => {
    const cachedData = JSON.parse(localStorage.getItem(cacheKey));
    if (cachedData) {
      setQuizzes(cachedData);
      setLoading(false);
    } else {
      fetchFilteredQuizzes();
    }
  }, [fetchFilteredQuizzes, cacheKey]);

  return { quizzes, loading, error, fetchFilteredQuizzes };
};

export default useFetchQuizzes;
