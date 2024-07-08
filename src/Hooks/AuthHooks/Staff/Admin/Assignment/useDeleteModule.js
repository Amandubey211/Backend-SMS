import { useState, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useGetModulesForStudent from "./useGetModulesForStudent";

const useDeleteModule = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;
  const role = useSelector((store) => store.Auth.role);
  const { sid } = useParams();
  const {fetchModules} = useGetModulesForStudent()

  const deleteModule = useCallback(
    async (moduleId) => {
        console.log(moduleId)
      setLoading(true);
      setError(null);
      setSuccess(null);

      try {
        const token = localStorage.getItem(`${role}:token`);

        const response = await axios.delete(
          `${API_URL}/admin/subjects/${sid}/modules/${moduleId}`,
          {
            headers: {
              Authentication: token,
            },
          }
        );

        if (response.data && response.data.success) {
          setSuccess(response.data.msg || "Module deleted successfully!");
          fetchModules()
        } else {
          setError(response.data.msg || "Failed to delete module.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Error in deleting module");
      } finally {
        setLoading(false);
      }
    },
    [role, API_URL]
  );

  return { loading, error, success, deleteModule };
};

export default useDeleteModule;
