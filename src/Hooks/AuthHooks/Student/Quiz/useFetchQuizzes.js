import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { baseUrl } from "../../../../config/Common";

const useFetchQuizzes = (selectedClass, selectedSubject) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const role = useSelector((store) => store.Auth.role);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem(`${role}:token`);
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await axios.get(
          `${baseUrl}/student/studentquiz/class/${selectedClass}`,
          {
            headers: {
                Authentication: token,
            },
            params: {
              subjectId: selectedSubject,
            },
          }
        );

        if (response.data.success && response.data.quizzes) {
          setQuizzes(response.data.quizzes);
        } else {
          throw new Error("No quiz data or unsuccessful response");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [selectedClass, selectedSubject, role]);

  const memoizedQuizzes = useMemo(() => quizzes, [quizzes]);

  return { quizzes: memoizedQuizzes, loading, error };
};

export default useFetchQuizzes;
