import { useState, useCallback, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const useGetModulesForStudent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modulesData, setModulesData] = useState([]);
  const cache = useRef({});

  const role = useSelector((store) => store.Auth.role);
  const API_URL = process.env.REACT_APP_API_URL;

  const fetchModules = useCallback(
    async (classId, studentId) => {
      console.log(classId, studentId);
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem(`${role}:token`);
        const response = await axios.get(`${API_URL}/api/teacher/modules/get`, {
          headers: { Authentication: token },
          params: { classId, studentId },
        });
        console.log(response.data);
        if (response.data && response.data.success) {
          setModulesData(response.data.data);
        } else {
          toast.error(
            response.data.msg || "No modules found for this student."
          );
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.msg || "Failed to fetch modules for the student";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [role, API_URL]
  );

  return { loading, error, modulesData, fetchModules };
};

export default useGetModulesForStudent;
