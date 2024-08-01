import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useGetModulesForStudent from "./useGetModulesForStudent";
import { baseUrl } from "../../../../../config/Common";

const useDeleteModule = (fetchModules) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const role = useSelector((store) => store.Auth.role);
  const { sid } = useParams();

  const deleteModule = useCallback(
    async (moduleId) => {
      setLoading(true);
      setError(null);
      setSuccess(null);

      try {
        const token = localStorage.getItem(`${role}:token`);

        const response = await axios.delete(
          `${baseUrl}/admin/subjects/${sid}/modules/${moduleId}`,
          {
            headers: {
              Authentication: token,
            },
          }
        );

        if (response.data && response.data.success) {
          setSuccess(response.data.msg || "Module deleted successfully!");
          toast.success(response.data.msg || "Module deleted successfully!");
          fetchModules(); // Refetch modules after deletion
          return { success: true };
        } else {
          const errorMsg = response.data.msg || "Failed to delete module.";
          setError(errorMsg);
          toast.error(errorMsg);
          return { success: false, error: errorMsg };
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Error in deleting module";
        setError(errorMessage);
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [role, sid, fetchModules]
  );

  return { loading, error, success, deleteModule };
};

export default useDeleteModule;
