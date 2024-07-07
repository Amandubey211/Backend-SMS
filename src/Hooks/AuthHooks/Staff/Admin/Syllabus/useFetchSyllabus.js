import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const useFetchSyllabus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [syllabi, setSyllabi] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL;
  const { role } = useSelector((store) => store.Auth);

  const fetchSyllabus = useCallback(
    async (subjectId, classId) => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.get(
          `${API_URL}/admin/syllabus/${subjectId}/class/${classId}`,
          {
            headers: {
              Authentication: token,
            },
          }
        );
        if (response.data.status) {
          setSyllabi(response.data.data);
          toast.success("Syllabus fetched successfully!");
        } else {
          toast.error("Failed to fetch syllabus");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to fetch syllabus";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [role, API_URL]
  );

  return { loading, error, syllabi, fetchSyllabus };
};

export default useFetchSyllabus;
