import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const useFetchClassGrades = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [grades, setGrades] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL;
  const { role } = useSelector((store) => store.Auth);
  const { cid, sid } = useParams();

  const fetchClassGrades = useCallback(
    async (
      moduleId = null,
      assignmentId = null,
      quizId = null,
      studentId = null
    ) => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.get(
          `${API_URL}/admin/grades/class/${cid}/subject/${sid}`,
          {
            headers: { Authentication: token },
            params: { moduleId, assignmentId, quizId, studentId },
          }
        );

        if (response.data.success) {
          setGrades(response.data.gradesResult);
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
    [role, API_URL, cid, sid]
  );

  return { loading, error, fetchClassGrades, grades };
};

export default useFetchClassGrades;
