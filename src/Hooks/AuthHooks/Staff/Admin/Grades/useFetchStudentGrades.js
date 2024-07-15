import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const useFetchStudentGrades = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [grades, setGrades] = useState([]);
  const [totals, setTotals] = useState({
    totalScoreOfAllAssignments: 0,
    totalScoreOfAllQuizzes: 0,
    totalScoreOfSubmitAssignments: 0,
    totalQuizCompletedScore: 0,
    total: 0,
    attendance: 0,
  });

  const API_URL = process.env.REACT_APP_API_URL;
  const { role } = useSelector((store) => store.Auth);
  const { sid, cid } = useParams();

  const fetchStudentGrades = useCallback(
    async (
      moduleId = null,
      assignmentId = null,
      quizId = null,
      chapterId = null,
      status = null,
      arrangeBy = "assignment",
      studentId
    ) => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.get(
          `${API_URL}/admin/grades/student/${studentId}/class/${cid}/subject/${sid}`,
          {
            headers: { Authentication: token },
            params: {
              moduleId,
              assignmentId,
              quizId,
              chapterId,
              status,
              arrangeBy,
            },
          }
        );

        if (response.data.success) {
          setGrades(response.data.grades);
          setTotals({
            totalScoreOfAllAssignments:
              response.data.totalScoreOfAllAssignments,
            totalScoreOfAllQuizzes: response.data.totalScoreOfAllQuizzes,
            totalScoreOfSubmitAssignments:
              response.data.totalScoreOfSubmitAssignments,
            totalQuizCompletedScore: response.data.totalQuizCompletedScore,
            total: response.data.total,
            attendance: response.data.attendance,
          });
        } else {
          toast.error("Failed to fetch grades");
          setError("Failed to fetch grades");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Error fetching grades";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [role, API_URL, sid, cid]
  );

  return { loading, error, fetchStudentGrades, grades, totals };
};

export default useFetchStudentGrades;
