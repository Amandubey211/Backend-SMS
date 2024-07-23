import { useState, useCallback } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { setModules } from "../../../../../Redux/Slices/Admin/SubjectSlice";
import { baseUrl } from "../../../../../config/Common";

const useGetModulesForStudent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modulesData, setModulesData] = useState(null);
  const role = useSelector((store) => store.Auth.role);
  
  const { cid, sid } = useParams();
  const dispatch = useDispatch();
  const fetchModules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem(`${role}:token`);
      const response = await axios.get(
        `${baseUrl}/admin/student/classes/${cid}/modules/${sid}`,
        {
          headers: { Authentication: token },
        }
      );
      console.log(response.data);
      if (response.data && response.data.success) {
        dispatch(setModules(response.data.data.modules));
        setModulesData(response.data.data);
      } else {
        dispatch(setModules([]));
        setError(response.data.msg || "Failed to fetch modules.");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error in fetching modules";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [role, baseUrl]);

  return { loading, error, modulesData, fetchModules };
};

export default useGetModulesForStudent;
