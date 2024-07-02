import { useState, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const useGetModulesForStudent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modulesData, setModulesData] = useState(null);

  const role = useSelector((store) => store.Auth.role);
  const API_URL = process.env.REACT_APP_API_URL;
  const { cid, sid } = useParams();
  const fetchModules = useCallback(async () => {
    console.log("heyeef");
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem(`${role}:token`);
      const response = await axios.get(
        `${API_URL}/admin/student/classes/${cid}/modules/${sid}`,
        {
          headers: { Authentication: token },
        }
      );
      console.log(response.data);
      if (response.data && response.data.success) {
        setModulesData(response.data.data);
      } else {
        setError(response.data.msg || "Failed to fetch modules.");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error in fetching modules";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [role, API_URL]);

  return { loading, error, modulesData, fetchModules };
};

export default useGetModulesForStudent;
