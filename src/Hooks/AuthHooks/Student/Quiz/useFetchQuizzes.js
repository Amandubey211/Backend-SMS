import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../../config/Common";
import { useParams } from "react-router-dom";

const useFetchQuizzes = (selectedClass, selectedSubject) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.Auth.role);
  const { cid, sid } = useParams(); // Assuming sid is the subject ID

  // Caching
  const cacheKey = useMemo(() => `quizzes-${cid}-${selectedClass}-${sid}`, [cid, selectedClass, sid]);
  const cachedData = useMemo(() => JSON.parse(localStorage.getItem(cacheKey)), [cacheKey]);

  const fetchFilteredQuizzes = useCallback(async (selectedClass, selectedSubject, moduleId, chapterId) => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem(`${role}:token`);
    if (!token) {
      setError("Authentication token not found");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${baseUrl}/student/studentquiz/class/${selectedClass}`,
        {
          headers: {
            Authentication: token,
          },
          params: {
            subjectId: selectedSubject,
            moduleId,
            chapterId,
          },
        }
      );

      if (response.data.success && response.data.quizzes) {
        setQuizzes(response.data.quizzes);
        localStorage.setItem(cacheKey, JSON.stringify(response.data.quizzes)); // Cache the data
      } else {
        throw new Error(response.data.message || "Failed to fetch quizzes");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [selectedClass, selectedSubject, role, cacheKey]);

  useEffect(() => {
    if (cachedData) {
      setQuizzes(cachedData);
      setLoading(false);
    } else {
      fetchFilteredQuizzes(selectedClass, selectedSubject, "", "");
    }
  }, [selectedClass, selectedSubject, fetchFilteredQuizzes, cachedData]);

  const memoizedQuizzes = useMemo(() => quizzes, [quizzes]);

  return { quizzes: memoizedQuizzes, loading, error, fetchFilteredQuizzes };
};

export default useFetchQuizzes;
